import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DebitosComponent } from './debitos/debitos.component';
import { TransacoesComponent } from './transacoes/transacoes.component';

const routes: Routes = [
      {
        path: "",
        component: DashboardComponent
      },
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "debitos",
        component: DebitosComponent
      },
      {
        path: "transacoes",
        component: TransacoesComponent
      }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
