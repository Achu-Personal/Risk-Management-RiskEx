export const environment = {
  production: false,
  // apiUrl: 'https://riskex.experionglobal.com/api',
  apiUrl: 'http://localhost:5039/api',
  // apiUrl: 'https://localhost:7216/api',
  frontendUrl: 'http://localhost:4200',
  ssoConfig: {
    clientId: '89f01728-5df7-48b1-a0ab-68fb303a95d0',
    authority: 'https://login.microsoftonline.com/13ec0e67-00c5-44c4-8bdb-52adb4a2feae',
    redirectUri: 'https://riskex.experionglobal.com/auth',
    postLogoutRedirectUri: 'https://riskex.experionglobal.com/'
  }
};
