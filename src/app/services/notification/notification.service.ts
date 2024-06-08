import { Injectable, OnInit } from "@angular/core";
import { BaseService } from "../base/base.service";
import { NotificationResDto } from "../../dto/notification/notification.res.dto";
import { environment } from "../../../env/environment.prod";
import { UpdateResDto } from "../../dto/general-response/update.res.dto";
import { DeleteResDto } from "../../dto/general-response/delete.res.dto";
import { Observable, firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    count: number = 0
    countObserver: any
    countObservable = new Observable<number>(subscriber => this.countObserver = subscriber)

    constructor(
        private baseService: BaseService
    ) { }

    getNotificationCount() {
        firstValueFrom(this.baseService.get<number>('notifications/count')).then(
            response => {
                this.count = response
                this.countObserver.next(this.count)
            }
        )
    }

    getNotifications() {
        return this.baseService.get<NotificationResDto[]>('notifications')
    }

    getImageUrl(id: string) {
        return `${environment.backEndBaseUrl}:${environment.port}/files/${id}`
    }

    deleteNotification(id: string, isActive: boolean) {
        if (isActive) {
            this.count -= 1
            this.countObserver.next(this.count)
        }
        return this.baseService.delete<DeleteResDto>(`notifications/${id}`)
    }

    readNotification(id: string) {
        return this.baseService.patch<UpdateResDto>(`notifications/${id}`)
    }
}