import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  public languages = [
    { value: 'ar', label: 'عربي', image: 'assets/media/languages/ar.png' },
  ];

  public menuLinks = [
    {
      label: 'Home',
      routerLink: '/',
    },
    {
      label: 'Services',
      routerLink: '/services',
    },
    {
      label: 'Client Area',
      routerLink: '/404',
    },
    {
      label: 'About Us',
      routerLink: '/about-us',
    },
    {
      label: 'Contact Us',
      routerLink: '/contact-us',
    },
  ];
}
