
export class Eatery {

  name: string;
  desc: string;
  lat: number;
  lng: number;

  constructor(inName: string, inDesc: string, inLat: number, inLng: number){
    this.name = inName;
    this.desc = inDesc;
    this.lat = inLat;
    this.lng = inLng;
  }

}
