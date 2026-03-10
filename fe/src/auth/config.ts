/** True when Cognito env vars are set; false allows local dev without auth */
export const hasCognito =
  !!(import.meta.env.VITE_COGNITO_USER_POOL_ID &&
    import.meta.env.VITE_COGNITO_CLIENT_ID &&
    import.meta.env.VITE_COGNITO_DOMAIN)
