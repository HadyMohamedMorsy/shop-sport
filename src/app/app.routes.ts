import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component'),
    title: _('Home'),
  },
  {
    path: 'categroy/:id',
    loadComponent: () => import('./pages/home/home.component'),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component'),
    title: _('checkout'),
  },
  {
    path: '**',
    loadComponent: () => import('./layout/not-found/not-found.component'),
  },
];
