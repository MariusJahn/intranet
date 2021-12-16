import {ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NewsfeedService} from "./newsfeed.service";
import {News} from "./types/News";
import {INewsfeedRepository} from "./repositories/INewsfeedRepository";
import {NewsfeedRepository} from "./repositories/newsfeed.repository";
import {MessageToastrService} from "../MessageService/message-toastr.service";
import {Message} from "../shared/message";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {AuthService} from "../auth/services/auth.service";
import {DatePipe} from "@angular/common";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CreateNewsfeedComponent} from "./create-newsfeed/create-newsfeed.component";
import { environment } from '../../../environments/environment';
import {AuthorizationService} from "../auth/services/authorization.service";
import { MatCarousel, MatCarouselComponent } from '@ngbmodule/material-carousel';
import { EditNewsComponent } from './edit-news/edit-news.component';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css'],
  providers: [DatePipe]
})
export class NewsfeedComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Use ViewChild um auf html inpute typ file zuzugreifen, siehe im html-tag #imageInput
  @ViewChild('imageInput')
  imageInputVariable: ElementRef;
  obs: Observable<any>;
  dataSource: MatTableDataSource<News>;

  public entryAdded: boolean;

  public newText: string;

  public allNews: Array<News>;

  // Variable die aus JWT Session belegt wird ob User Admin ist
  public isAdmin: boolean;
  public tempIsAdmin: Observable<boolean> = this.isUserAdmin(); //Hilfsvariable für isAdmin, damit sie immer neu belegt wird und abfragt

  // Variable die aus JWT Session belegt wird ob User Recht hat News zu schreiben
  public allowWriteNews: boolean;
  public tempAllowWriteNews: Observable<boolean> = this.allowWriteNewsfeed();

  /**
   * Prüfen ob Admin (nach Login wird da ja stehen ob Admin oder nicht)
   * --> Dem entsprechend true oder false*/

  constructor(private newsfeedRepository: NewsfeedRepository,
              private newsfeedService: NewsfeedService,
              private authService: AuthService,
              private toastService: MessageToastrService,
              private changeDetectorRef: ChangeDetectorRef,
              private dialog: MatDialog,
              private authorization: AuthorizationService) {

  }
  // Wird bei jedem Seitenaufruf ausgeführt!
  async ngOnInit() {
    this.newsfeedService.getNews().subscribe((news: News[]) => {
      this.allNews = news;
      this.dataSource = new MatTableDataSource<News>(this.allNews);
      this.changeDetectorRef.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    });

    // Belege allowWriteNews vom Observable<boolean>
    try {
      this.allowWriteNews = await this.tempAllowWriteNews.toPromise();
    } catch (e) {
      this.allowWriteNews = false;
    }

    // Belege isAdmin vom Observable<boolean>
    try {
      this.isAdmin = await this.tempIsAdmin.toPromise();
    } catch (e) {
      this.isAdmin = false;
    }
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  isUserAdmin(): Observable<boolean> {
    return this.authService.isAdmin();
  }

  // RightID 8 = Das Recht den Newsfeed zu verwalten, Frage nach Recht Schreiben
  allowWriteNewsfeed(): Observable<boolean> {
    return this.authorization.hasUserPermission(8, "allowWrite");
  }

  // Button neue News, Dialog mit CreateNewsComponent gefüllt.
  createNewsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false; //Klicken außerhalb lässt Fenster schließen, wenn false gesetzt.
    this.dialog.open(CreateNewsfeedComponent, dialogConfig);
  }

  openEditNewsDialog(news: News) {
    const dialogRef = this.dialog.open(EditNewsComponent, {
      data:  {
        ID: news.newsfeedID,
        Titel: news.title,
        Autor: news.author,
        Date: news.createdDate,
        Beschreibung: news.descriptiontext,
        URL: news.pictureDataUrl,
        ShowWholeEntry: news.showWholeEntry,
        WholeEntry: news.wholeEntry

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.getUsersTable();
    });
  }

  public deleteNews(news: News): void {
    if(confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
      this.newsfeedService.deleteEntry(news).subscribe((deletedNewsfeed: News) => {
        this.toastService.showToastr("Eintrag wurde gelöscht.", "Löschen erfolgreich", "success");
        this.newsfeedService.getNews().subscribe((news: Array<News>) => {
          this.allNews = news;
          this.dataSource = new MatTableDataSource<News>(this.allNews);
          this.changeDetectorRef.detectChanges();
          this.dataSource.paginator = this.paginator;
          this.obs = this.dataSource.connect();
        });

      });
    }

  }
}
