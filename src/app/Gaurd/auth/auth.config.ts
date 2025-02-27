//Auth-config.ts
import {
  LogLevel,
  Configuration,
  BrowserCacheLocation,
} from '@azure/msal-browser';
import { environment } from '../../../enviroments/environment';

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.ssoConfig.clientId,
    authority: environment.ssoConfig.authority,
    redirectUri: environment.ssoConfig.redirectUri,
    postLogoutRedirectUri: environment.ssoConfig.postLogoutRedirectUri,
  },
  cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: true,
  },
  system: {
      loggerOptions: {
          loggerCallback(logLevel: LogLevel, message: string) {
              // console.log(message);
          },
          logLevel: LogLevel.Verbose,
          piiLoggingEnabled: false,
      },
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'user.read'],
};

export const apiConfig = {
  scopes: ['user.read'],
  uri: 'https://graph.microsoft.com/v1.0/me',
};
