import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ImageResDto } from '../../models/dto/file/image.res.dto';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private baseService: BaseService) { }

  getImageById(imageId: string) {
    return this.baseService.get<ImageResDto>(`files/${imageId}`)
  }
}
