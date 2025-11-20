/**
 * JWT Generation prehook
 * Adds an "onboardingRequired" flag if the user has no email.
 *
 * @param {JwtGenerationEventData} eventData
 * @returns {Promise<JwtGenerationHandlerResponse>}
 */
async function onEvent(eventData) {
  const email = eventData?.data?.claims?.email;

  const tenantId = eventData?.data?.claims?.tenantId;

  return {
    verdict: 'allow',
    response: {
      claims: {
        tenantId, // Always include tenantId
        customClaims: {
          onboardingRequired: !email, // true if no email
        },
      },
    },
  };
}

exports.onEvent = onEvent;