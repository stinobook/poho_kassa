import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@material/web/list/list-item.js'
import '@material/web/button/text-button.js'
import '@vandeurenglenn/flex-elements/wrap-between.js'
import { Product } from '../../../views/add-product.js'

export declare type ReceiptItem = { id: string; price: number; name: string; description?: string }

@customElement('sales-grid')
export class SalesGrid extends LiteElement {
  @property({ consumer: true })
  products: { [index: string]: Product[] }

  willChange(propertyKey: any, value: any) {
    if (propertyKey === 'products') {
      return Object.entries({ ...value }).reduce((set, [key, item]) => {
        if (!set[item['category']]) set[item['category']] = []
        item['key'] = key
        set[item['category']].push(item)
        console.log(set)

        return set
      }, {})
    }
    return value
  }

  static styles = [
    css`
      :host {
        display: flex;
        width: 100%;
        padding: 12px 24px;
        box-sizing: border-box;
        flex-direction: column;
        padding-left: 12px;
      }
      md-text-button {
        height: 86.33px;
        background: var(--md-sys-color-on-secondary);
        color: var(--md-sys-color-on-secondary-container);
        margin: 4px;
        justify-content: between;

        min-width: 86.33px;
      }
      flex-wrap-between {
        width: 100%;
        height: fit-content;
        justify-content: flex-start;
      }

      flex-container {
        max-width: -webkit-fill-available;
      }
      flex-container:nth-child(even) md-text-button {
        background: var(--md-sys-color-tertiary);
        --md-text-button-label-text-color: var(--md-sys-color-on-tertiary);
        --md-text-button-pressed-label-text: var(--md-sys-color-on-tertiary);
      }
      flex-container h4:first-child {
        margin-top: 0;
      }

      @media (min-width: 1200px) {
        md-text-button {
          width: calc(100% / 5 - 8px);
        }
      }
    `
  ]

  render() {
    return html` ${this.products
      ? Object.entries(this.products).map(([category, products]) =>
          products.map
            ? html`
                <flex-container>
                  <flex-row width="100%">
                    <custom-typography><h4>${category}</h4></custom-typography> </flex-row
                  ><flex-wrap-between>
                    ${products.map((product) => html`<md-text-button> ${product.name}</md-text-button>`)}
                  </flex-wrap-between>
                </flex-container>
              `
            : ''
        )
      : ''}`
  }
}
