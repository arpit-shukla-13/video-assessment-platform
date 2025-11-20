// Ye function real Keycloak login ko simulate karta hai
export const mockKeycloakLogin = () => {
  return new Promise((resolve) => {
    console.log("Connecting to Keycloak...");
    // 1.5 second ka delay taaki 'Loading...' dikha sakein
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