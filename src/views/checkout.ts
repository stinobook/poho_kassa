import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lite-elements/typography.js'
import '@vandeurenglenn/flex-elements/column.js'
import '@material/web/button/filled-button.js'
import type { Cashtotal, Transaction, Sales, Member } from '../types.js'
import { ref, push, getDatabase, set,onValue, query, limitToLast } from 'firebase/database'
import Router from '../routing.js'

@customElement('checkout-view')
export class CheckoutView extends LiteElement {
  @property({ type: Number }) accessor cashExpected: number = 0
  @property({ type: Number }) accessor cashStart: number
  @property({ type: Number }) accessor cashStartNew: number = 0
  @property({ type: Number }) accessor cashVault: number
  @property({ type: Number }) accessor cashVaultNew: number = 0
  @property({ type: Array, consumer: true, renders: false }) accessor transactions: Transaction[]
  @property({ type: Array }) accessor cashTotals: Cashtotal[] = []
  @property({ type: Number }) accessor cashTotal: number = 0
  @property({ type: Number }) accessor cashDifference: number = 0
  @property({ type: Number }) accessor cashTransfer: number = 0
  @property({ type: Number }) accessor cashKantine: number = 0
  @property({ type: Number }) accessor cashWinkel: number = 0
  @property({ type: Number }) accessor cashLidgeld: number = 0
  @property({ type: Number }) accessor payconiqKantine: number = 0
  @property({ type: Number }) accessor payconiqWinkel: number = 0
  @property({ type: Number }) accessor payconiqLidgeld: number = 0
  @property({ type: Number }) accessor cashBank: number = 0
  @property() accessor transactionsByCategory: { [category: string]: Transaction[] }
  @property({ type: Array, consumer: true }) accessor members: { Type: Member }

  static styles = [
    css`
      :host {
        display: flex;
        width: 100%;
        height: 100%;
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
        max-width: none;
        width: -webkit-fill-available;
        position: relative;
        overflow: hidden;
        overflow-y: auto;
        flex-wrap: wrap;
        align-content:flex-start;
      }
      .cashtelling, .transactions {
          background-color: var(--md-sys-color-surface-container-high);
          color: var(--md-sys-color-on-surface-container-high);
          border-radius: var(--md-sys-shape-corner-extra-large);
          gap: 12px;
          box-sizing: border-box;
          padding: 12px;
          margin-top: 12px;
      }
      .currencies {
        max-width: 250px;
      }
      .cash {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        flex: 1;
      }
      .cashsub {
        background-color: var(--md-sys-color-surface-container-highest);
        border-radius: var(--md-sys-shape-corner-extra-large);
        color: var(--md-sys-color-on-primary-container);
        padding: 12px 24px;
        margin: 12px;
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .cashsub label {
        text-align: end;
        font-size:1.1em;
        text-wrap: nowrap;
        float: left;
      }
      .cashactions {
        min-width: calc(100% - 96px);
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        gap: 12px;
      }
      .cashactions * {
        flex: 1;
      }
      .cashactions label {
        border-radius: var(--md-sys-shape-corner-extra-large);
        background-color: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        padding: 10px 24px;
        font-size: 1em;
        display: none;
        float: unset;
      }
      .cashactions input[type=checkbox]:checked + label {
        background-color: lightgreen;
      }
      .cashactions input {
          display: none;
      }
      details {
        background-color: var(--md-sys-color-surface-container-highest);
        border-radius: var(--md-sys-shape-corner-extra-large);
        color: var(--md-sys-color-on-primary-container);
        padding: 12px;
      }
    
      details[open] summary ~ * {
        animation: open 0.3s ease-in-out;
      }
    
      @keyframes open {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      details summary::-webkit-details-marker {
        display: none;
      }
    
      details summary {
        position: relative;
        cursor: pointer;
        list-style: none;
      }
    
      details summary:after {
        content: '+';
        height: 0px;
        position: absolute;
        font-size: 1.75rem;
        line-height: 0;
        top: 8px;
        right: 0;
        font-weight: 200;
        transform-origin: center;
        transition: 200ms linear;
      }
      details[open] summary:after {
        transform: rotate(45deg);
        font-size: 2rem;
      }
      details summary {
        outline: 0;
      }
      .currencies input {
        padding: 10px 0 10px 15px;
        font-size: 1rem;
        color: var(--md-sys-color-on-primary);
        background: var(--md-sys-color-secondary);
        border: 0;
        border-radius: 3px;
        outline: 0;
        margin-left: 24px;
        margin-right: 4px;
        width: 50%;
      }

      .currencies label {
        width: 250px;
        text-align: end;
        float: left;
        padding: 4px 0;
        font-size: 1rem;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }
      .transactions md-list {
        width: 100%;
        background-color: transparent;
      }
      custom-typography {
        width: 100%;
        display: block;
        text-align: left;
      }
    `
  ]

  inputCash(inputValue, inputAmount) {
    inputAmount = inputAmount.value * 100
    inputValue = inputValue.detail
    this.cashTotals[inputValue] = inputAmount
    this.cashTotal = 0
    let i = Object.keys(this.cashTotals)
    i.forEach((key) => {
      let nKey = Number(key)
      this.cashTotal += nKey * this.cashTotals[key]
    })
    this.cashDifference = this.cashTotal - this.cashExpected * 100
    this.cashTransfer = Math.round((this.cashTotal - 10000) / 500) * 500
    this.cashStartNew = (this.cashTotal - this.cashTransfer) / 100
    this.cashVaultNew = this.cashVault + this.cashTransfer / 100
    this.cashTotal = this.cashTotal/100
    this.cashDifference = this.cashDifference/100
    this.cashTransfer = this.cashTransfer/100
  }

  

  async connectedCallback(): Promise<void> {
    this.shadowRoot.addEventListener('input', ({ target }: CustomEvent) => {
      // @ts-ignore
      if (target.id !== "banktransfer") {
      let inputValue = new CustomEvent('inputCash', { detail: target.getAttribute('input-cash') })
      this.inputCash(inputValue, target)
      }
    })
    this.shadowRoot.addEventListener('click', this.#clickHandler)
    const db = getDatabase()
    const dbQ = query(ref(db,'sales'), limitToLast(1))
    onValue(dbQ, (snapshot) => {
      let lastCheckout = snapshot.val() as Sales
      this.cashStart = Object.values(lastCheckout)[0].cashStartCheckout
      this.cashVault = Object.values(lastCheckout)[0].cashVaultCheckout
      if (!this.cashVault) this.cashVault = 0
      }, { onlyOnce: false })
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#clickHandler)
  }

  async onChange(propertyKey: any, value: any) {
    console.log({ propertyKey, value })

    if (propertyKey === 'cashVaultNew') {
      let transferCheck = this.shadowRoot.querySelector('[for=banktransfer]') as HTMLElement
      if (this.cashVaultNew > 500) {
        transferCheck.style.setProperty('display', 'flex')
      } else {
        transferCheck.style.setProperty('display', 'none')
      }
    }

    if (propertyKey === 'transactions' || propertyKey === 'cashStart') {
      if (
        this.transactions !== undefined &&
        this.transactions.length > 0 &&
        this.cashExpected !== undefined &&
        this.cashStart !== undefined
      ) {
        const transactionsByCategory = {}
        this.cashExpected = this.cashStart
        for (const transaction of this.transactions) {
          if (transaction.paymentMethod === 'cash') {
            this.cashExpected += transaction.paymentAmount
          }
          for (const [key, transactionItem] of Object.entries(transaction.transactionItems)) {
            if (!transactionsByCategory[transactionItem.category]) {
              transactionsByCategory[transactionItem.category] = {
                paymentAmount: { cash: 0, payconiq: 0 },
                transactionItems: [{ paymentMethod: transaction.paymentMethod, ...transactionItem }]
              }
            } else {
              transactionsByCategory[transactionItem.category].transactionItems.push({
                paymentMethod: transaction.paymentMethod,
                ...transactionItem
              })
            }
            transactionsByCategory[transactionItem.category].paymentAmount[transaction.paymentMethod] +=
              transactionItem.amount * transactionItem.price
          }
        }

        this.transactionsByCategory = transactionsByCategory
      } else { 
        this.requestRender() 
      }
    }
  }

  #clickHandler = (event) => {
    const key = event.target.getAttribute('key')
    const action = event.target.getAttribute('action')
    if (!action) return
    if (action === 'checkout') this.checkoutTap()
    if (action === 'delete') this.removeTransaction(key)
  }

  async removeTransaction(key) {
    if (confirm('Transactie verwijderen?') === true) {
      await firebase.remove(`transactions/${key}`)
    }
  }

  async checkoutTap() {
    if (this.transactions.length === 0) {
      alert('Niets om af te boeken')
    } else {
      if (this.cashVaultNew > 500 && !(this.shadowRoot.querySelector('#banktransfer') as HTMLInputElement).checked) {
        if (!confirm('Opgelet, bedrag in kluis te hoog, overdragen!\n Duw OK om toch af te sluiten ZONDER overdracht.')) return
      }
      if (confirm('Geen verschil?') === true) {
        const salesDB = ref(getDatabase(), 'sales')
        const transactionsDB = ref(getDatabase(), 'transactions')
        this.cashKantine = 0
        this.cashWinkel = 0
        this.cashLidgeld = 0
        this.payconiqKantine = 0
        this.payconiqWinkel = 0
        this.payconiqLidgeld = 0
        Object.entries(this.transactionsByCategory).map(([key, value]) => {
          if (key === 'Winkel') {
            this.cashWinkel += this.transactionsByCategory?.[key]?.paymentAmount.cash
            this.payconiqWinkel += this.transactionsByCategory?.[key]?.paymentAmount.payconiq
          } else if (key === 'Lidgeld') {
            this.cashLidgeld += this.transactionsByCategory?.[key]?.paymentAmount.cash
            this.payconiqLidgeld += this.transactionsByCategory?.[key]?.paymentAmount.payconiq
          } else {
            this.cashKantine += this.transactionsByCategory?.[key]?.paymentAmount.cash
            this.payconiqKantine += this.transactionsByCategory?.[key]?.paymentAmount.payconiq
          }
        })
        if ((this.shadowRoot.querySelector('#banktransfer') as HTMLInputElement).checked) {
          this.cashBank = this.cashVaultNew
          this.cashVaultNew = 0
        }

        let sales: Sales = {
          date: new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleTimeString('nl-BE').slice(0, 5),
          cashDifferenceCheckout: this.cashDifference,
          cashStartCheckout: this.cashStartNew,
          cashTransferCheckout: this.cashTransfer,
          cashKantine: this.cashKantine,
          cashWinkel: this.cashWinkel,
          cashLidgeld: this.cashLidgeld,
          payconiqKantine: this.payconiqKantine,
          payconiqWinkel: this.payconiqWinkel,
          payconiqLidgeld: this.payconiqLidgeld,
          cashVaultCheckout: this.cashVaultNew,
          cashBank: this.cashBank,
          transactions: this.transactions
        }
        await push(salesDB, sales)
        await set(transactionsDB, null)
        await firebase.set('promo', null)
        this.transactionsByCategory = {}
        this.cashExpected = this.cashStartNew
        this.shadowRoot.querySelectorAll('input').forEach((input) => (input.value = ''))
        location.hash = Router.bang('bookkeeping')
      }
    }
  }

  render() {
    if (this.transactions.length === 0) {
      return html`<flex-container>
                    <custom-typography><h1>Niets om af te boeken</h1></custom-typography>
                  </flex-container>`
    } else {
      return html`
        <flex-container direction="row">
          <flex-container direction="row" class="cashtelling">
            <custom-typography>Cash</custom-typography>
            <div class="currencies">
              <span><label>&euro;100<input class="cashInputfield" type="text" input-cash="100" /></label></span>
              <span><label>&euro;50<input class="cashInputfield" type="text" input-cash="50" /></label></span>
              <span><label>&euro;20<input class="cashInputfield" type="text" input-cash="20" /></label></span>
              <span><label>&euro;10<input class="cashInputfield" type="text" input-cash="10" /></label></span>
              <span><label>&euro;5<input class="cashInputfield" type="text" input-cash="5" /></label></span>
              <span><label>&euro;2<input class="cashInputfield" type="text" input-cash="2" /></label></span>
              <span><label>&euro;1<input class="cashInputfield" type="text" input-cash="1" /></label></span>
              <span><label>&euro;0.50<input class="cashInputfield" type="text" input-cash="0.50" /></label></span>
              <span><label>&euro;0.20<input class="cashInputfield" type="text" input-cash="0.20" /></label></span>
              <span><label>&euro;0.10<input class="cashInputfield" type="text" input-cash="0.10" /></label></span>
              <span><label>&euro;0.05<input class="cashInputfield" type="text" input-cash="0.05" /></label></span>
            </div>
            <div class="cash">
              <div class="cashsub">
                <custom-typography>Kassa</custom-typography>
                <label><span>Totaal:</span>&euro;${this.cashTotal}</label>
                <label><span>Verwacht:</span> &euro;${this.cashExpected}</label>
                <label><span>Verschil:</span> &euro;${this.cashDifference}</label>
              </div>
              <div class="cashsub">
              <custom-typography>Kluis</custom-typography>
                <label><span>Kasoverdracht naar kluis:</span> &euro;${this.cashTransfer}</label>
                <label><span>Totaal in kluis:</span> &euro;${this.cashVaultNew}</label>
                <label><span>Nieuw startgeld kassa:</span> &euro;${this.cashStartNew}</label>
              </div>
              <div class="cashsub cashactions">
                <input id="banktransfer" class="banktransfer" type="checkbox"/>
                <label for="banktransfer">Bankoverdracht uitvoeren?</label>
                <md-filled-button action="checkout"> Bevestig Afsluit </md-filled-button>
              </div>
            </div>
          </flex-container>
          <flex-container class="transactions" direction="column">
            <custom-typography>Transacties</custom-typography>
            ${this.transactions
              ? this.transactions.map(
                  (transaction) => html`
                    <md-list>
                      <details>
                        <summary>
                          <span
                            >${transaction.paymentMethod[0].toUpperCase() + transaction.paymentMethod.slice(1)}
                            transactie van:</span
                          >
                          <span
                            >${transaction.paymentAmount.toLocaleString(navigator.language, {
                              style: 'currency',
                              currency: 'EUR'
                            })}</span
                          >
                        </summary>
                        ${Object.entries(transaction.transactionItems).map(
                          ([key, transactionItem]) =>
                            html`
                              <md-list-item>
                                ${transaction.paymentMethod === 'promo'
                                  ? html`
                                      <span slot="headline"
                                        >${Object.values(this.members)
                                          .filter((member) => member.key === transaction.member)
                                          .map((member) => member.name + ' ' + member.lastname)}</span
                                      >
                                    `
                                  : ''}
                                <span slot="headline">${transactionItem.description}</span>
                                <span slot="start">${transactionItem.amount} x ${transactionItem.name}</span>
                                <span slot="end"
                                  >Eenheid: &euro;${transactionItem.price} / Totaal:
                                  &euro;${Number(transactionItem.price) * Number(transactionItem.amount)}</span
                                >
                              </md-list-item>
                            `
                        )}
                        ${transaction.paymentMethod === 'cash'
                          ? html`<md-filled-button action="delete" key=${transaction.key}>Verwijder</md-filled-button>`
                          : ''}
                      </details>
                    </md-list>
                  `
                )
              : ''}
          </flex-container>
        </flex-container>
      `
    }
  }
}
