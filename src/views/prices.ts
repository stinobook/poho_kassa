import { CSSResult, html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lit-elements/tabs.js'
import '@vandeurenglenn/lit-elements/tab.js'
import '@vandeurenglenn/lit-elements/divider.js'
import '@vandeurenglenn/lit-elements/icon-button.js'
import { CustomTabs } from '@vandeurenglenn/lit-elements/tabs.js'

export type priceList = {
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
  { name: 'Limoncello 1L', category: 'winkel', vat: 21, price: 40 },
  { name: 'Limoncello 1L', category: 'other', vat: 21, price: 40 }
]
let prijslijst_categories = [...new Set(prijslijst.map((item) => item.category))]

@customElement('prices-view')
export class PricesView extends LitElement {
  get tabs(): CustomTabs {
    return this.shadowRoot.querySelector('custom-tabs')
  }
  set #selected(value) {
    console.log(value)

    this.items = prijslijst.filter(({ category }) => category === value)
    this.requestUpdate('items')
  }
  get selected() {
    return this.tabs.selected
  }

  @property({ type: Array })
  items: priceList[]

  async connectedCallback(): Promise<void> {
    super.connectedCallback()
    await this.updateComplete
    this.tabs.select(prijslijst_categories[0])
    this.#selected = prijslijst_categories[0]
  }

  static styles: CSSResult = css`
    :host {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    md-list,
    custom-tabs {
      width: 100%;
    }

    md-list {
      overflow-y: auto;
    }
  `
  render() {
    console.log(prijslijst_categories)

    return html`
      <flex-container>
        <custom-tabs
          @selected=${({ detail }) => (this.#selected = detail)}
          aria-label="Categorien"
          round
          attr-for-selected="route"
        >
          ${prijslijst_categories.map((category) => html`<custom-tab route=${category}>${category}</custom-tab>`)}
        </custom-tabs>

        <md-list>
          ${this.items
            ? this.items.map(
                ({ category, name, price, vat }) => html`
                  <md-list-item>
                    <span slot="headline">${name}</span>

                    <flex-column slot="supporting-text"
                      >${Number(price).toLocaleString(navigator.language, { style: 'currency', currency: 'EUR' })}
                      <small><strong>VAT </strong> ${vat} </small>
                    </flex-column>
                    <span slot="end"><custom-icon-button icon="edit"></custom-icon-button></span>
                  </md-list-item>

                  <custom-divider middle-inset></custom-divider>
                `
              )
            : ''}
        </md-list>
      </flex-container>
    `
  }
}
