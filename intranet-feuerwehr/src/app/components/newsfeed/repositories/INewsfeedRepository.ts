import {Observable} from "rxjs";
import {News} from "../types/News";


export interface INewsfeedRepository {
  getNews(): Observable<Array<News>>;
  addEntry(news: News): Observable<News>;
  deleteEntry(news: News): Observable<News>;
  uploadImage(file: File): Observable<any>;
}
