import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  uploadDocument(formDataDocument: FormData): Observable<any> {

    // Http Post FormDataDocument ans backend
    return this.http.post(environment.apiRoute + '/filesystem/uploadFile', formDataDocument);
  }

  getTitles(): Observable<any> {
    return this.http.get(environment.apiRoute + '/filesystem/titles');
  }
}
