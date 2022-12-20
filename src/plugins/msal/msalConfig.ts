import { LogLevel, PublicClientApplication } from '@azure/msal-browser';

const GLABS_APP_URL = import.meta.env.VITE_GLABS_APP_URL
const GLABS_API_URL = import.meta.env.VITE_GLABS_API_URL

// Config object to be passed to Msal on creation
export const msalConfig = {

auth: {
    clientId: '9bb9430a-d8f2-4ce1-b1b5-5025e333958a',
    authority: 'https://glabsdev.b2clogin.com/glabsdev.onmicrosoft.com/B2C_1_GLabs_SignUpSignIn',
    knownAuthorities: ['glabsdev.b2clogin.com'],
    redirectUri: `${GLABS_APP_URL}/auth/`, // Must be registered as a SPA redirectURI on your app registration
    postLogoutRedirectUri: `${GLABS_APP_URL}/` // Must be registered as a SPA redirectURI on your app registration
  },
  cache: {
    cacheLocation: 'localStorage'
  },
  system: {
      loggerOptions: {
          loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
              if (containsPii) {
                  return;
              }
              switch (level) {
                  case LogLevel.Error:
                      console.error(message);
                      return;
                  case LogLevel.Info:
                      console.info(message);
                      return;
                  case LogLevel.Verbose:
                      console.debug(message);
                      return;
                  case LogLevel.Warning:
                      console.warn(message);
                      return;
                  default:
                      return;
              }
          },
          logLevel: LogLevel.Verbose
      }
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  //scopes: ['User.Read', 'openid'],
  scopes: ['openid'],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  userProfileEndpoint: `${GLABS_API_URL}/users/me`
};
