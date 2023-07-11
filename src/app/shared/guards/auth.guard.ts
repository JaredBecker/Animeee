import { inject } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "@shared/services/auth.service";

export async function AuthGuard() {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    const isAuthenticated = await authService.isAuthenticated();

    return isAuthenticated ? true : router.navigateByUrl('/auth/sign-in');
}
