// posicion-viaje.model.ts
export interface PosicionViaje {
  dataList: {
    id_unidad: string;
    id_viaje: number;
    posdate: Date;
    posLat: number;
    posLon: number;
    sistema_origen: string;
  }[];
  dataSingle: {
    shipment: string;
    fechaRealViaje: Date;
    fechaRealFinViaje: Date;
  };
}
