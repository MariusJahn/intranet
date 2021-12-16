import {INewsfeedRepository} from "./INewsfeedRepository";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {News} from "../types/News";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class NewsfeedRepository implements INewsfeedRepository{

  constructor(private http: HttpClient) {

  }


  /**
   * API Call um einen Eintrag in der Datenbank hinzuzufügen
   * @param news Eintrag der übertragen wird.
   */
  addEntry(news: News): Observable<News>{
    return this.http.post<News>(environment.apiRoute + "/newsfeed/addEntry",news);
  }

  editEntry(news: News): Observable<News>{
    return this.http.put<News>(environment.apiRoute + `/newsfeed/editEntry/${news.newsfeedID}`,news);
  }

  /**
   * Liefert alle Newseinträge aus der Datenbank
   */
  getNews(): Observable<News[]> {
    return this.http.get<News[]>(environment.apiRoute + "/newsfeed/news");
  }

  /**
   * Löscht einen Eintrag aus der Datenbank.
   * @param news Eintrag der gelöscht werden soll.
   */
  deleteEntry(news: News): Observable<News> {
    const url = environment.apiRoute + `/newsfeed/deleteEntry/${news.newsfeedID}`;

    return this.http.delete<News>(url);

  }

  /**
   * Ein File (Bild) wird dem Backend per Http Post übertragen.
   * @param file hochgeladenes Bild
   */
  uploadImage(file: File): Observable<any> {
    // FormData Objekt nötig, um File ans Backend zu übergeben und auszuwerten.
    const formData = new FormData();
    formData.append('image', file, file.name); //belege FormData

    return this.http.post(environment.apiRoute + '/newsfeed/uploadImage', formData); //formData als body gesendet in post (Request)

  }
}
