import { html, css, LiteElement } from '@vandeurenglenn/lite'
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
import '@vandeurenglenn/lit-elements/dialog.js'
import './receipt.js'
import './input.js'
import '@vandeurenglenn/flex-elements/wrap-evenly.js'
import { query } from '@vandeurenglenn/lite'

@customElement('sales-pad')
export class SalesPad extends LiteElement {
  currentSelectedProduct: string
  currentProductAmount: string = ''
  static styles = [
   css`
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
  ]

  @query('sales-receipt')
  receipt

  addProduct(product) {
    let amount = this.receipt.items[product] ? this.receipt.items[product].amount + 1 : 1
    this.currentSelectedProduct = product
    this.currentProductAmount = ''
    this.receipt.addProduct(product, amount)
  }

  onReceiptSelection({ detail }: CustomEvent) {
    this.currentProductAmount = ''
    this.currentSelectedProduct = detail
  }

  inputTap({ detail }: CustomEvent) {
    console.log(detail)

    switch (detail) {
      case 'cash':
        let dialogCash = this.shadowRoot.querySelector('custom-dialog.dialogCash') as HTMLDialogElement
        dialogCash.open = true
        break
      case 'payconiq':
        let popupCash = this.shadowRoot.querySelector('#popupcash') as HTMLDialogElement
        popupCash.open = true
        break
      case '+1':
        if (this.receipt.items[this.currentSelectedProduct]) {
          let amount
          if (this.currentProductAmount.length > 0) {
            amount = Number(this.currentProductAmount) + Number(detail)

            this.currentProductAmount = String(amount)
          } else {
            amount = Number(this.receipt.items[this.currentSelectedProduct].amount) + Number(detail)
          }
          this.receipt.addProduct(this.currentSelectedProduct, amount)
        }
        break
      case 'R':
        if (this.receipt.items[this.currentSelectedProduct]) {
          this.currentProductAmount = ''
          this.receipt.addProduct(this.currentSelectedProduct, 1)
        }
        this.currentProductAmount = ''
        break

      default:
        if (this.currentSelectedProduct) {
          this.currentProductAmount += detail
          if (this.currentProductAmount !== '0') {
            this.receipt.addProduct(this.currentSelectedProduct, this.currentProductAmount)
          } else {
            this.receipt.removeProduct(this.currentSelectedProduct)
            this.currentProductAmount = ''

            const keys = Object.keys(this.receipt.items)
            this.currentSelectedProduct = keys[keys.length - 1]
          }
        }

        break
    }
  }

  connectedCallback() {
    let dialogCash = this.shadowRoot.querySelector('custom-dialog.dialogCash') as HTMLDialogElement
    dialogCash.addEventListener('close', (event) => {
      this.cashWrite({event})
    })
  }

  cashWrite({ event }) {
    console.log(event.detail)
  }


  render() {
    return html`
      <sales-receipt @selection=${(event) => this.onReceiptSelection(event)}></sales-receipt>
      <flex-it></flex-it>
      <sales-input @input-click=${(event) => this.inputTap(event)}></sales-input>
      <flex-container style='z-index:1000'>
              <custom-dialog class="dialogCash" has-actions="" has-header="">
                <span slot="title">Cash Ontvangst</span>
                <flex-row slot="actions" direction="row">
                <custom-button label="&euro;50" action="50" has-label="">&euro;50</custom-button>
                <custom-button label="&euro;20" action="20" has-label="">&euro;20</custom-button>
                <custom-button label="&euro;10" action="10" has-label="">&euro;10</custom-button>
                <custom-button label="&euro;5" action="5" has-label="">&euro;5</custom-button>
                <custom-button label="Gepast" action="gepast" has-label="">Gepast</custom-button>
                </flex-row>
              </custom-dialog>
      <flex-container>
    `
  }
}
