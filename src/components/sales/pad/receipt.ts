import { html, css, LiteElement, property, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import type { Product, ReceiptItem } from '../../../types.js'
import '@vandeurenglenn/lit-elements/button.js'
import '@vandeurenglenn/lit-elements/dialog.js'
import '@material/web/textfield/filled-text-field.js'

@customElement('sales-receipt')
export class SalesReceipt extends LiteElement {
  @property({ type: Object })
  accessor items: { [key: string]: ReceiptItem } = {}

  @property({ type: Number })
  accessor total: number = 0

  @property({ type: String })
  accessor textTotalorChange: string = 'Totaal'

  @query('flex-container')
  accessor _container

  static styles = [
    css`
      * {
        pointer-events: none;
      }
      :host {
        pointer-events: none;
        display: flex;
        flex-direction: column;
        max-width: 255px;
        width: 100%;
        height: 100%;
        max-height: calc(100% - 354px);
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
        height: -webkit-fill-available;
        position: relative;
        overflow: hidden;
        overflow-y: auto;
      }
      flex-row,
      flex-column {
        width: 100%;
      }

      button {
        pointer-events: auto;
        position: relative;
        background: transparent;
        color: inherit;
        border: none;
        display: flex;
        width: 100%;
        border-radius: var(--md-sys-shape-corner-extra-large);
        box-sizing: border-box;
        padding: 6px 24px;
        margin-top: 8px;
        cursor: pointer;
      }

      button:hover {
        --md-elevation-level: 2;
      }

      button span {
        margin-left: 4px;
        margin-right: 4px;
      }

      .total {
        box-sizing: border-box;
        padding: 12px 24px;
      }

      button[active] {
        background-color: var(--md-sys-color-surface-container-high);
        --md-elevation-level: 3;
      }

      .dialogInput {
        z-index: 1000;
      }
      .dialogInput * {
        pointer-events: auto;
      }
    `
  ]

  removeProduct = (productKey) => {
    if (!this.items[productKey]) return
    const amount = this.items[productKey].amount
    const price = this.items[productKey].price
    this.total -= price * amount
    delete this.items[productKey]
    const keys = Object.keys(this.items)
    this.#lastSelected = keys[keys.length - 1]
    this.requestRender()
  }

  addProduct = async (productKey: string, amount: number = 1) => {
    amount = Number(amount)
    this.#lastSelected = productKey
    if (this.textTotalorChange !== 'Totaal') {
      this.total = 0
      this.textTotalorChange = 'Totaal'
    }
    if (this.items[productKey] && !this.items[productKey].description) {
      this.total -= this.items[productKey].price * this.items[productKey].amount
      this.items[productKey].amount = amount
      this.total += this.items[productKey].price * amount
      const index = Object.keys(this.items).indexOf(productKey)
      this.requestRender()
      this._container.scroll(0, index * 76)
    } else if (this.items[productKey] && this.items[productKey].description !== 'needsExtra') {
    alert('Max 1 of this item!')
    } else {
      const product = (await firebase.get(`products/${productKey}`)) as Product
      if (product.description) {
        const value = await this.dialogInput()
        product.description = value
      }
      this.items[productKey] = { ...product, amount, key: productKey }
      this.requestRender()
      this.total += product.price * amount
      requestAnimationFrame(() => {
        this._container.scroll(0, this._container.scrollHeight)
      })
    }

    // this.scrollIntoView()
  }

  dialogInput(): Promise<string> {
    return new Promise((resolve) => {
      const dialog = this.shadowRoot.querySelector('custom-dialog') as HTMLDialogElement
      const closeAction = () => {
        let inputValue = (this.shadowRoot.querySelector('md-filled-text-field.dialoginput-value') as HTMLInputElement).value
        if (inputValue !== '') {
        resolve(inputValue);
        (this.shadowRoot.querySelector('md-filled-text-field.dialoginput-value') as HTMLInputElement).value = ''
        dialog.removeEventListener('close', closeAction)
        } else {
        alert('Nothing entered')
        dialog.removeEventListener('close', closeAction)
        }
      }
      dialog.addEventListener('close', closeAction)
      dialog.open = true
    })
  }

  #lastSelected
  connectedCallback() {
    this.total = 0
    this.shadowRoot.addEventListener('click', (event) => {
      const paths = event.composedPath() as HTMLElement[]
      this.#lastSelected = paths[0].getAttribute('key')
      this.requestRender()
      this.dispatchEvent(new CustomEvent('selection', { detail: this.#lastSelected }))
    })
  }

  render() {
    return html`
      <custom-elevation level="1"></custom-elevation>
      <flex-container>
        ${this.items
          ? map(
              Object.values(this.items),
              (item: ReceiptItem) => html`
                <button key=${item.key} ?active=${item.key === this.#lastSelected}>
                  <md-ripple></md-ripple>
                  <custom-elevation></custom-elevation>
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
                </button>
              `
            )
          : ''}
      </flex-container>
      <flex-it></flex-it>
      <flex-row center class="total">
        <strong>${this.textTotalorChange}:</strong>
        <flex-it></flex-it>
        ${Number(this.total).toLocaleString(navigator.language, {
          style: 'currency',
          currency: 'EUR'
        })}
      </flex-row>
      <custom-dialog class="dialogInput" has-actions="" has-header="">
        <span slot="title">Input required</span>
        <md-filled-text-field class="dialoginput-value"></md-filled-text-field>
        <flex-row slot="actions" direction="row">
          <custom-button label="send" action="send" has-label="">Verstuur</custom-button>
        </flex-row>
      </custom-dialog>
    `
  }
}
