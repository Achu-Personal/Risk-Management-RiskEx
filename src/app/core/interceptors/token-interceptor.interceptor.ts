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



function shouldAddToken(req: HttpRequest<any>): boolean {
  const excludedUrls = [
    '/api/AuthControllers/Login',
    'api/AuthControllers/SSOlogin',
    'api/ResetPass/save-reset-token',
    'api/ResetPass/reset-password',
    'api/emails'

  ];

  return !excludedUrls.some(url => req.url.includes(url));
}
