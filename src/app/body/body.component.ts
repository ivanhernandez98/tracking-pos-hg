import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { Empresa } from '../model/Empresa';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;

  title = 'googlemaps';

  formGroup: FormGroup = new FormGroup({}); // Inicializa como un objeto FormGroup vacío
  empresas: Empresa[] | undefined;
  selectedEmpresa: Empresa | undefined;

  constructor() {}

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
      { name: 'HG Transportaciones', code: 'hgdb_lis' },
      { name: 'CH Transportaciones', code: 'chdb_lis' },
      { name: 'Linda Transportaciones', code: 'lindadb' },
      { name: 'RL Transportaciones', code: 'rldb_lis' }
    ];

    console.log(this.empresas);

    this.formGroup = new FormGroup({
      selectedEmpresa: new FormControl<Empresa | null>(null)
   });

  }
}
