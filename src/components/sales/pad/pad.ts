import { html, css, LiteElement, customElement, property, query } from '@vandeurenglenn/lite'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lite-elements/button.js'
import '@vandeurenglenn/lite-elements/dialog.js'
import '@vandeurenglenn/flex-elements/wrap-between.js'
import './receipt.js'
import './input.js'
import { Transaction, ReceiptItem, PayconiqPayment, Member, Tab, Product } from '../../../types.js'
import { CustomDialog } from '@vandeurenglenn/lite-elements/dialog.js'
import { CustomNotifications } from '@vandeurenglenn/lite-elements/notifications'

@customElement('sales-pad')
export class SalesPad extends LiteElement {
  @property({ consumer: true, renders: false })
  accessor promo: { [key: string]: Boolean }
  transaction: { [key: string]: Transaction[] } = {}
  @property({ type: Object, consumer: true })
  accessor members: { Type: Member }
  @property({ type: Array, consumer: true })
  accessor tabs: Tab[]
  @property({ type: Object, consumer: true })
  accessor expiredMembersList: { Type: Member }
  currentSelectedProduct: string
  currentProductAmount: string = ''

  #currentPayconiqTransaction

  @property()
  accessor cancelPayment
  @property({type: Boolean})
  accessor expirationPayment = false

  @query('.dialogPayconiq')
  accessor payconiqDialog: CustomDialog

  get notifications(): CustomNotifications {
    return document.querySelector('custom-notifications')
  }

  productsByCategory: { [index: string]: Product[] } = {}

  @property({ consumer: true })
  accessor products: { [index: string]: Product[] }

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
  
  async payconiqPaymentChange(payment: PayconiqPayment) {
    if (this.#currentPayconiqTransaction?.paymentId === payment.paymentId) {
      if (payment.status === 'PENDING' || payment.status === 'AUTHORIZED' || payment.status === 'IDENTIFIED') return

      this.notifications.createNotification({
        title: 'Poho',
        message: `${this.#currentPayconiqTransaction.paymentId} ${payment.status}!`
      })

      // replace whole current with update payment
      this.#currentPayconiqTransaction = payment

      if (payment.status === 'SUCCEEDED') {
        await this.writeTransaction({ event: { detail: 'accepted' } }, true)
      }

      this.payconiqDialog.open = false
      this.cancelPayment = undefined
      this.#currentPayconiqTransaction = undefined
      this.qrcode = undefined
    }
  }

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
      .dialogPromo custom-button {
        height: 75px;
      }
      .dialogPayconiq img {
        max-width: 100%;
        margin: 0 auto;
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

        margin-top: 24px;
        gap: 12px;
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
    let tabPay = await firebase.get('tabPay')
    if (tabPay) {
      this.receipt.items = Object.values(this.tabs).filter(tab => tab.key === tabPay)[0].transactionItems
      let total = 0
      for (const item of Object.values(this.receipt.items) as ReceiptItem[]) {
        total += Number(item.price) * Number(item.amount)
      }
      this.receipt.total = total
    }
    if (
      this.receipt.items[this.currentSelectedProduct]?.description ||
      detail === 'cash' ||
      detail === 'payconiq' ||
      detail === 'promo' ||
      detail === 'members'
    ) {
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
            dialogPayconiq.open = true
            const amount = Object.values(this.receipt.items).reduce(
              (total: number, cur: ReceiptItem) => total + cur.amount * cur.price,
              0
            )

            const description = `payment`

            const response = await fetch(
              `https://us-central1-poho-app.cloudfunctions.net/createPayment?amount=${amount}&description=${description}`,
              {
                method: 'POST'
              }
            )

            const payment = (await response.json()) as PayconiqPayment
            await firebase.set(`payconiqTransactions/${payment.paymentId}`, payment)
            this.#currentPayconiqTransaction = payment
            this.qrcode = `${payment._links.qrcode.href}&f=svg`
            this.cancelPayment = async () => {
              await fetch(
                `https://us-central1-poho-app.cloudfunctions.net/cancelPayment?payment=${payment._links.cancel.href}`
              )
            }
            break
          }
        case 'promo':
          if (Object.keys(this.receipt.items).length === 0) {
            alert('Nothing to sell')
            break
          } else if (Object.keys(this.receipt.items).length > 1 || Object.values(this.receipt.items)[0].amount > 1) {
            alert('Max 1 item!')
            break
          } else {
            this.renderPromo()
            this.requestRender()
            let dialogPromo = this.shadowRoot.querySelector('custom-dialog.dialogPromo') as HTMLDialogElement
            dialogPromo.open = true
            break
          }
        case 'members':
          if (Object.keys(this.receipt.items).length !== 0) {
            alert('Item op de lijst!')
            break
          } else {
            this.renderExpired()
            this.requestRender()
            let dialogExpired = this.shadowRoot.querySelector('custom-dialog.dialogExpired') as HTMLDialogElement
            dialogExpired.open = true
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
    dialogCash.addEventListener('close', event => {
      this.writeTransaction({ event })
    })
    let dialogPayconiq = this.shadowRoot.querySelector('custom-dialog.dialogPayconiq') as HTMLDialogElement
    dialogPayconiq.addEventListener('close', event => {
      this.writeTransaction({ event }, true)
    })
    let dialogPromo = this.shadowRoot.querySelector('custom-dialog.dialogPromo') as HTMLDialogElement
    dialogPromo.addEventListener('close', event => {
      this.writeTransaction({ event }, '', true)
    })
    let dialogExpired = this.shadowRoot.querySelector('custom-dialog.dialogExpired') as HTMLDialogElement
    dialogExpired.addEventListener('close', event => {
      this.expirationTransaction({event})
    })
  }

  async expirationTransaction({event}) {
    let member: Member = Object.values(this.expiredMembersList).filter(member => member.key === event.detail)[0]
    let paymentMethod = await this.dialogPay()
    let ReceiptItem: ReceiptItem 
    if (member.extra) {
      ReceiptItem = Object.values(this.products['Lidgeld']).filter((product) => product.price > 100)[0]
    } else {
      ReceiptItem = Object.values(this.products['Lidgeld']).filter((product) => product.price < 100)[0]
    }
    
    console.log(ReceiptItem)
  }

  dialogPay(): Promise<CustomEvent> {
    return new Promise(resolve => {
      const dialog = this.shadowRoot.querySelector('custom-dialog.dialogPay') as HTMLDialogElement
      const closeAction = event => {
        resolve(event)
        dialog.removeEventListener('close', closeAction)
      }
      dialog.addEventListener('close', closeAction)
      dialog.open = true
    })
  }

  async writeTransaction({ event }, payconiq?, promo?, expiration?) {
    let tabPay = await firebase.get('tabPay')
    if (event.detail === 'cancel' || event.detail === 'close') {
      if (payconiq) {
        this.cancelPayment?.()
      }
      if (tabPay) {
        await firebase.set('tabPay', null)
        this.receipt.items = {}
        this.receipt.total = 0
      }
      this.receipt.textTotalorChange = 'Geannuleerd'
      return
    }
    if (event.detail === 'accepted') {
      let total = this.receipt.total
      this.receipt.textTotalorChange = 'Geslaagd'
      let transaction: Transaction = {
        paymentMethod: 'payconiq',
        paymentAmount: total,
        payment: this.#currentPayconiqTransaction,
        transactionItems: this.receipt.items
      }
      await firebase.push('transactions', transaction)
      await firebase.remove('tabs/' + tabPay)
      await firebase.set('tabPay', null)
      this.receipt.items = {}
    } else if (promo) {
      this.receipt.textTotalorChange = 'Promo'
      let transaction: Transaction = {
        paymentMethod: 'promo',
        paymentAmount: 0,
        member: event.detail,
        transactionItems: this.receipt.items
      }
      await firebase.push('transactions', transaction)
      const update = {}
      update[event.detail] = false
      await firebase.update('promo', update)
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
        await firebase.push('transactions', transaction)
        await firebase.remove('tabs/' + tabPay)
        await firebase.set('tabPay', null)
        this.receipt.items = {}
      }
    }
  }

  renderPromo() {
    return Object.values(this.members)
      .filter(promoMember => Object.keys(this.promo).includes(promoMember.key) && this.promo[promoMember.key])
      .map(
        promoMember =>
          html`
            <custom-button
              action=${promoMember.key}
              .label=${promoMember.name + ' ' + promoMember.lastname}
              >${promoMember.name + ' ' + promoMember.lastname}</custom-button
            >
          `
      )
  }
  renderExpired() {
    return Object.values(this.expiredMembersList).map(
      expiredMember =>
        html`
          <custom-button
            action=${expiredMember.key}
            .label=${expiredMember.name + ' ' + expiredMember.lastname}
            >${expiredMember.name + ' ' + expiredMember.lastname}</custom-button
          >
        `
    )
  }

  render() {
    return html`
      <custom-dialog class="dialogCash">
        <span slot="title">Cash Ontvangst</span>
        <flex-wrap-between slot="actions">
          <custom-button
            label="&euro;300"
            action="300"
            has-label=""
            >&euro;300</custom-button
          >
          <custom-button
            label="&euro;200"
            action="200"
            has-label=""
            >&euro;200</custom-button
          >
          <custom-button
            label="&euro;100"
            action="100"
            has-label=""
            >&euro;100</custom-button
          >
          <custom-button
            label="&euro;50"
            action="50"
            has-label=""
            >&euro;50</custom-button
          >
          <custom-button
            label="&euro;20"
            action="20"
            has-label=""
            >&euro;20</custom-button
          >
          <custom-button
            label="&euro;10"
            action="10"
            has-label=""
            >&euro;10</custom-button
          >
          <custom-button
            label="&euro;5"
            action="5"
            has-label=""
            >&euro;5</custom-button
          >
          <custom-button
            label="Gepast"
            action="exact"
            has-label=""
            >Gepast</custom-button
          >
        </flex-wrap-between>
      </custom-dialog>

      <custom-dialog class="dialogPayconiq">
        <span slot="title">Payconiq Ontvangst</span>
        ${this.qrcode
          ? html`<flex-row
              slot="actions"
              direction="row">
              <img src=${this.qrcode} />
            </flex-row>`
          : html` <loading-view></loading-view>`}
      </custom-dialog>

      <custom-dialog class="dialogPromo">
        <span slot="title">Promo Ontvangst</span>
        <flex-wrap-between slot="actions"> ${this.promo ? this.renderPromo() : ''} </flex-wrap-between>
      </custom-dialog>
      <custom-dialog class="dialogExpired">
        <span slot="title">Vervallen lidmaadschap</span>
        <flex-wrap-between slot="actions"> ${this.expiredMembersList ? this.renderExpired() : ''} </flex-wrap-between>
      </custom-dialog>
      <custom-dialog
        class="dialogPay"
        has-actions=""
        has-header="">
        <span slot="title">Betaalmethode</span>
        <flex-wrap-between
          slot="actions"
          direction="row">
          <custom-button
            action="cash"
            label="cash"
            >Cash</custom-button
          >
          <custom-button
            action="payconiq"
            label="payconiq"
            >Payconiq</custom-button
          >
        </flex-wrap-between>
      </custom-dialog>

      <sales-receipt @selection=${event => this.onReceiptSelection(event)}></sales-receipt>
      <flex-it></flex-it>
      <sales-input @input-click=${event => this.inputTap(event)}></sales-input>
    `
  }
}
