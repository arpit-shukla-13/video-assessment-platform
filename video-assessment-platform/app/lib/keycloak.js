import Keycloak from 'keycloak-js';

// Keycloak ka configuration
const keycloakConfig = {
  url: 'http://localhost:9000', // Tumhara Keycloak URL
  realm: 'talentvisio',         // Jo Realm tumne banaya
  clientId: 'nextjs-app',       // Jo Client ID tumne di
};

// Singleton instance (taaki baar-baar naya connection na bane)
let keycloak;

export const getKeycloakInstance = () => {
  if (!keycloak && typeof window !== 'undefined') {
    keycloak = new Keycloak(keycloakConfig);
  }
  return keycloak;
};