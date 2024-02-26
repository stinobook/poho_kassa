import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/column.js'
import type { Cashtotal, Transaction } from '../types.js'

@customElement('checkout-view')
export class CheckoutView extends LiteElement {
  @property({ type: Array, consumer: true, renders: false }) accessor transactions: Transaction[]
  @property({ type: Array }) accessor cashTotals: Cashtotal[] = []
  @property({ type: Number }) accessor cashTotal: number = 0
  @property({ type: Number }) accessor cashExpected: number = 0
  @property({ type: Number }) accessor cashDifference: number = 0
  @property({ type: Number }) accessor cashTransfer: number = 0
  @property({ type: Number }) accessor cashStart: number = 100
  @property() accessor transactionsByCategory: { [category: string]: Transaction[] } = {}

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
        height: -webkit-fill-available;
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
      }
      .variasales {
        flex-direction: column;
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
        font-size: 1.25rem;
        font-weight: 300;
        list-style: none;
      }
      
      details summary:after {
        content: "+";
        color: var(--primary-background-color);
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
        width:50%
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
  }

  async onChange(propertyKey: any, value: any) {
    if (propertyKey === 'transactions') {
      const transactionsByCategory = {}
      this.cashExpected = 0
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

      this.transactionsByCategory = { ...transactionsByCategory }
    }
  }
  render() {
    return html`
      <flex-container direction="row">
        <flex-column class="cashtelling">
        <custom-elevation level="1"></custom-elevation>
        <span><label>&euro;100<input class="cashInputfield" type="text" input-cash="100"/></label></span>
        <span><label>&euro;50<input class="cashInputfield" type="text" input-cash="50"/></label></span>
        <span><label>&euro;20<input class="cashInputfield" type="text" input-cash="20"/></label></span>
        <span><label>&euro;10<input class="cashInputfield" type="text" input-cash="10"/></label></span>
        <span><label>&euro;5<input class="cashInputfield" type="text" input-cash="5"/></label></span>
        <span><label>&euro;2<input class="cashInputfield" type="text" input-cash="2"/></label></span>
        <span><label>&euro;1<input class="cashInputfield" type="text" input-cash="1"/></label></span>
        <span><label>&euro;0.50<input class="cashInputfield" type="text" input-cash="0.50"/></label></span>
        <span><label>&euro;0.20<input class="cashInputfield" type="text" input-cash="0.20"/></label></span>
        <span><label>&euro;0.10<input class="cashInputfield" type="text" input-cash="0.10"/></label></span>
        <span><label>&euro;0.05<input class="cashInputfield" type="text" input-cash="0.05"/></label></span>
        <custom-elevation level="2"></custom-elevation>
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
        </flex-column>
        <flex-container class="variasales" direction="column">
          ${this.transactionsByCategory
            ? Object.entries(this.transactionsByCategory).map(
                ([key, value]) => html`
                    <md-list>
                    <details>
                    <summary>${key}</summary>
                    ${map(
                      value.transactionItems,
                      (item) =>
                        html`
                          <md-list-item>
                          <span slot="start">${(item.description) ? item.name : item.name + ' x ' + item.amount}</span>
                          <span slot="supporting-text">${(item.description) ? item.description : ''}</span>
                            <span slot="end"
                              >${(item.amount * item.price).toLocaleString(navigator.language, {
                                style: 'currency',
                                currency: 'EUR'
                              })}</span
                            >
                            <span slot="trailing-supporting-text">${item.paymentMethod}</span>
                          </md-list-item>
                        `
                    )}
                  </details>
                  </md-list>
                  <flex-row center class="total">
                    <strong>Totaal:</strong>
                    <flex-it></flex-it>
                    <span style="margin-right: 14px"
                      >Cash:
                      ${this.transactionsByCategory?.[key]?.paymentAmount.cash.toLocaleString(navigator.language, {
                        style: 'currency',
                        currency: 'EUR'
                      })}</span
                    >
                    <span
                      >Payconiq:
                      ${this.transactionsByCategory?.[key]?.paymentAmount.payconiq.toLocaleString(navigator.language, {
                        style: 'currency',
                        currency: 'EUR'
                      })}</span
                    >
                  </flex-row>
                `
              )
            : ''}
        </flex-container>
      </flex-container>
    `
  }
}
