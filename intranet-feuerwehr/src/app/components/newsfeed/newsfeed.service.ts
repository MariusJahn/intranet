import { Injectable } from '@angular/core';
import {News} from "./types/News";
import {Observable} from "rxjs";
import {NewsfeedRepository} from "./repositories/newsfeed.repository";
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {

  constructor(private newsfeedRepo: NewsfeedRepository, private http: HttpClient) {
  }

  addEntry(news: News): Observable<News>{
    return this.newsfeedRepo.addEntry(news);
  }

  editEntry(news: News): Observable<News>{
    return this.newsfeedRepo.editEntry(news);
  }

  getNews(): Observable<News[]> {
    return this.newsfeedRepo.getNews();
  }

  deleteEntry(news: News): Observable<News> {
    return this.newsfeedRepo.deleteEntry(news);
  }
  uploadImage(file: File): Observable<any> {
    return this.newsfeedRepo.uploadImage(file);
  }

}



