import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ButtonComponent } from './components/button/button.component';
import { LoginPopupComponent } from './components/popups/login-popup/login-popup.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationPopupComponent } from './components/popups/registration-popup/registration-popup.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { RouterLink, RouterModule } from '@angular/router';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { AddProductPageComponent } from './pages/add-product-page/add-product-page.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductComponent } from './components/product/product.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { RaiseBetPopupComponent } from './components/popups/raise-bet-popup/raise-bet-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    ButtonComponent,
    LoginPopupComponent,
    RegistrationPopupComponent,
    ClickOutsideDirective,
    ProfilePageComponent,
    AddProductPageComponent,
    ProductsComponent,
    ProductPageComponent,
    ProductComponent,
    NotFoundPageComponent,
    RaiseBetPopupComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxSmartModalModule.forRoot(),
    ReactiveFormsModule,
    RouterLink,
    RouterModule.forRoot([
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'add-product',
        component: AddProductPageComponent,
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product/:productId',
        component: ProductPageComponent,
      },
      {
        path: '**',
        component: NotFoundPageComponent,
      },
      {
        path: 'not-found',
        component: NotFoundPageComponent,
      },
    ]),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
