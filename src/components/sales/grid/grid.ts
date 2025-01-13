import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@material/web/button/filled-button.js'
import { Product } from '../../../types.js'
import { calculateSalesInputButtonSize } from '../../../utils/resize-sales-input-button.js'
import '@vandeurenglenn/lite-elements/button.js'
@customElement('sales-grid')
export class SalesGrid extends LiteElement {
  @property({ consumes: true }) accessor products: { [index: string]: Product[] }

  @property({ type: String, consumes: true }) accessor user: string

  // This is a lifecycle method that will be called when the property changes
  // It will return the value that will be set to the property
  // This is useful to transform the data before it is set to the property and the component is rerendered
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

  onChange(propertyKey: string, value: any): void {
    if (propertyKey === 'user' && value) {
      if (value.salesInputButtonSize !== undefined) {
        const { height, fontSize } = calculateSalesInputButtonSize(value.salesInputButtonSize)
        document.body.style.setProperty('--sales-input-height', `${height}px`)
        document.body.style.setProperty('--sales-input-font-size', `${fontSize}em`)
      }
    }
  }

  firstRender() {
    // auto cleanup the event listener
    this.addListener('click', event => {
      const paths = event.composedPath() as HTMLElement[]
      const key = paths[0].getAttribute('key')

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
      custom-button {
        height: var(--sales-input-height, 64px);
        font-size: var(--sales-input-font-size, 0.95em);
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
        max-width: 100%;
      }

      flex-container h4:first-child {
        margin-top: 0;
      }

      h4 {
        font-size: var(--sales-input-font-size, 0.95em);
      }

      @media (max-width: 689px) {
        :host {
          padding: 0 12px;
        }
        custom-button {
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
                  return html`<custom-button
                    type="filled"
                    key=${product.key}
                    .label=${product.name}></custom-button>`
                })}
              </span>
            </flex-container>
          `
        : ''
    )
  }

  render() {
    return html` ${this.products ? this.renderGrid() : '<h3>No Products Found</h3>'} `
  }
}
