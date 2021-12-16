import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewsfeedComponent } from './components/newsfeed/newsfeed.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { UserTableComponent } from './components/user/user-table/user-table.component';
import {UserComponent} from './components/user/createUser/user.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {SharedModule} from './components/layouts/shared.module';
import {LoggedInGuard} from './components/auth/guards/LoggedInGuard';
import {MatButtonModule} from '@angular/material/button';
import {ToastrModule} from 'ngx-toastr';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { RolesComponent } from './components/roles/roles.component';
import { RightsComponent } from './components/rights/rights.component';
import {CommonModule} from '@angular/common';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {MatPaginatorIntlDe} from './components/shared/custom-paginator';
import {MatSelectModule} from '@angular/material/select';
import { UserDetailsComponent } from './components/user/user-edit/user-details.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {CreateNewsfeedComponent} from "./components/newsfeed/create-newsfeed/create-newsfeed.component";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import { FilesystemComponent } from './components/filesystem/filesystem.component';
import { UploadFileComponent} from "./components/filesystem/upload-file/upload-file.component";
import {AngularFileUploaderModule} from "angular-file-uploader";
import { CreateQuicklinkComponent } from './components/quicklinks/create-quicklink/create-quicklink.component';
import { WholeNewsEntryComponent } from './components/newsfeed/whole-news-entry/whole-news-entry.component';
import { RightsToRolesComponent } from './components/roles/rights-to-roles/rights-to-roles.component';
import { RolesToUsersComponent } from './components/roles/roles-to-users/roles-to-users.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CreateRoleComponent } from './components/roles/create-role/create-role.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {EditFileComponent} from "./components/filesystem/edit-file/edit-file.component";
import { MatSelectFilterModule } from 'mat-select-filter';
import { DepartmentToUsersComponent } from './components/department/department-to-users/department-to-users.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {JwtInterceptor} from "./components/auth/JwtInterceptor";
import { LayoutModule } from '@angular/cdk/layout';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { EditNewsComponent } from './components/newsfeed/edit-news/edit-news.component';


@NgModule({
  declarations: [
    AppComponent,
    UserTableComponent,
    NewsfeedComponent,
    FilesystemComponent,
    UploadFileComponent,
    CreateNewsfeedComponent,
    RolesComponent,
    RightsComponent,
    UserComponent,
    UserDetailsComponent,
    WholeNewsEntryComponent,
    CreateQuicklinkComponent,
    RightsToRolesComponent,
    RolesToUsersComponent,
    PageNotFoundComponent,
    CreateRoleComponent,
    EditFileComponent,
    DepartmentToUsersComponent,
    EditNewsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    LayoutModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatGridListModule,
    MatCheckboxModule,
    MatSelectFilterModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatCarouselModule.forRoot(),
  ],
  providers: [
    LoggedInGuard,
    {provide: MatPaginatorIntl, useValue: new MatPaginatorIntlDe},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
  exports: [

  ],
  entryComponents: [UserTableComponent, UserDetailsComponent]
})
export class AppModule { }
