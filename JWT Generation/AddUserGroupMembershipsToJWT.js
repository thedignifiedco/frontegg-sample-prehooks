/**
 * JWT Generation prehook
 * Fetches a user's group memberships from Frontegg API and adds them to the JWT token as a custom claim.
 *
 * @param {JwtGenerationEventData} eventData - the event details
 * @returns {Promise<JwtGenerationHandlerResponse>} event handler response
 */

// Token cache to avoid fetching on every request
let tokenCache = {
  token: null,
  expiresAt: 0
};

/**
 * Fetches vendor token from Frontegg API
 * @returns {Promise<string|null>} The vendor token or null if fetch fails
 */
async function fetchVendorToken() {
  try {
    // Check if cached token is still valid (with 5 minute buffer)
    const now = Date.now();
    if (tokenCache.token && tokenCache.expiresAt > now + 300000) {
      return tokenCache.token;
    }

    const clientId = process.env.FRONTEGG_CLIENT_ID;
    const secret = process.env.FRONTEGG_SECRET;

    if (!clientId || !secret) {
      console.error('FRONTEGG_CLIENT_ID and FRONTEGG_SECRET environment variables are required');
      return null;
    }

    const response = await fetch('https://api.frontegg.com/auth/vendor/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: clientId,
        secret: secret
      })
    });

    if (!response.ok) {
      console.error(`Failed to fetch vendor token: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (data.token && data.expiresIn) {
      // Cache the token with expiration time (expiresIn is in seconds)
      tokenCache.token = data.token;
      tokenCache.expiresAt = now + (data.expiresIn * 1000);
      return data.token;
    }

    return null;
  } catch (error) {
    console.error('Error fetching vendor token:', error);
    return null;
  }
}

async function fetchUserGroupMemberships(userId, tenantId, vendorToken) {
  try {
    const url = `https://api.frontegg.com/identity/resources/users/v3/groups?ids=${userId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'frontegg-tenant-id': tenantId,
        'Authorization': `Bearer ${vendorToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch group memberships: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    // The API returns an array, find the entry for this user
    const userGroupData = Array.isArray(data) 
      ? data.find(item => item.userId === userId)
      : null;

    // Extract groupIds from the response
    if (userGroupData && Array.isArray(userGroupData.groupIds)) {
      return userGroupData.groupIds;
    }

    return [];
  } catch (error) {
    console.error('Error fetching user group memberships:', error);
    return [];
  }
}

async function onEvent(eventData) {
  try {
    const userId = eventData?.prehookContext?.userId;
    const tenantId = eventData?.prehookContext?.tenantId || eventData?.data?.claims?.tenantId;
    
    // Fetch vendor token from API
    const vendorToken = await fetchVendorToken();

    if (!userId) {
      console.warn('User ID not found in event data');
      return {
        verdict: 'allow',
        response: {
          claims: {
            tenantId: tenantId,
            customClaims: {
              groupIds: []
            }
          }
        }
      };
    }

    if (!vendorToken) {
      console.warn('Failed to fetch vendor token. Please ensure FRONTEGG_CLIENT_ID and FRONTEGG_SECRET are set.');
      return {
        verdict: 'allow',
        response: {
          claims: {
            tenantId: tenantId,
            customClaims: {
              groupIds: []
            }
          }
        }
      };
    }

    // Fetch user group memberships
    const groupIds = await fetchUserGroupMemberships(userId, tenantId, vendorToken);

    // Preserve existing claims and add group memberships
    const existingClaims = eventData?.data?.claims || {};
    
    return {
      verdict: 'allow',
      response: {
        claims: {
          tenantId: tenantId,
          ...existingClaims,
          customClaims: {
            ...(existingClaims.customClaims || {}),
            groupIds: groupIds
          }
        }
      }
    };
  } catch (error) {
    console.error('Error in group memberships prehook:', error);
    // On error, allow the request but without group memberships
    return {
      verdict: 'allow',
      response: {
        claims: {
          tenantId: eventData?.prehookContext?.tenantId || eventData?.data?.claims?.tenantId,
          customClaims: {
            groupIds: []
          }
        }
      }
    };
  }
}

exports.onEvent = onEvent;

