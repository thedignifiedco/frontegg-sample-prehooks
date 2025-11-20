/**
 * Frontegg Signup Prehook
 *
 * Enables sub-account access for all new signups.
 *
 * @param {SignUpEventData} eventData - Details about the signup event.
 * @returns {Promise<SignUpHandlerResponse>} - Response object controlling signup behavior.
 */
async function onEvent(eventData) {
  try {
    return {
      verdict: 'allow',
      response: {
        user: {
          allowSubaccountAccess: true,
        },
      },
    };
  } catch (error) {
    return {
      verdict: 'block',
      error: {
        status: 500,
        message: ['An unexpected error occurred during signup prehook.'],
      },
    };
  }
}

exports.onEvent = onEvent;
