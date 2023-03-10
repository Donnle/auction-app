// LIBRARIES
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSmartModalModule } from 'ngx-smart-modal';

// PAGES
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { AddProductPageComponent } from './pages/add-product-page/add-product-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

// COMPONENTS
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { LoginPopupComponent } from './shared/components/popups/login-popup/login-popup.component';
import { RegistrationPopupComponent } from './shared/components/popups/registration-popup/registration-popup.component';
import { ProductsComponent } from './shared/components/products/products.component';
import { ProductComponent } from './shared/components/product/product.component';
import { RaiseBetPopupComponent } from './shared/components/popups/raise-bet-popup/raise-bet-popup.component';
import { BuyNowPopupComponent } from './shared/components/popups/buy-now-popup/buy-now-popup.component';

// DIRECTIVES
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';

// PIPES
import { CityPipe } from './shared/pipes/city.pipe';

// GUARDS
import { AuthGuard } from './shared/guards/auth.guard';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeLeftPipe } from './shared/pipes/time-left.pipe';

const routes = [
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
    path: 'not-found',
    component: NotFoundPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

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
    BuyNowPopupComponent,
    CityPipe,
    TimeLeftPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxSmartModalModule.forRoot(),
    ReactiveFormsModule,
    RouterLink,
    NgSelectModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
