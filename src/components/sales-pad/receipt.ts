import { html, css, LitElement, CSSResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

export declare type ReceiptItem = { id: string; price: number; name: string; description?: string }

@customElement('sales-receipt')
export class SalesReceipt extends LitElement {
  static styles: CSSResult = css`
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

  @property({ type: Array })
  items: ReceiptItem[] = [{ name: 'cola', id: '1', price: 1 }]

  render() {
    return html`
      ${map(
        this.items,
        (item: ReceiptItem) => html`
          <li>
            <flex-column>
              <flex-row>
                ${item.name}
                <flex-it></flex-it>
                ${Number(item.price).toLocaleString(navigator.language, { style: 'currency', currency: 'EUR' })}
              </flex-row>
              ${item.description ? html`<small>${item.description}</small>` : ''}
            </flex-column>
          </li>
        `
      )}
    `
  }
}
