import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../Services/auth/auth.service';

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {


    const token = inject(AuthService).getToken()

    if (shouldAddToken(req)) {
      const newReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next(newReq);

    }

    return next(req);


};

// function shouldAddToken(req: HttpRequest<any>): boolean {
//   // Define the logic to determine if the token should be added to the request
//   // For example:
//   // - Exclude specific URLs:
//     return !req.url.includes('/api/AuthControllers/Login')


//   // - Exclude specific methods:
//   //   return req.method !== 'GET';

//   // - Combine multiple conditions as needed

// }

function shouldAddToken(req: HttpRequest<any>): boolean {
  const excludedUrls = [
    '/api/AuthControllers/Login',
    'api/AuthControllers/SSOlogin'

  ];

  return !excludedUrls.some(url => req.url.includes(url));
}
