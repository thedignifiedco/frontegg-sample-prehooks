/**
 * Handle the event
 * @param {JwtGenerationEventData} eventData - the event details
 * @returns {Promise<JwtGenerationHandlerResponse>} event handler response
 */
async function onEvent(eventData) {
  try {
    // Define your mapping of application to tenant(s)
    const appTenantMap = {
      "your-application-appId": "your-tenant-id"
    };

    const currentAppId = eventData?.prehookContext?.applicationId;
    const userTenantId = eventData?.prehookContext?.tenantId;

    console.log(`Login attempt: appId=${currentAppId}, tenantId=${userTenantId}`);

    // Validate access
    if (appTenantMap[currentAppId] && userTenantId !== appTenantMap[currentAppId]) {
      console.warn(`Access denied: Tenant ${userTenantId} cannot access App ${currentAppId}`);
      return {
        verdict: "block",
        error: {
          status: 403,
          message: ["You are not authorized to access this application."]
        }
      };
    }

    // Allow login with required claims (must include tenantId)
    return {
      verdict: "allow",
      response: {
        claims: {
          tenantId: userTenantId || "default-tenant-id",
          customClaims: {
            message: "Login approved for the correct tenant and app."
          }
        }
      }
    };
  } catch (error) {
    console.error("Error in login prehook:", error);
    return {
      verdict: "block",
      error: {
        status: 500,
        message: ["An error occurred while validating your access."]
      }
    };
  }
}

exports.onEvent = onEvent;