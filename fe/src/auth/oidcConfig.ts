import type { UserManagerSettings } from 'oidc-client-ts';

const REGION = import.meta.env.VITE_COGNITO_REGION;
const POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const SCOPES = import.meta.env.VITE_COGNITO_SCOPES ?? 'openid email profile';

export const oidcConfig: UserManagerSettings = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: `${window.location.origin}/callback`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  response_type: 'code',
  scope: SCOPES,
  automaticSilentRenew: true,
  metadata: {
    issuer: `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}`,
    authorization_endpoint: `https://${DOMAIN}/oauth2/authorize`,
    token_endpoint: `https://${DOMAIN}/oauth2/token`,
    userinfo_endpoint: `https://${DOMAIN}/oauth2/userInfo`,
    jwks_uri: `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}/.well-known/jwks.json`,
    end_session_endpoint: `https://${DOMAIN}/logout`,
  },
};

export const cognitoDomain = DOMAIN;
export const cognitoClientId = CLIENT_ID;
