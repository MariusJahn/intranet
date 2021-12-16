import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContentComponent} from './components/content/content.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoginComponent} from "../login/login.component";
import { FormsModule } from "@angular/forms";
import {QuicklinksComponent} from "../quicklinks/quicklinks.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { MessageToastrService } from "../MessageService/message-toastr.service";
import {MatSidenavModule} from "@angular/material/sidenav";


@NgModule({
  declarations: [FooterComponent, HeaderComponent, SidebarComponent, LoginComponent, QuicklinksComponent],
    imports: [CommonModule, RouterModule, FlexLayoutModule, FormsModule, MatIconModule, MatButtonModule, MatSidenavModule],
  providers: [
    MessageToastrService
  ],
  exports: [FooterComponent, HeaderComponent, SidebarComponent, LoginComponent],
})
export class SharedModule { }
