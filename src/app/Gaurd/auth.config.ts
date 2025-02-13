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
      redirectUri:"https://risk-management-system-risk-ex.vercel.app/auth",
  },
  cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
  },
  system: {
      loggerOptions: {
          loggerCallback(logLevel: LogLevel, message: string) {
              console.log(message);
          },
          logLevel: LogLevel.Verbose,
          piiLoggingEnabled: false,
      },
  },
};

export const loginRequest = {
  scopes: [],
};

export const apiConfig = {
  scopes: ['user.read'],
  uri: 'https://graph.microsoft.com/v1.0/me',
};
