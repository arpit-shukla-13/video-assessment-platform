import Keycloak from 'keycloak-js';

// Keycloak configuration - from Environment variables
const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:9000',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'talentvisio',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'nextjs-app',
};

// Singleton Keycloak instance
let keycloak;

export const getKeycloakInstance = () => {
  if (!keycloak && typeof window !== 'undefined') {
    keycloak = new Keycloak(keycloakConfig);
  }
  return keycloak;
};