import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../layout.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  items: MenuItem[] = [
    { label: 'Inicio', routerLink: '' },
    { label: 'Contenido', routerLink: '/body' },
    { label: 'Pie de página', routerLink: '/footer' },
  ];

  constructor(private layoutService: LayoutService) {}

  // Puedes utilizar el servicio en los métodos de este componente
  toggleMenu() {
    this.layoutService.onMenuToggle();
  }

  showProfileSidebar() {
    this.layoutService.showProfileSidebar();
  }

  showConfigSidebar() {
    this.layoutService.showConfigSidebar();
  }

  // Puedes agregar más lógica aquí según sea necesario, como manejar la activación de elementos del menú.
  itemClick(event: any, item: MenuItem) {
    // Tu lógica de manejo de clics de elementos del menú aquí.
  }

  isActive(item: MenuItem): boolean {
    // Tu lógica para determinar si un elemento del menú está activo.
    return false;
  }


}
