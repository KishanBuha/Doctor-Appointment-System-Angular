import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route) => {

  const router = inject(Router);
  const userRole = localStorage.getItem("role");

  const expectedRole = route.data?.['role'];

  if (userRole === expectedRole) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
