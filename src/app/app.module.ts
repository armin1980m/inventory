import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MenuService } from './services/menu.service';
import { AuthService } from './services/auth.service';
import { SaleComponent } from './sale/sale.component';
import { AdminComponent } from './admin/admin.component';
import { ReportComponent } from './report/report.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LogoutComponent } from './logout/logout.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { ManualproductComponent } from './manualproduct/manualproduct.component';
import { AddnewproductComponent } from './addnewproduct/addnewproduct.component';
import { ProductmanagementComponent } from './productmanagement/productmanagement.component';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SalereportComponent } from './salereport/salereport.component';
import { InventoryreportComponent } from './inventoryreport/inventoryreport.component';
import { LoadingModule } from 'ngx-loading';
import { FacebookModule } from 'ngx-facebook';
import {AuthGuard} from './services/authguard'
const appRoutes: Routes = [
  { path: 'sale', component: SaleComponent,canActivate: [AuthGuard] },
  { path: 'report', component: ReportComponent,canActivate: [AuthGuard],
  children: [
    {
      path: 'product',
      component: ProductmanagementComponent
    },
    {
      path: 'sale',
      component: SalereportComponent
    },
    {
      path: 'inventory',
      component: InventoryreportComponent
    }

  ]
  },
  {
    path: 'admin', component: AdminComponent,canActivate: [AuthGuard],
    children: [
      {
        path: 'product',
        component: ProductmanagementComponent
      },
      {
        path: 'inventory',
        component: InventoryComponent
      },
      {
        path: 'user',
        component: UsermanagementComponent
      }

    ]
  },
  { path: '', redirectTo: '/sale', pathMatch: 'full',canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent,canActivate: [AuthGuard] },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SaleComponent,
    AdminComponent,
    ReportComponent,
    SignInComponent,
    SignUpComponent,
    NotFoundComponent,
    LogoutComponent,
    ModalDialogComponent,
    ManualproductComponent,
    AddnewproductComponent,
    ProductmanagementComponent,
    UsermanagementComponent,
    InventoryComponent,
    SalereportComponent,
    InventoryreportComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FacebookModule.forRoot(),
    ModalModule.forRoot(),
    AngularFontAwesomeModule,
    LoadingModule,
    FormsModule
  ],
  providers: [MenuService,AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
