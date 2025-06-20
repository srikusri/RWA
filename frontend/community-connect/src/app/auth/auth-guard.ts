import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth'; // Corrected import path

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Check for role-based access if route data specifies roles
    const expectedRoles = route.data?.['expectedRoles'] as Array<string>;
    if (expectedRoles && expectedRoles.length > 0) {
      const userRole = authService.getUserRole();
      if (userRole && expectedRoles.includes(userRole)) {
        return true; // Logged in and has one of the expected roles
      } else {
        // Logged in but does not have the required role
        console.warn(
          `User role '${userRole}' not authorized for route '${state.url}' requiring roles '${expectedRoles}'.`,
        );
        router.navigate(['/login']); // Or a more appropriate page
        return false;
      }
    }
    return true; // Logged in, and no specific roles required for this route
  }

  // Not logged in, redirect to login page
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
