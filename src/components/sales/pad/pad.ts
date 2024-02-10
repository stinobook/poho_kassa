import { html, css, LitElement, CSSResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lit-elements/tabs.js'
import '@vandeurenglenn/lit-elements/tab.js'
import '@vandeurenglenn/lit-elements/divider.js'
import '@vandeurenglenn/lit-elements/icon-button.js'
import '@vandeurenglenn/lit-elements/button.js'
import '@vandeurenglenn/lit-elements/card.js'
import './receipt.js'
import './input.js'
import '@vandeurenglenn/flex-elements/wrap-evenly.js'
import { query } from '@vandeurenglenn/lite'
import '@material/web/dialog/dialog.js'

@customElement('sales-pad')
export class SalesPad extends LitElement {
  currentSelectedProduct: string
  currentProductAmount: string = ''
  static styles: CSSResult = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      max-width: 240px;
      padding-right: 12px;
      box-sizing: border-box;
      position: relative;
    }

    sales-receipt {
      margin-bottom: 24px;
    }
  `

  @query('sales-receipt')
  receipt

  addProduct(product) {
    this.currentProductAmount = ''
    this.currentSelectedProduct = product
    const amount = this.receipt.items[product] ? this.receipt.items[product].amount : 0
    this.receipt.addProduct(product, amount + 1)
  }

  onReceiptSelection({ detail }: CustomEvent) {
    this.currentProductAmount = ''
    this.currentSelectedProduct = detail
  }

  inputTap({ detail }: CustomEvent) {
    switch (detail) {
      case 'cash':
      case 'payconiq':
        let popupCash = this.shadowRoot.querySelector('#popupcash') as HTMLDialogElement
        popupCash.open = true
        break
      case '+1':
        if (this.receipt.items[this.currentSelectedProduct]) {
          const amount = Number(this.receipt.items[this.currentSelectedProduct].amount) + Number(detail)
          this.receipt.addProduct(this.currentSelectedProduct, amount)
          this.currentProductAmount = ''
        }
        break
      case 'E':
        if (this.receipt.items[this.currentSelectedProduct] && this.currentProductAmount.length > 0) {
          this.receipt.addProduct(this.currentSelectedProduct, this.currentProductAmount)
        }
        this.currentProductAmount = ''
        break

      default:
        if (this.currentSelectedProduct) {
          this.currentProductAmount += detail
          if (this.currentProductAmount !== '0') {
            this.receipt.addProduct(this.currentSelectedProduct, this.currentProductAmount)
          } else {
            this.currentProductAmount = ''
            this.currentSelectedProduct = undefined
            this.receipt.removeProduct(this.currentSelectedProduct)
            const keys = Object.keys(this.receipt.items)
            this.currentSelectedProduct = keys[keys.length - 1]
            this.currentProductAmount = ''
          }
        }

        break
    }
  }

  render() {
    return html`
      <sales-receipt @selection=${(event) => this.onReceiptSelection(event)}></sales-receipt>
      <flex-it></flex-it>
      <sales-input @input-click=${(event) => this.inputTap(event)}></sales-input>
      <md-dialog id="popupcash">
        <div slot="headline">Cash Ontvangst</div>
        <form slot="content" id="form-id" method="dialog">
          <md-filled-button form="form-id" value="50">&euro;50</md-filled-button>
          <md-filled-button form="form-id" value="20">&euro;20</md-filled-button>
          <md-filled-button form="form-id" value="10">&euro;10</md-filled-button>
          <md-filled-button form="form-id" value="5">&euro;5</md-filled-button>
        </form>
        <div slot="actions">
          <md-outlined-button form="form-id" value="">Gepast</md-outlined-button>
        </div>
      </md-dialog>
    `
  }
}
