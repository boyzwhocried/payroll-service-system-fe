import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { NotificationResDto } from "../../dto/notification/notification.res.dto";
import { environment } from "../../../env/environment.prod";
import { UpdateResDto } from "../../dto/general-response/update.res.dto";
import { DeleteResDto } from "../../dto/general-response/delete.res.dto";

@Injectable({
    providedIn: 'root'
  })

export class NotificationService {
    constructor(
        private baseService: BaseService
    ) {}

    getNotificationCount() {
        return this.baseService.get<number>('notifications/count')
    }

    getNotifications() {
        return this.baseService.get<NotificationResDto[]>('notifications')
    }

    getImageUrl(id: string) {
        return `${environment.backEndBaseUrl}:${environment.port}/files/${id}`
    }

    deleteNotification(id: string) {
        return this.baseService.delete<DeleteResDto>(`notifications/${id}`)
    }

    readNotification(id: string) {
        return this.baseService.patch<UpdateResDto>(`notifications/${id}`)
    }
}