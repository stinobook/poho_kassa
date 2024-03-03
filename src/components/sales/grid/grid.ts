import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@material/web/list/list-item.js'
import '@material/web/button/filled-button.js'
import '@vandeurenglenn/flex-elements/wrap-between.js'
import { Product } from '../../../types.js'

@customElement('sales-grid')
export class SalesGrid extends LiteElement {
  productsByCategory: { [index: string]: Product[] } = {}

  @property({ consumer: true })
  accessor products: { [index: string]: Product[] }

  async willChange(propertyKey: any, value: any) {
    if (propertyKey === 'products') {
      const productsByCategory = {}
      for (const product of value) {
        if (!productsByCategory[product.category]) {
          productsByCategory[product.category] = []
        }
        productsByCategory[product.category].push(product)
      }
      return productsByCategory
    }
    return value
  }
  connectedCallback() {
    this.addEventListener('click', (event) => {
      const paths = event.composedPath() as HTMLElement[]
      const key = paths[2]?.hasAttribute ? paths[2].getAttribute('key') : paths[3].getAttribute('key')
      if (key != null) {
        this.dispatchEvent(new CustomEvent('product-click', { detail: key }))
      }
    })
  }

  static styles = [
    css`
      :host {
        display: flex;
        width: 100%;
        padding: 12px;
        box-sizing: border-box;
        flex-direction: column;
        overflow-y: auto;
      }
      md-filled-button {
        pointer-events: auto;
        height: 86.33px;
        margin: 4px;
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

      flex-container h4:first-child {
        margin-top: 0;
      }

      @media (min-width: 1200px) {
        md-filled-button {
          width: calc(100% / 5 - 8px);
        }
      }

      @media (max-width: 689px) {
        :host {
          padding: 0 12px;
        }
      }
    `
  ]

  renderGrid(items = this.products) {
    return Object.entries(items).map(([category, products]) =>
      products
        ? html`
            <flex-container>
              <flex-row width="100%">
                <custom-typography><h4>${category}</h4></custom-typography> </flex-row
              ><flex-wrap-between>
                ${[...products].map((product) => {
                  return html`<md-filled-button key=${product.key} label=${product.name}
                    >${product.name}</md-filled-button
                  >`
                })}
              </flex-wrap-between>
            </flex-container>
          `
        : ''
    )
  }

  render() {
    return html` ${this.productsByCategory ? this.renderGrid() : ''}`
  }
}
