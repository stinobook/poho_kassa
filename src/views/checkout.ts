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
import type { Cashtotal, Transaction, Sales } from '../types.js'
import { ref, push, getDatabase, set } from 'firebase/database'
import Router from '../routing.js'

@customElement('checkout-view')
export class CheckoutView extends LiteElement {
  @property({ type: Number }) accessor cashStart: number = 100
  @property({ type: Number }) accessor cashExpected: number = 0
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
  @property() accessor transactionsByCategory: { [category: string]: Transaction[] }

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
        flex-direction: row;
      }
      .cashtelling {
        max-width: 300px;
        min-width: 200px;
        position: relative;
      }
      .variasales {
        min-width: 400px;
        max-width: calc(100% - 310px);
      }
      .total {
        padding: 12px 12px;
        box-sizing: border-box;
        height: 24px;
        width: 100%;
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
        width: 100%;
        padding: 0.5rem 0;
        position: relative;
        cursor: pointer;
        list-style: none;
      }

      details summary:after {
        content: '+';
        position: absolute;
        font-size: 1.75rem;
        line-height: 0;
        margin-top: 0.75rem;
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
      .cashtelling span {
        width: 100%;
      }
      .cashtelling input {
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

      .cashtelling label {
        width: 100%;
        text-align: end;
        float: left;
        padding: 4px 0;
        font-size: 1rem;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }
      .variasales md-list {
        width: 100%;
      }
      .cashtelling md-filled-button {
        margin: 24px auto;
      }
      custom-typography {
        width: 100%;
        display: block;
        text-align: center;
      }
    `
  ]

  inputCash(inputValue, inputAmount) {
    inputAmount = inputAmount.value
    inputValue = inputValue.detail
    this.cashTotals[inputValue] = inputAmount
    this.cashTotal = 0
    let i = Object.keys(this.cashTotals)
    i.forEach((key) => {
      let nKey = Number(key)
      this.cashTotal += nKey * this.cashTotals[key]
    })
    this.cashDifference = this.cashTotal - this.cashExpected
    this.cashTransfer = this.cashTotal - this.cashStart
  }

  async connectedCallback(): Promise<void> {
    this.shadowRoot.addEventListener('input', ({ target }: CustomEvent) => {
      // @ts-ignore
      let inputValue = new CustomEvent('inputCash', { detail: target.getAttribute('input-cash') })
      this.inputCash(inputValue, target)
    })
    this.shadowRoot.addEventListener('click', this.#clickHandler)
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#clickHandler)
  }

  async onChange(propertyKey: any, value: any) {
    console.log({ propertyKey, value })

    if (propertyKey === 'transactions') {
      const transactionsByCategory = {}
      this.cashExpected = this.cashStart
      for (const transaction of value) {
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

        let sales: Sales = {
          date: new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleTimeString('nl-BE').slice(0, 5),
          cashDifferenceCheckout: this.cashDifference,
          cashStartCheckout: this.cashStart,
          cashTransferCheckout: this.cashTransfer,
          cashKantine: this.cashKantine,
          cashWinkel: this.cashWinkel,
          cashLidgeld: this.cashLidgeld,
          payconiqKantine: this.payconiqKantine,
          payconiqWinkel: this.payconiqWinkel,
          payconiqLidgeld: this.payconiqLidgeld,
          transactions: this.transactions
        }
        await push(salesDB, sales)
        await set(transactionsDB, null)
        this.transactionsByCategory = {}
        this.cashExpected = this.cashStart;
        this.shadowRoot.querySelectorAll('input').forEach(input => input.value = '')
        location.hash = Router.bang('bookkeeping')
      }
    }
  }

  render() {
    if (this.transactions.length === 0) {
      return html`<flex-container><custom-typography><h1>Niets om af te boeken</h1></custom-typography></flex-container>`
      } else {
      return html`
        <flex-container direction="row">
          <flex-column class="cashtelling">
            <custom-elevation level="1"></custom-elevation>
            <span
              ><label>&euro;100<input class="cashInputfield" type="text" input-cash="100" /></label
            ></span>
            <span
              ><label>&euro;50<input class="cashInputfield" type="text" input-cash="50" /></label
            ></span>
            <span
              ><label>&euro;20<input class="cashInputfield" type="text" input-cash="20" /></label
            ></span>
            <span
              ><label>&euro;10<input class="cashInputfield" type="text" input-cash="10" /></label
            ></span>
            <span
              ><label>&euro;5<input class="cashInputfield" type="text" input-cash="5" /></label
            ></span>
            <span
              ><label>&euro;2<input class="cashInputfield" type="text" input-cash="2" /></label
            ></span>
            <span
              ><label>&euro;1<input class="cashInputfield" type="text" input-cash="1" /></label
            ></span>
            <span
              ><label>&euro;0.50<input class="cashInputfield" type="text" input-cash="0.50" /></label
            ></span>
            <span
              ><label>&euro;0.20<input class="cashInputfield" type="text" input-cash="0.20" /></label
            ></span>
            <span
              ><label>&euro;0.10<input class="cashInputfield" type="text" input-cash="0.10" /></label
            ></span>
            <span
              ><label>&euro;0.05<input class="cashInputfield" type="text" input-cash="0.05" /></label
            ></span>
            <flex-row center class="total">
              <strong>Totaal:</strong>
              <flex-it></flex-it>
              &euro;${this.cashTotal}
            </flex-row>
            <flex-row center class="total">
              <strong>Verwacht:</strong>
              <flex-it></flex-it>
              &euro;${this.cashExpected}
            </flex-row>
            <flex-row center class="total">
              <strong>Verschil:</strong>
              <flex-it></flex-it>
              &euro;${this.cashDifference}
            </flex-row>
            <flex-row center class="total">
              <strong>Overdracht:</strong>
              <flex-it></flex-it>
              &euro;${this.cashTransfer}
            </flex-row>
            <flex-row center class="total">
              <strong>Startgeld:</strong>
              <flex-it></flex-it>
              &euro;${this.cashStart}
            </flex-row>
            <md-filled-button action="checkout"> Bevestig Afsluit </md-filled-button>
          </flex-column>
          <flex-container class="variasales" direction="column">
            ${this.transactions
              ? this.transactions.map(
                  (transaction) => html`
                    <md-list>
                      <details>
                        <summary>
                          <span
                            >${transaction.paymentMethod[0].toUpperCase() + transaction.paymentMethod.slice(1)} transactie
                            van:</span
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
