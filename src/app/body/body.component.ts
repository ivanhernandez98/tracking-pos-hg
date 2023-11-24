import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { Empresa } from '../model/Empresa';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiPosicionViajesServicesService } from '../data/api-posicion-viajes.service';


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

  empresas: Empresa[] | undefined;
  selectedEmpresa: Empresa | undefined;

  numeroViaje: number | undefined;

  constructor(private apiService: ApiPosicionViajesServicesService) {}

  label = {
    color: 'red',
    Text: 'Marcador'
  }

  positions = [
    { lat: 25.721836, lng: -100.118597 },
    { lat: 25.719224, lng: -100.119968 },
    { lat: 25.721836, lng: -100.118597 },
    { lat: 25.721836, lng: -100.118597 },
    { lat: 25.721836, lng: -100.118597 },
    { lat: 25.741783, lng: -100.128607 },
    { lat: 25.742823, lng: -100.128608 }
  ];

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
  }

  MarcarPosicion() {
    if (this.selectedEmpresa && this.numeroViajeInput) {
      const numeroViaje = this.numeroViajeInput.nativeElement.value;
      const empresa = this.selectedEmpresa.toString().toLocaleLowerCase();
      console.log('Empresa seleccionada:', empresa);
      console.log('Número de viaje ingresado:', numeroViaje);

      if (this.selectedEmpresa) {
        this.apiService.obtenerPosicionViaje(numeroViaje, empresa)
          .subscribe(
            posicionViaje => {
              console.log(posicionViaje);
              // Aquí puedes manejar la respuesta del API según tus necesidades
            },
            error => {
              console.error('Error al obtener la posición del viaje:', error);
            }
          );
      } else {
        console.error('El código de la empresa seleccionada es undefined.');
      }
    } else {
      console.log('Por favor, selecciona una empresa y proporciona un número de viaje.');
    }
  }

}
