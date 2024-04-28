import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@material/web/list/list-item.js'
import '@material/web/button/filled-button.js'
import { Product } from '../../../types.js'
import { calculateSalesInputButtonSize } from '../../../utils/resize-sales-input-button.js'

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
    let settings = localStorage.getItem('settings') as string | { salesInputButtonSize }
    if (settings) {
      settings = JSON.parse(settings as string) as { salesInputButtonSize }
      if (settings.salesInputButtonSize !== undefined) {
        const { height, fontSize } = calculateSalesInputButtonSize(settings.salesInputButtonSize)

        document.body.style.setProperty('--sales-input-height', `${height}px`)
        document.body.style.setProperty('--sales-input-font-size', `${fontSize}em`)
      }
    }
    this.addEventListener('click', event => {
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
        height: var(--sales-input-height, 64px);
        font-size: var(--sales-input-font-size, 0.95em);
        text-wrap: wrap;
        line-height: normal;
        text-transform: uppercase;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-auto-rows: min-content;
        height: auto;
        gap: 16px 8px;
        width: 100%;
      }

      flex-container {
        max-width: -webkit-fill-available;
      }

      flex-container h4:first-child {
        margin-top: 0;
      }

      @media (max-width: 689px) {
        :host {
          padding: 0 12px;
        }
        md-filled-button {
          font-size: 1em;
        }
        .grid {
          grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
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
              ><span class="grid">
                ${[...products].map(product => {
                  return html`<md-filled-button
                    key=${product.key}
                    label=${product.name}
                    >${product.name}</md-filled-button
                  >`
                })}
              </span>
            </flex-container>
          `
        : ''
    )
  }

  render() {
    return html` ${this.productsByCategory ? this.renderGrid() : ''}`
  }
}
