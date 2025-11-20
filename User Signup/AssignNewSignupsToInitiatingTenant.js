/**
 * Handle the event triggered on user signup.
 * Dynamically assigns the new user to the correct tenant and role based on the applicationId.
 * Falls back to the tenantId in prehookContext if no application mapping is found.
 *
 * @param {SignUpEventData} eventData - Object containing event details such as user info, tenant info, etc.
 *
 * @returns {Promise<SignUpHandlerResponse>} - A Promise that resolves with the response to be sent to Frontegg.
 */
async function onEvent(eventData) {
    try {
        const appId = eventData?.prehookContext?.applicationId;
        const fallbackTenantId = eventData?.prehookContext?.tenantId;

        // Application-to-Tenant & Role mapping
        const appTenantRoleMap = {
            'your-app-id': {
                tenantId: 'your-tenant-id',
                roleIds: ['your-role-id']
            }
            // Add more application mappings as needed
        };

        // Lookup mapping by applicationId
        const mapping = appTenantRoleMap[appId];

        let tenantId;
        let roleIds;

        if (mapping) {
            tenantId = mapping.tenantId;
            roleIds = mapping.roleIds;
        } else if (fallbackTenantId) {
            // Use tenantId from prehookContext if no application mapping is found
            tenantId = fallbackTenantId;
            roleIds = ['your-role-id']; // Default fallback role
        } else {
            // If neither mapping nor fallback tenantId exists, block signup
            return {
                verdict: 'block',
                error: {
                    status: 400,
                    message: ['No valid tenantId found for signup (no mapping or fallback).']
                }
            };
        }

        return {
            verdict: 'allow',
            response: {
                user: {
                    allowSubaccountAccess: true,
                    roleIds: roleIds
                },
                tenant: {
                    id: tenantId
                }
            }
        };
    } catch (error) {
        return {
            verdict: 'block',
            error: {
                status: 500,
                message: ['An unexpected error occurred during signup prehook']
            }
        };
    }
}

exports.onEvent = onEvent;