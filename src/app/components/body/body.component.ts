import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { Empresa } from '../../model/Empresa';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiPosicionViajesServicesService } from '../../data/api-posicion-viajes.service';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;

  @ViewChild('numeroViajeInput', { static: false }) numeroViajeInput!: ElementRef;

  title = 'googlemaps';

  formGroup: FormGroup = new FormGroup({}); // Inicializa como un objeto FormGroup vacío
  mostrarDetalles: boolean = true;

  empresas: Empresa[] | undefined;
  selectedEmpresa: Empresa | undefined;

  numeroViaje: number | undefined;
  unidad: string | undefined;
  fechaIniViaje: string | undefined;
  fechaFinViaje: string | undefined;
  sistema: string | undefined;

  constructor(private apiService: ApiPosicionViajesServicesService) {}

  label = {
    color: 'red',
    Text: 'Marcador'
  }

  positions = [ { lat: 19.42847, lng: -99.12766 }];

  toggleDetails() {
    this.mostrarDetalles = !this.mostrarDetalles;
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

    // Obtener la posición actual del usuario al inicio
    this.getCurrentLocation();
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
    if (this.selectedEmpresa && this.numeroViajeInput) {
      const numeroViaje = this.numeroViajeInput.nativeElement.value;
      const empresa = this.selectedEmpresa.toString().toLocaleLowerCase();

      this.positions = [];
      this.fechaFinViaje= '';
      this.fechaIniViaje= '';
      this.sistema = '';

      if (this.selectedEmpresa) {
        this.apiService.obtenerPosicionViaje(numeroViaje, empresa).subscribe({
          next: response => {

            this.unidad         = response.dataSingle.shipment.toString();
            this.fechaIniViaje = this.formatFecha(response.dataSingle.fecha_real_viaje.toString());
            this.fechaFinViaje = this.formatFecha(response.dataSingle.fecha_real_fin_viaje.toString());
            this.sistema = response.dataList[0].sistema_origen.toString();

            console.log(this.unidad,this.fechaIniViaje,this.fechaFinViaje,this.sistema);

            // Mapear las coordenadas posLat y posLon a positions
            const positions = response.dataList.map(item => ({
              lat: item.posLat,
              lng: item.posLon,
            }));

            this.positions = positions;
          },
          error: (error: any) => {
            console.error('Error al obtener la posición del viaje:', error);
          }
        });
      } else {
        console.error('El código de la empresa seleccionada es undefined.');
      }
    } else {
      console.log('Por favor, selecciona una empresa y proporciona un número de viaje.');
    }
  }


}
