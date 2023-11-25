import { Component, ElementRef, OnInit, ViewChild,Input } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { Empresa } from '../../model/Empresa';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiPosicionViajesServicesService } from '../../data/api-posicion-viajes.service';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  providers: [MessageService]
})
export class BodyComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
  @ViewChild('numeroViajeInput', { static: false }) numeroViajeInput!: ElementRef;
  @Input() width: string = '100%';
  @Input() height: string = '100%';

  title = 'googlemaps';
  formGroup: FormGroup = new FormGroup({}); // Inicializa como un objeto FormGroup vacío
  mostrarDetalles: boolean = true;

  stateOptions: any[] = [{label: 'V', value: '0'}, {label: 'P', value: '1'}];
  value: string = 'off';

  empresas: Empresa[] | undefined;
  selectedEmpresa: Empresa | undefined;

  unidad: string | undefined;
  numeroViaje: number | undefined;
  shipment: string | undefined;
  remitente: string | undefined;
  destinatario: string | undefined;
  fechaIniViaje: string | undefined;
  fechaFinViaje: string | undefined;
  sistema: string | undefined;

  positions: any[] = [];
  items: MenuItem[] | undefined;
  activeIndex: number = 0;

  constructor(
    private apiService: ApiPosicionViajesServicesService,
    private messageService: MessageService
    ) {}

  label = {
    color: 'red',
    Text: 'Marcador'
  }

  ngOnInit() {
    this.empresas = [
      { name: 'HG', code: 'hgdb_lis' },
      { name: 'CH', code: 'chdb_lis' },
      { name: 'Linda', code: 'lindadb' },
      { name: 'RL', code: 'rldb_lis' }
    ];

    this.formGroup = new FormGroup({
      selectedEmpresa: new FormControl<Empresa | null>(null)
    });

    this.formGroup = new FormGroup({
      selectedEmpresa: new FormControl<Empresa | null>(null),
      value: new FormControl<string>('0')  // Establecer un valor predeterminado '0' (Viaje)
    });

    this.getCurrentLocation(); // Obtener la posición actual del usuario al inicio
  }

  private formatFecha(fecha: string): string {
    const fechaDate = new Date(fecha);
    const horas = fechaDate.getHours();
    const amPm = horas >= 12 ? 'PM' : 'AM';
    const formattedFecha = `${this.padZero(fechaDate.getDate())}-${this.padZero(fechaDate.getMonth() + 1)}-${fechaDate.getFullYear()} ${this.padZero(horas % 12 || 12)}:${this.padZero(fechaDate.getMinutes())} ${amPm}`;
    return formattedFecha;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Puedes agregar la posición actual al array positions si es necesario
          this.positions.push(currentLocation);

          console.log('Posición actual:', currentLocation);
        },
        (error) => {
          console.error('Error al obtener la posición actual:', error);
        }
      );
    } else {
      console.error('Geolocalización no es compatible en este navegador.');
    }
  }

  MarcarPosicion() {
    if (!this.selectedEmpresa || !this.numeroViajeInput) {
      console.error('Por favor, selecciona una empresa y proporciona un número de viaje.');
      return;
    }
    const numeroViaje = this.numeroViajeInput.nativeElement.value;
    const empresa = this.selectedEmpresa.toString().toLocaleLowerCase();
    const tipoSolicitud = this.formGroup.get('value')?.value === '0' ? 0 : 1 ;
    console.log(typeof this.formGroup.get('value')?.value);

    console.log(this.formGroup.get('value')?.value);

    this.positions = [];
    this.unidad = '';
    this.shipment = '';
    this.remitente = '';
    this.destinatario = '';
    this.fechaFinViaje = '';
    this.fechaIniViaje = '';
    this.sistema = '';

    this.apiService.obtenerPosicionViaje(numeroViaje, empresa,tipoSolicitud).subscribe({
      next: response => {
        console.log(response);

        if (!response.dataList || response.dataList.length === 0) {
          this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'No se encontraron posiciones'});
          return;
        }

        // Mapear las coordenadas posLat y posLon a positions
        const positions = response.dataList.map(item => ({
          lat: item.posLat,
          lng: item.posLon,
        }));

        this.positions = positions;

        if (response.dataSingle) {
          this.shipment = response.dataSingle.shipment?.toString() || '';
          this.unidad = response.dataList[0]?.id_unidad.toString() || '';
          this.remitente = response.dataSingle.remitente?.toString() || '';
          this.destinatario = response.dataSingle.destinatario?.toString() || '';
          this.fechaIniViaje = this.formatFecha(response.dataSingle.fecha_real_viaje?.toString()) || '';
          this.fechaFinViaje = this.formatFecha(response.dataSingle.fecha_real_fin_viaje?.toString()) || '';
          this.sistema = response.dataList[0].sistema_origen?.toString() || '';

          console.log(this.shipment,this.unidad ,this.remitente,this.destinatario, this.fechaIniViaje, this.fechaFinViaje, this.sistema);


          this.items = [
            { label: this.remitente ? this.remitente : '(Sin Geocerca)' },
            { label: this.destinatario ? this.destinatario : '(Sin Geocerca)' }
          ];

          console.log(this.items);

          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Se encontraron posiciones correctamente'
          });
        } else {
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: 'No se encontraron datos de posición individual'
          });
        }

      },
      error: (error: any) => {
        console.error('Error al obtener la posición del viaje:', error);
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al obtener la posición del viaje'
        });
      }
    });
  }

  toggleDetails() {
    this.mostrarDetalles = !this.mostrarDetalles;
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }
}
