# Frontegg Prehook Samples

This repository contains a collection of **Frontegg Prehook Samples** that demonstrate various use cases for customizing Frontegg's authentication and authorization flows. These prehooks can be used to extend Frontegg's functionality and implement custom business logic.

## What are Prehooks?

Prehooks are serverless functions that Frontegg invokes at specific points in your authentication and authorization flows. They allow you to:

- Customize user signup and onboarding processes
- Modify JWT tokens with custom claims
- Filter roles and permissions
- Implement custom access control logic
- Integrate with third-party APIs

For more details on Frontegg's prehook system, refer to the [official documentation](https://docs.frontegg.com/docs/prehooks).

## Prehook Categories

This collection is organized by event type:

### JWT Generation Prehooks

These prehooks are triggered during JWT token generation and allow you to modify the token claims:

- **AddCustomClaimsFromA3rdPartyAPI.js** - Fetches data from a third-party API and adds it as custom claims to the JWT token
- **AddOnboardingFlagToUsersWithoutEmail.js** - Adds an onboarding flag to users who don't have an email address
- **AddUserGroupMembershipsToJWT.js** - Fetches a user's group memberships from Frontegg API and adds them to the JWT token as a custom claim
- **FilterPermissionsByPrefix.js** - Filters out permissions that start with a specific prefix (e.g., "pharmaB_")
- **FilterRolesByPrefix.js** - Filters out roles that start with a specific prefix (e.g., "soyshare")
- **RestrictAppLoginsToSpecificTenants.js** - Restricts application logins to specific tenants based on a mapping configuration

### User Signup Prehooks

These prehooks are triggered during user registration:

- **AddNewSignupsToSpecificTenant.js** - Automatically assigns new signups to a specific tenant
- **AssignNewSignupsToInitiatingTenant.js** - Assigns new signups to the tenant that initiated the signup process
- **EnableSubAccountAccessForSignUps.js** - Enables sub-account access for new user signups

### User Invited To Tenant Prehooks

Prehooks for handling user invitations to tenants (see the `User Invited To Tenant/` directory).

## Getting Started

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-repo/frontegg-sample-prehooks.git
    cd frontegg-sample-prehooks
    ```

2. **Choose a prehook** that matches your use case from the appropriate directory.

3. **Configure the prehook** according to your needs:
   - Update any hardcoded values (tenant IDs, role IDs, prefixes, etc.)
   - Set required environment variables (e.g., `FRONTEGG_CLIENT_ID`, `FRONTEGG_SECRET`)
   - Customize the logic to match your business requirements

### Environment Variables

Some prehooks require environment variables to be set. Common variables include:

- `FRONTEGG_CLIENT_ID` - Your Frontegg client ID
- `FRONTEGG_SECRET` - Your Frontegg secret
- `FRONTEGG_VENDOR_TOKEN` - Your Frontegg vendor token (if not fetched dynamically)

Make sure to set these in your deployment environment or Frontegg prehook configuration.

## Usage

1. **Select a prehook** from the collection that matches your use case.

2. **Review and customize** the prehook code:
   - Modify configuration values
   - Adjust business logic as needed
   - Add error handling if required

3. **Deploy the prehook**:
   - Deploy the function to your server or serverless environment
   - Configure the prehook in your Frontegg dashboard
   - Ensure the endpoint is accessible by Frontegg's servers

4. **Test the prehook**:
   - Trigger the corresponding event (signup, JWT generation, etc.)
   - Verify the prehook executes correctly
   - Check logs for any errors

## Example: Adding Custom Claims to JWT

Here's a simple example of how a JWT Generation prehook works:

```javascript
async function onEvent(eventData) {
  const tenantId = eventData?.prehookContext?.tenantId;
  
  return {
    verdict: 'allow',
    response: {
      claims: {
        tenantId: tenantId,
        customClaims: {
          customField: 'customValue'
        }
      }
    }
  };
}

exports.onEvent = onEvent;
```

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements or additional prehook samples.

## Official Documentation

To learn more about Frontegg prehooks and how they work, visit the [official documentation](https://docs.frontegg.com/docs/prehooks).

## License

This project is licensed under the MIT License.
