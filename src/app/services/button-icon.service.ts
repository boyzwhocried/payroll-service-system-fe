import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ButtonIconService {
  uploadIcon: string = 'pi pi-upload';
  submitIcon: string = 'pi pi-check';
  pingIcon: string = 'pi pi-bell';
  previewIcon: string = 'pi pi-eye';

  uploadIsLoading: boolean = false;
  submitIsLoading: boolean = false;
  pingIsLoading: boolean = false;
  previewIsLoading: boolean = false;

  toggleUploadIcon() {
    this.uploadIcon = this.uploadIsLoading
      ? 'pi pi-upload'
      : 'pi pi-spin pi-spinner';

    this.uploadIsLoading = !this.uploadIsLoading;
  }

  toggleSubmitIcon() {
    this.submitIcon = this.submitIsLoading
      ? 'pi pi-check'
      : 'pi pi-spin pi-spinner';

    this.submitIsLoading = !this.submitIsLoading;
  }

  togglePingIcon() {
    this.pingIcon = this.pingIsLoading ? 'pi pi-bell' : 'pi pi-spin pi-spinner';

    this.pingIsLoading = !this.pingIsLoading;
  }

  togglePreviewIcon() {
    this.previewIcon = this.previewIsLoading
      ? 'pi pi-eye'
      : 'pi pi-spin pi-spinner';

    this.previewIsLoading = !this.previewIsLoading;
  }
}
