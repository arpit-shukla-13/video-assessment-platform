
export const mockKeycloakLogin = () => {
  return new Promise((resolve) => {
    console.log("Connecting to Keycloak...");
    setTimeout(() => {
      resolve({
        name: "Rahul Kumar",
        email: "rahul@example.com",
        token: "mock-jwt-token-xyz-123",
        roles: ["candidate"]
      });
    }, 1500);
  });
};