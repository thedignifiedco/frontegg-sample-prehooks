/**
 * Handle the event
 * @param {JwtGenerationEventData} eventData - the event details
 * @returns {Promise<JwtGenerationHandlerResponse>} event handler response
 */

async function fetchRandomCompany() {
  try {
    const response = await fetch('https://fake-json-api.mock.beeceptor.com/companies');
    const companies = await response.json();
    if (Array.isArray(companies) && companies.length > 0) {
      const randomCompany = companies[Math.floor(Math.random() * companies.length)];
      return randomCompany.name || "Unknown Company";
    }
  } catch (error) {
    console.error('Error fetching company data:', error);
  }
  return "Unknown Company";
}

async function onEvent(eventData) {
  const companyName = await fetchRandomCompany();
  
  return {
    "verdict": "allow",
    "response": {
      "claims": {
        "tenantId": eventData?.prehookContext.tenantId || "your-default-tenant-id",
        "customClaims": {
          "Company": companyName
        }
      }
    }
  };
}

exports.onEvent = onEvent;