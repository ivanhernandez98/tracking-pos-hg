import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* COMPONENT DEL LAYOUT */
import { NavbarComponent } from './layout/navbar/navbar.component';
import { BodyComponent } from './components/body/body.component';
import { FooterComponent } from './layout/footer/footer.component';

const routes: Routes = [
  { path: 'navbar', component: NavbarComponent },
  { path: 'body', component: BodyComponent },
  { path: 'footer', component: FooterComponent },
  { path: '', redirectTo: '/body', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
