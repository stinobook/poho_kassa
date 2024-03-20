import { html, css, LiteElement, customElement, property, query } from '@vandeurenglenn/lite'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lite-elements/button.js'
import '@vandeurenglenn/lite-elements/dialog.js'
import '@vandeurenglenn/flex-elements/wrap-between.js'
import './receipt.js'
import './input.js'
import { Transaction, ReceiptItem } from '../../../types.js'

@customElement('sales-pad')
export class SalesPad extends LiteElement {
  transaction: { [key: string]: Transaction[] } = {}
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
      }

      sales-receipt {
        margin-bottom: 24px;
      }

      custom-dialog {
        z-index: 1000;
      }
      .dialogCash flex-row {
        flex-wrap: wrap;
        --custom-elevation: 1;
      }
      custom-button {
        background-color: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        height: 50px;
        width: 98px;
      }
      flex-wrap-between {
        max-width: 320px;
        background-color: var(--md-sys-color-surface-container-high);
        border-radius: var(--md-sys-shape-corner-extra-large);
        padding: 6px 0;
        box-sizing: border-box;
        gap: 12px;
        margin-bottom: 16px;
      }
    `
  ]

  @query('sales-receipt')
  accessor receipt

  @property()
  accessor qrcode

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

  async inputTap({ detail }: CustomEvent) {
    if (this.receipt.items[this.currentSelectedProduct]?.description || detail === 'cash' || detail === 'payconiq') {
      switch (detail) {
        case 'cash':
          if (Object.keys(this.receipt.items).length === 0) {
            alert('Nothing to sell')
            break
          } else {
            let dialogCash = this.shadowRoot.querySelector('custom-dialog.dialogCash') as HTMLDialogElement
            dialogCash.open = true
            break
          }
        case 'payconiq':
          if (Object.keys(this.receipt.items).length === 0) {
            alert('Nothing to sell')
            break
          } else {
            let dialogPayconiq = this.shadowRoot.querySelector('custom-dialog.dialogPayconiq') as HTMLDialogElement
            const amount = Object.values(this.receipt.items).reduce(
              (total: number, cur: ReceiptItem) => total + cur.amount * cur.price,
              0
            )

            const description = `payment`

            const body = JSON.stringify({
              amount,
              description
            })

            const response = await fetch('https://us-central1-poho-app.cloudfunctions.net/createPayment', {
              method: 'POST',
              body
            })

            this.qrcode = (await response.json()).qrcode.href

            dialogPayconiq.open = true
            break
          }
        default:
          if (this.currentSelectedProduct) {
            if (detail !== '0') {
              alert("You can't do that")
            } else {
              this.receipt.removeProduct(this.currentSelectedProduct)
              this.currentProductAmount = ''
              const keys = Object.keys(this.receipt.items)
              this.currentSelectedProduct = keys[keys.length - 1]
            }
          }

          break
      }
    } else {
      switch (detail) {
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
  }

  connectedCallback() {
    let dialogCash = this.shadowRoot.querySelector('custom-dialog.dialogCash') as HTMLDialogElement
    dialogCash.addEventListener('close', (event) => {
      this.writeTransaction({ event })
    })
    let dialogPayconiq = this.shadowRoot.querySelector('custom-dialog.dialogPayconiq') as HTMLDialogElement
    dialogPayconiq.addEventListener('close', (event) => {
      this.writeTransaction({ event })
    })
  }

  writeTransaction({ event }) {
    if (event.detail === 'cancel' || event.detail === 'close') {
      return
    }
    if (event.detail === 'accepted') {
      let total = this.receipt.total
      this.receipt.textTotalorChange = 'Geslaagd'
      let transaction: Transaction = {
        paymentMethod: 'payconiq',
        paymentAmount: total,
        transactionItems: this.receipt.items
      }
      firebase.push('transactions', transaction)
      this.receipt.items = {}
    } else {
      let cashChange = event.detail
      let total = this.receipt.total
      if (cashChange === 'exact') {
        cashChange = total
      }
      if (cashChange < total) {
        alert('Te laag bedrag!')
      } else {
        cashChange -= Number(total)
        this.receipt.total = cashChange
        this.receipt.textTotalorChange = 'Wisselgeld'
        let transaction: Transaction = {
          paymentMethod: 'cash',
          paymentAmount: total,
          transactionItems: this.receipt.items
        }
        firebase.push('transactions', transaction)
        this.receipt.items = {}
      }
    }
  }

  render() {
    return html`
      <custom-dialog class="dialogCash">
        <span slot="title">Cash Ontvangst</span>

        <flex-wrap-between>
          <custom-button label="&euro;300" action="300" has-label="">&euro;300</custom-button>
          <custom-button label="&euro;200" action="200" has-label="">&euro;200</custom-button>
          <custom-button label="&euro;100" action="100" has-label="">&euro;100</custom-button>
          <custom-button label="&euro;50" action="50" has-label="">&euro;50</custom-button>
          <custom-button label="&euro;20" action="20" has-label="">&euro;20</custom-button>
          <custom-button label="&euro;10" action="10" has-label="">&euro;10</custom-button>
          <custom-button label="&euro;5" action="5" has-label="">&euro;5</custom-button>
          <custom-button label="Gepast" action="exact" has-label="">Gepast</custom-button>
        </flex-wrap-between>

        <flex-row slot="actions">
          <custom-button label="Annuleer" action="cancel" has-label="">Annuleer</custom-button>
        </flex-row>
      </custom-dialog>

      <custom-dialog class="dialogPayconiq">
        <span slot="title">Payconiq Ontvangst</span>
        <flex-row slot="actions" direction="row">
          <img action="accepted" src=${this.qrcode} />
        </flex-row>
      </custom-dialog>

      <sales-receipt @selection=${(event) => this.onReceiptSelection(event)}></sales-receipt>
      <flex-it></flex-it>
      <sales-input @input-click=${(event) => this.inputTap(event)}></sales-input>
    `
  }
}
