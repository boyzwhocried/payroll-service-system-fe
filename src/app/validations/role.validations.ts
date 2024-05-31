import { inject } from "@angular/core";
import { CanMatchFn, Route, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth/auth.service";

export const roleValidation : CanMatchFn = (route : Route) => {
  const roleData : string[] = route.data as any
  const authService = inject(AuthService)
  const dataLogin = authService.getLoginData()
  const router = inject(Router)
  const toastr = inject(ToastrService)

  if(dataLogin) {
    if(roleData.includes(dataLogin.roleCode)) {
      return true
    } else {
      toastr.warning('Forbidden Page')
      return router.navigateByUrl('/forbidden')
    }
  }
  return router.navigateByUrl('/login')
}
