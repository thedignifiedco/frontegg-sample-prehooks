/**
 * JWT Generation prehook
 * Filters out any permissions that start with the prefix "pharmaB_" (also supports "pharrmB_").
 *
 * @param {JwtGenerationEventData} eventData
 * @returns {Promise<JwtGenerationHandlerResponse>}
 */
async function onEvent(eventData) {
  const tenantId = eventData?.data?.claims?.tenantId || eventData?.prehookContext?.tenantId;
  const permissions = Array.isArray(eventData?.data?.claims?.permissions)
    ? eventData.data.claims.permissions
    : [];

  // Remove permissions prefixed with pharmaB_ (or the earlier pharrmB_), case-insensitive
  const filteredPermissions = permissions.filter((permission) => {
    const p = String(permission);
    return !(p.toLowerCase().startsWith("pharmab_") || p.toLowerCase().startsWith("pharrmb_"));
  });

  return {
    verdict: 'allow',
    response: {
      claims: {
        tenantId,
        permissions: filteredPermissions,
      },
    },
  };
}

exports.onEvent = onEvent;


