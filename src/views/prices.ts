import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

type priceList = {
  name: string
  category: string
  vat: number
  price: number
}

export let prijslijst: priceList[] = [
  // Frisdranken
  { name: 'Cola', category: 'frisdrank', vat: 21, price: 2 },
  { name: 'Cola zero', category: 'frisdrank', vat: 21, price: 2 },
  { name: 'Fanta', category: 'frisdrank', vat: 21, price: 2 },
  { name: 'Ice-Tea', category: 'frisdrank', vat: 21, price: 2 },
  { name: 'Vittel', category: 'frisdrank', vat: 21, price: 2 },
  { name: 'Spa bruis', category: 'frisdrank', vat: 21, price: 2 },
  // Bieren
  { name: 'Pils', category: 'bieren', vat: 21, price: 2 },
  { name: 'Mazout', category: 'bieren', vat: 21, price: 2 },
  { name: 'Carlsberg 0,0', category: 'bieren', vat: 21, price: 2 },
  { name: 'Kriek', category: 'bieren', vat: 21, price: 3 },
  { name: 'Ename Blond', category: 'bieren', vat: 21, price: 3 },
  { name: 'Ename Donker', category: 'bieren', vat: 21, price: 3 },
  { name: 'Karmeliet', category: 'bieren', vat: 21, price: 3 },
  { name: 'Duvel', category: 'bieren', vat: 21, price: 3 },
  { name: 'Omer', category: 'bieren', vat: 21, price: 3 },
  { name: 'Bier v/d maand', category: 'bieren', vat: 21, price: 3 },
  { name: 'Orval', category: 'bieren', vat: 21, price: 4 },
  // Wijnen-Apero
  { name: 'Witte Wijn 25cl', category: 'wijnen-apero', vat: 21, price: 4 },
  { name: 'Rose Wijn 25cl', category: 'wijnen-apero', vat: 21, price: 4 },
  { name: 'Rode Wijn', category: 'wijnen-apero', vat: 21, price: 4 },
  { name: 'Zizi', category: 'wijnen-apero', vat: 21, price: 4 },
  { name: 'Pompierke', category: 'wijnen-apero', vat: 21, price: 4 },
  { name: 'Limoncello', category: 'wijnen-apero', vat: 21, price: 4 },
  { name: 'Cava', category: 'wijnen-apero', vat: 21, price: 4 },
  { name: 'Aperol', category: 'wijnen-apero', vat: 21, price: 5 },
  // Warme Dranken
  { name: 'Koffie', category: 'warme dranken', vat: 21, price: 2 },
  { name: 'Thee', category: 'warme dranken', vat: 21, price: 2 },
  { name: 'Minuut Soep', category: 'warme dranken', vat: 21, price: 2 },
  { name: 'Warme Choco', category: 'warme dranken', vat: 21, price: 2 },
  { name: 'Verse Soep (Winter)', category: 'warme dranken', vat: 21, price: 3 },
  // Versnaperingen
  { name: 'Worst', category: 'versnaperingen', vat: 21, price: 2 },
  { name: 'Chips', category: 'versnaperingen', vat: 21, price: 2 },
  // Winkel
  { name: 'Lidgeld', category: 'winkel', vat: 21, price: 120 },
  { name: 'Extra lid', category: 'winkel', vat: 21, price: 10 },
  { name: 'Rodiworst', category: 'winkel', vat: 21, price: 3 },
  { name: 'Zwan', category: 'winkel', vat: 21, price: 3 },
  { name: 'Klein been', category: 'winkel', vat: 21, price: 2 },
  { name: 'Groot been', category: 'winkel', vat: 21, price: 3 },
  { name: 'Poepzakjes', category: 'winkel', vat: 21, price: 12 },
  { name: 'Limoncello 0.5L', category: 'winkel', vat: 21, price: 25 },
  { name: 'Limoncello 1L', category: 'winkel', vat: 21, price: 40 }
]

@customElement('prices-view')
export class PricesView extends LitElement {
  render() {
    return html` <p>Prijslijst</p> `
  }
}
