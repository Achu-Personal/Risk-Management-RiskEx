export const environment = {
  production: false,
  apiUrl: 'https://riskex.experionglobal.dev/api',
  // apiUrl: 'https://risk-management-riskex-backend-2.onrender.com/api',
  // apiUrl: 'https://localhost:7216/api',
  frontendUrl: 'http://localhost:4200',
  ssoConfig: {
    clientId: '4fdd2973-09a8-4c28-a786-16f63cf33207',
    authority: 'https://login.microsoftonline.com/5b751804-232f-410d-bb2f-714e3bb466eb',
    redirectUri: 'https://riskex.experionglobal.dev/auth',
    postLogoutRedirectUri: 'https://riskex.experionglobal.dev/'
  }
};
