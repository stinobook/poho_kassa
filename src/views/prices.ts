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
  { name: 'Koffie', category: 'warme dranken', vat: 21, price: 2 },
  { name: 'Thee', category: 'warme dranken', vat: 21, price: 2 },
]
export let prijslijst_categories = [...new Set(prijslijst.map((item) => item.category))]

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
