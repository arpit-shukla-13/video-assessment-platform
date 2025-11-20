import Keycloak from 'keycloak-js';

// Keycloak ka configuration - Environment variables se
const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:9000',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'talentvisio',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'nextjs-app',
};

// Singleton instance (taaki baar-baar naya connection na bane)
let keycloak;

export const getKeycloakInstance = () => {
  if (!keycloak && typeof window !== 'undefined') {
    keycloak = new Keycloak(keycloakConfig);
  }
  return keycloak;
};