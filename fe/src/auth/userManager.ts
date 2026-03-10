import { UserManager } from 'oidc-client-ts'
import { hasCognito } from './config.ts'
import { oidcConfig, cognitoDomain, cognitoClientId } from './oidcConfig.ts'

class CognitoUserManager extends UserManager {
  override async signoutRedirect(): Promise<void> {
    await this.removeUser()
    const logoutUri = encodeURIComponent(`${window.location.origin}/`)
    window.location.href = `https://${cognitoDomain}/logout?client_id=${cognitoClientId}&logout_uri=${logoutUri}`
  }
}

export const userManager = hasCognito ? new CognitoUserManager(oidcConfig) : null
