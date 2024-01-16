import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

type priceList = {
  name: string;
  category: string;
  vat: number;
  price: number;
}

let prijslijst: priceList[] = [
  // Frisdranken
  { "name": "Cola", "category" : "frisdrank", "vat": 21, "price": 2 },
  { "name": "Cola zero", "category" : "frisdrank", "vat": 21, "price": 2 },
  { "name": "Fanta", "category" : "frisdrank", "vat": 21, "price": 2 },
  { "name": "Ice-Tea", "category" : "frisdrank", "vat": 21, "price": 2 },
  { "name": "Vittel", "category" : "frisdrank", "vat": 21, "price": 2 },
  { "name": "Spa bruis", "category" : "frisdrank", "vat": 21, "price": 2 },
  // Bieren
  { "name": "Pils", "category" : "bieren", "vat": 21, "price": 2 },
  { "name": "Mazout", "category" : "bieren", "vat": 21, "price": 2 },
  { "name": "Carlsberg 0,0", "category" : "bieren", "vat": 21, "price": 2 },
  { "name": "Kriek", "category" : "bieren", "vat": 21, "price": 3 },
  { "name": "Ename Blond", "category" : "bieren", "vat": 21, "price": 3 },
  { "name": "Ename Donker", "category" : "bieren", "vat": 21, "price": 3 },
  { "name": "Karmeliet", "category" : "bieren", "vat": 21, "price": 3 },
  { "name": "Duvel", "category" : "bieren", "vat": 21, "price": 3 },
  { "name": "Omer", "category" : "bieren", "vat": 21, "price": 3 },
  { "name": "Bier v/d maand", "category" : "bieren", "vat": 21, "price": 3 },
  { "name": "Orval", "category" : "bieren", "vat": 21, "price": 4 },
]

@customElement('prices-view')
export class PricesView extends LitElement {

  render() {
    return html` <p>Prijslijst</p> `
  }
}
