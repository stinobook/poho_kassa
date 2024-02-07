import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import type { Product, ReceiptItem } from '../../../types.js'

@customElement('sales-receipt')
export class SalesReceipt extends LiteElement {
  @property({ type: Object })
  items: { [key: string]: ReceiptItem } = {}

  @property({ type: Number })
  total: number

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

  onChange(propertyKey) {
    if (propertyKey === 'items')
      this.total = Object.values(this.items).reduce((total: number, item: ReceiptItem) => {
        total += item.amount * item.price
        return total
      }, 0)
  }

  addProduct = async (productKey: string) => {
    console.log(productKey)

    if (this.items[productKey]) this.items[productKey].amount += 1
    else {
      const product = (await firebase.get(`products/${productKey}`)) as Product
      this.items[productKey] = { ...product, amount: 1 }
    }
    this.requestRender()
  }

  render() {
    console.log(this.items)

    return html`
      <custom-elevation level="1"></custom-elevation>
      <flex-container>
        ${this.items
          ? map(
              Object.values(this.items),
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
            )
          : ''}
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
}
