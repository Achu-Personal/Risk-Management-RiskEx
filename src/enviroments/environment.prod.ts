export const environment = {
  production: true,
  apiUrl: 'https://riskex.experionglobal.com/api',
  // apiUrl: 'https://risk-management-riskex-backend-2.onrender.com/api',
  frontendUrl: 'https://riskex.experionglobal.com',
  // frontendUrl: 'https://risk-management-system-risk-ex.vercel.app/',
  ssoConfig: {
    clientId: '89f01728-5df7-48b1-a0ab-68fb303a95d0',
    authority: 'https://login.microsoftonline.com/13ec0e67-00c5-44c4-8bdb-52adb4a2feae',
    redirectUri: 'https://riskex.experionglobal.com/auth',
    postLogoutRedirectUri: 'https://riskex.experionglobal.com/'
  }
};
