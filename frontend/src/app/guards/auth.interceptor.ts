import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // LocalStorage mathi token lo
  const token = localStorage.getItem('token');

  // Jo token hoy to request ma header add karo
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // Jo token na hoy to normal request moklo
  return next(req);
};