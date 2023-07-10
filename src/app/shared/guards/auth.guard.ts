import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@shared/services/auth.service";
import { map } from "rxjs";

export function AuthGuard() {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    return authService.isLoggedIn()
        .pipe(
            map(is_logged_in => {
                if (is_logged_in) {
                    return true;
                }
                return router.navigateByUrl('/auth/sign-in');
            })
        );
}
