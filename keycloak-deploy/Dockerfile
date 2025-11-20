FROM quay.io/keycloak/keycloak:26.0.0

# Render ke liye zaroori settings
ENV KC_HTTP_RELATIVE_PATH=/
ENV KC_PROXY=edge

WORKDIR /opt/keycloak
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]