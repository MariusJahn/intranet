import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class MessageToastrService {

  constructor(private toastr: ToastrService) {  }

  showToastr(message:string, title:string, style: string) {
    if (style == 'success') {
      this.toastr.success(message, title);
    } else if (style == 'error') {
      this.toastr.error(message, title);
    } else if (style == 'warning') {
      this.toastr.warning(message, title);
    } else {
      this.toastr.info(message, title);
    }

  }

}
