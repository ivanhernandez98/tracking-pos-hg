import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PosicionViaje } from './../model/PosicionViaje';

@Injectable({
  providedIn: 'root'
})
export class ApiPosicionViajesServicesService {
  private apiUrl = 'https://localhost:7078/api/PosicionViajes'; // Reemplaza con la URL correcta de tu API

  constructor(private http: HttpClient) {}

  obtenerPosicionViaje(noViaje: number, empresa: string): Observable<PosicionViaje> {
    const url = `${this.apiUrl}?noViaje=${noViaje}&empresa=${empresa}`;
    return this.http.get<PosicionViaje>(url);
  }
}
