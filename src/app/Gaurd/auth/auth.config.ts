//Auth-config.ts
import {
  LogLevel,
  Configuration,
  BrowserCacheLocation,
} from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
      clientId: ' 4fdd2973-09a8-4c28-a786-16f63cf33207',
      authority: 'https://login.microsoftonline.com/5b751804-232f-410d-bb2f-714e3bb466eb',
      redirectUri:"http://localhost:4200/auth",
      postLogoutRedirectUri: 'https://localhost:4200/sso',
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
