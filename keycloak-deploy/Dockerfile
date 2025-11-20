FROM quay.io/keycloak/keycloak:26.0.0

# Render Settings
ENV KC_HTTP_RELATIVE_PATH=/
ENV KC_PROXY=edge
ENV KC_HOSTNAME_STRICT=false

WORKDIR /opt/keycloak

# Command yahan fix kar di hai
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]