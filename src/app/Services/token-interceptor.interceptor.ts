import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {


    const token = inject(AuthService).getToken()
    const newReq=req.clone({
      headers:req.headers.append("Authorization",token!)
    })


  return next(newReq);
};
