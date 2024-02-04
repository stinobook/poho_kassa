import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@material/web/list/list-item.js'
import '@material/web/list/list.js'

export declare type ReceiptItem = { id: string; price: number; name: string; description?: string }

@customElement('sales-grid')
export class SalesGrid extends LiteElement {
  @property({ consumer: true })
  products

  static styles = [
    css`
      :host {
        display: flex;
        max-width: 240px;
        width: 100%;
        padding: 12px 24px;
        box-sizing: border-box;
      }
      flex-row,
      flex-column {
        width: 100%;
      }

      li {
        display: flex;
        width: 100%;
      }
    `
  ]

  render() {
    return html` <md-list>
      ${this.products
        ? Object.entries(this.products).map(([key, product]) => html`<md-list-item>${product.name}</md-list-item>`)
        : ''}
    </md-list>`
  }
}
