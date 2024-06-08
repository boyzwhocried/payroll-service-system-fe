import { inject } from "@angular/core";
import { CanMatchFn, Route, Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { MessageService } from "primeng/api";

export const roleValidation: CanMatchFn = (route: Route) => {
  const roleData: string[] = route.data as any
  const authService = inject(AuthService)
  const dataLogin = authService.getLoginData()
  const router = inject(Router)
  const messageService = inject(MessageService)

  if (dataLogin) {
    if (roleData.includes(dataLogin.roleCode)) {
      return true
    } else {
      messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Forbidden Page' })
      return router.navigateByUrl('/forbidden')
    }
  }
  return router.navigateByUrl('/login')
}
