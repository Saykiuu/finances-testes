import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { NavComponent } from './nav/nav.component';
import { TransacoesComponent } from './transacoes/transacoes.component';
import { DebitosComponent } from './debitos/debitos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { HttpClientModule,  } from '@angular/common/http'


@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    NavComponent,
    TransacoesComponent,
    DebitosComponent,
    DashboardComponent,

  ],
  imports: [
    BrowserModule,
    ModalModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
