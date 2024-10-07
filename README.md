Here's a generated `README.md` file for your project, including the link to Frontegg's official documentation:

---

# User Assignment Prehook for Frontegg

This project implements a **prehook** for assigning new users to a specific tenant and role when they sign up using Frontegg's signup flow. By utilizing this prehook, you can automatically manage access control and permissions for new users based on your organization’s structure.

## How it Works

The prehook listens to the `onEvent` method, which is triggered when a new user registers. The logic in this prehook:

- Allows or denies user signup based on a predefined condition.
- Automatically assigns a specific **tenant** and **role** to the user upon successful registration.
- Optionally allows the user to access subaccounts associated with the tenant.

For more details on Frontegg's prehook system, refer to the official documentation [here](https://docs.frontegg.com/docs/prehooks).

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-repo/frontegg-prehook.git
    cd frontegg-prehook
    ```

## Configuration

Before deploying, ensure you provide the following configurations:

- **Role ID**: Assign the appropriate role ID to the user for correct access control.
- **Tenant ID**: Assign the user to the correct tenant to ensure data isolation and organization.

For example:

```javascript
async function onEvent(eventData) {
    return {
        "verdict": 'allow',
        "response": {
            "user": {
                "allowSubaccountAccess": true,
                "roleIds": ['role123']  // Replace with your actual role ID
            },
            "tenant": {
                "id": 'tenant123'  // Replace with your actual tenant ID
            }
        }
    };
}
```

## Usage

1. Modify the `onEvent` handler if you want to customize the user assignment logic based on incoming event data.
2. Ensure you export the function so that Frontegg can invoke it during the signup process:

    ```javascript
    exports.onEvent = onEvent;
    ```

3. Deploy the function to your server or a serverless environment where Frontegg can access it.

## Official Documentation

To learn more about Frontegg prehooks and how they work, visit the [official documentation](https://docs.frontegg.com/docs/prehooks).

## License

This project is licensed under the MIT License. 

---

This `README.md` provides an overview of the setup, usage, and configuration required to implement the prehook for your Frontegg application.