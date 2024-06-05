import { inject } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
import { CanMatchFn, Route, Router } from "@angular/router";
import { RoleType } from "../constants/roles.constant";

export const loginValidation: CanMatchFn = (route:Route) => {
    const authService = inject(AuthService)
    const loginData = authService.getLoginData()
    const router = inject(Router)

    if(authService.isLoggedIn()) {
        return router.navigateByUrl(loginData.roleCode == RoleType.SUPER_ADMIN ? '/users' : '/schedules')
    }
    return true
}