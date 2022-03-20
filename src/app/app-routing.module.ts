import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { OrdersComponent } from './orders/orders.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { BannersComponent } from './banners/banners.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'home', component: HomeComponent,canActivate:[AuthGuard]},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'employee', component: EmployeeComponent,canActivate:[AuthGuard]},
  {path: 'orders', component: OrdersComponent,canActivate:[AuthGuard]},
  {path: 'supervisor', component: SupervisorComponent,canActivate:[AuthGuard]},
  {path: 'addBanner', component: BannersComponent,canActivate:[AuthGuard]},
  {path: 'services', component: SubscriptionComponent,canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
