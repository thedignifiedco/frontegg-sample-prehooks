/**
 * JWT Generation prehook
 * Filters out any roles that start with the prefix "soyshare" (case-insensitive).
 *
 * @param {JwtGenerationEventData} eventData
 * @returns {Promise<JwtGenerationHandlerResponse>}
 */
async function onEvent(eventData) {
  const tenantId = eventData?.data?.claims?.tenantId || eventData?.prehookContext?.tenantId;
  const roles = Array.isArray(eventData?.data?.claims?.roles)
    ? eventData.data.claims.roles
    : [];

  const filteredRoles = roles.filter((role) => !String(role).toLowerCase().startsWith('soyshare'));

  return {
    verdict: 'allow',
    response: {
      claims: {
        tenantId,
        roles: filteredRoles,
      },
    },
  };
}

exports.onEvent = onEvent;





