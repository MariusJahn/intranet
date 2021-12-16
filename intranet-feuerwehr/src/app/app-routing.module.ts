import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ImpressumComponent} from './components/layouts/pages/impressum/impressum.component';
import {DatenschutzComponent} from './components/layouts/pages/datenschutz/datenschutz.component';
import {UserTableComponent} from "./components/user/user-table/user-table.component";
import {LoggedInGuard, LoggedInGuard as AuthGuard} from "./components/auth/guards/LoggedInGuard";
import {NewsfeedComponent} from './components/newsfeed/newsfeed.component';
import {RolesComponent} from './components/roles/roles.component';
import {RightsComponent} from './components/rights/rights.component';
import {UserComponent} from "./components/user/createUser/user.component";
import {WholeNewsEntryComponent} from "./components/newsfeed/whole-news-entry/whole-news-entry.component";
import {FilesystemComponent} from "./components/filesystem/filesystem.component";
import {UploadFileComponent} from "./components/filesystem/upload-file/upload-file.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {RightsToRolesComponent} from "./components/roles/rights-to-roles/rights-to-roles.component";
import {RolesToUsersComponent} from "./components/roles/roles-to-users/roles-to-users.component";
import {DepartmentToUsersComponent} from "./components/department/department-to-users/department-to-users.component";
import {IsAdminGuard} from "./components/auth/guards/is-admin-guard.service";



const routes: Routes = [

  /**
   * Routes für unangemeldete User
   */
    {
      path: '',
      component: NewsfeedComponent,
    },
    {
      path: 'whole-news-entry/:newsfeedID',
      component: WholeNewsEntryComponent,
    },
    {
      path: 'impressum',
      component: ImpressumComponent,
    },
    {
      path: 'datenschutzerklaerung',
      component: DatenschutzComponent,
    },

  /**
   * Routes für Admin
   */
  {
    path: 'user',
    children: [
      {
        path: 'user-table',
        component: UserTableComponent,
      },
     /* {
        path: 'uploadFile',
        component: UploadFileComponent,
      },*/
      {
        path: 'rollenverwaltung',
        component: RolesComponent
      },
      {
        path: 'rechteverwaltung',
        component: RightsComponent
      },
      {
        path: 'rechtezurollen/:roleID',
        component: RightsToRolesComponent,
      },
      {
        path: 'rollezuuser/:mitarbeiterID',
        component: RolesToUsersComponent,
      },
      {
        path: 'abteilungzuuser/:mitarbeiterID',
        component: DepartmentToUsersComponent,
      },

      ],
    canActivate: [IsAdminGuard]
  },
  /**
   * Routen für angemeldete User
   */
  {
    path: 'user/filesystem',
    component: FilesystemComponent,
    canActivate: [LoggedInGuard]
  },
  { path: '',   redirectTo: '', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
