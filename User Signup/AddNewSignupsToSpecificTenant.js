/**
 * Handle the event triggered on user signup.
 * This prehook allows assigning new users to a specific tenant and a specific role in the Frontegg system.
 * 
 * @param {SignUpEventData} eventData - Object containing event details such as user info, tenant info, etc.
 * 
 * @returns {Promise<SignUpHandlerResponse>} - A Promise that resolves with the response to be sent to Frontegg,
 *                                              determining whether to allow the signup and assigning a tenant and role.
 */
async function onEvent(eventData) {
    // Respond with a decision to allow the signup
    return {
        "verdict": 'allow', // Verdict: 'allow' or 'deny' to control access
        "response": {
            "user": {
                // Allow this user to access subaccounts associated with the tenant
                "allowSubaccountAccess": true, 
                // Assign a specific role to the new user by role ID
                "roleIds": [
                    'xxxxxx'  // Replace 'xxxxxx' with the actual role ID
                ]
            },
            "tenant": {
                // Assign the user to a specific tenant by tenant ID
                "id": 'xxxxxx'  // Replace 'xxxxxx' with the actual tenant ID
            }
        }
    };
}

// Export the event handler function to be used externally
exports.onEvent = onEvent;