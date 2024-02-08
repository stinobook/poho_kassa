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
        max-height: calc(100% - 407px);
        position: relative;
        border-radius: var(--md-sys-shape-corner-extra-large);
      }

      ::-webkit-scrollbar {
        width: 8px;
        border-radius: var(--md-sys-shape-corner-extra-large);
        background-color: var(--md-sys-color-surface-container-highest);
      }
      ::-webkit-scrollbar-thumb {
        background: var(--md-sys-color-on-surface-container-highest);
        border-radius: var(--md-sys-shape-corner-extra-large);
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.5) inset;
      }
      flex-container {
        min-width: 0;
        height: fit-content;
        position: relative;
        overflow: hidden;
        overflow-y: auto;
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
        padding: 6px 24px;
        margin-top: 8px;
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
    if (this.items[productKey]) this.items[productKey].amount += 1
    else {
      const product = (await firebase.get(`products/${productKey}`)) as Product
      this.items[productKey] = { ...product, amount: 1 }
    }
    this.requestRender()
    const scrollAnchor = document
      .querySelector('body > po-ho-shell')
      .shadowRoot.querySelector('custom-drawer-layout > custom-pages > sales-view')
      .shadowRoot.querySelector('sales-pad')
      .shadowRoot.querySelector('sales-receipt')
      .shadowRoot.querySelector('#scrollAnchor') as HTMLDivElement | null
    scrollAnchor.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  render() {
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
                      <flex-it></flex-it>
                      <small
                        >${Number(item.price).toLocaleString(navigator.language, {
                          style: 'currency',
                          currency: 'EUR'
                        })}</small
                      >
                    </flex-row>
                    <flex-row>
                      ${item.amount ? html`<span>x ${item.amount}</span>` : ''}

                      <flex-it></flex-it>
                      ${Number(item.price * item.amount).toLocaleString(navigator.language, {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </flex-row>
                  </flex-column>
                </li>
              `
            )
          : ''}
        <div id="scrollAnchor"></div>
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
