import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

export declare type ReceiptItem = { id: string; price: number; name: string; vat?: Number; amount: Number }

@customElement('sales-receipt')
export class SalesReceipt extends LiteElement {

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        max-width: 255px;
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: var(--md-sys-shape-corner-extra-large);
      }
      flex-container {
        min-width: 0;
        height: fit-content;
        position: relative;
        overflow: hidden;
      }
      flex-row,
      flex-column {
        width: 100%;
      }

      li {
        display: flex;
        background-color: var(--md-sys-color-surface-container-high);
        width: 100%;
        border-radius: var(--md-sys-shape-corner-extra-large);
        box-sizing: border-box;
        padding: 4px 12px;
        margin-top: 14px;
      }

      li span {
        margin-left: 4px;
        margin-right: 4px;
      }

      .total {
        box-sizing: border-box;
        padding: 12px 24px;
      }
    `
  ]

  @property({ type: Array, consumer: true, provider: true})
  items: ReceiptItem[] = [{ name: 'cola', id: '1', price: 1, amount: 1, vat: 21 }]

  @property({ type: Number })
  total

  onChange(propertyKey) {
    if (propertyKey === 'items')
      this.total = this.items.reduce((total, item) => {
        total += item.amount * item.price
        return total
      }, 0)
  }

  render() {
    return html`
      <custom-elevation level="1"></custom-elevation>
      <flex-container>
        ${map(
          this.items,
          (item: ReceiptItem) => html`
            <li>
              <flex-column>
                <flex-row center>
                  ${item.name}
                  <span>${item.amount} x</span>
                  ${Number(item.price).toLocaleString(navigator.language, { style: 'currency', currency: 'EUR' })}
                  <flex-it></flex-it>
                  ${Number(item.price * item.amount).toLocaleString(navigator.language, {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </flex-row>
                ${item.vat ? html`<small>${item.vat}</small>` : ''}
              </flex-column>
            </li>
          `
        )}
      </flex-container>
      <flex-it></flex-it>
      <flex-row center class="total">
        <strong>Total:</strong>
        <flex-it></flex-it>
        ${Number(this.total).toLocaleString(navigator.language, {
          style: 'currency',
          currency: 'EUR'
        })}
      </flex-row>
    `
  }

  export function addToReceipt(productId: number) {

    this.items = [...this.items,
      {name: 'cola', id: productId, price: 1, amount: 1, vat: 21 }];

  }
}
