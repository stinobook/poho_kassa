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
        pointer-events: none;
        display: flex;
        flex-direction: row;
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
        min-width: 100%;
        height: -webkit-fill-available;
        width: -webkit-fill-available;
        position: relative;
        flex-direction: row;
        overflow: hidden;
        overflow-y: auto;
      }
      .cashtelling {
        max-width: 300px;
      }
      .variasales {
        width: -webkit-fill-available;
      }
      .cashtelling md-list {
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
      }
      .cashtelling md-list-item {
        width: 50%;
      }
      .cashtelling md-filled-text-field {
        width: 50%;
      }
      .total {
        padding: 12px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        height: 24px;
        width: 100%;
      }
      md-list {
        width: 100%;
      }
      md-list-item {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
      for (const transaction of value) {
        console.log(transaction)
        for (const [key, transactionItem] of Object.entries(transaction.transactionItems))
          if (!transactionsByCategory[transactionItem.category]) {
            transactionsByCategory[transactionItem.category] = {
              paymentAmount: transactionItem.amount * transactionItem.price,
              transactionItems: [{ paymentMethod: transaction.paymentMethod, ...transactionItem }]
            }
          } else {
            transactionsByCategory[transactionItem.category].paymentAmount +=
              transactionItem.amount * transactionItem.price
            transactionsByCategory[transactionItem.category].transactionItems.push({
              paymentMethod: transaction.paymentMethod,
              ...transactionItem
            })
          }
      }

      this.transactionsByCategory = { ...transactionsByCategory }
    }
  }
  render() {
    return html`
      <flex-container>
        <flex-column class="cashtelling">
          <md-list>
            <md-list-item>&euro;100</md-list-item><md-filled-text-field input-cash="100"></md-filled-text-field>
            <md-list-item>&euro;50</md-list-item><md-filled-text-field input-cash="50"></md-filled-text-field>
            <md-list-item>&euro;20</md-list-item><md-filled-text-field input-cash="20"></md-filled-text-field>
            <md-list-item>&euro;10</md-list-item><md-filled-text-field input-cash="10"></md-filled-text-field>
            <md-list-item>&euro;5</md-list-item><md-filled-text-field input-cash="5"></md-filled-text-field>
            <md-list-item>&euro;2</md-list-item><md-filled-text-field input-cash="2"></md-filled-text-field>
            <md-list-item>&euro;1</md-list-item><md-filled-text-field input-cash="1"></md-filled-text-field>
            <md-list-item>&euro;0.50</md-list-item><md-filled-text-field input-cash="0.50"></md-filled-text-field>
            <md-list-item>&euro;0.20</md-list-item><md-filled-text-field input-cash="0.20"></md-filled-text-field>
            <md-list-item>&euro;0.10</md-list-item><md-filled-text-field input-cash="0.10"></md-filled-text-field>
            <md-list-item>&euro;0.05</md-list-item><md-filled-text-field input-cash="0.05"></md-filled-text-field>
          </md-list>
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
        <flex-column class="variasales">
          <flex-column>
            <md-list>
              <md-list-item>Winkel</md-list-item>
              <md-divider></md-divider>
              ${this.transactionsByCategory
                ? map(this.transactionsByCategory['Winkel'], (transaction: Transaction) =>
                    map(
                      transaction.transactionItems,
                      (transactionItem) =>
                        html`
                          <md-list-item>
                            <span slot="start">${transaction.transactionItems.length}</span>
                            <span slot="end">${transaction.paymentAmount}</span>
                            <span slot="trailing-supporting-text">${transaction.paymentMethod}</span>
                          </md-list-item>
                        `
                    )
                  ) &&
                  map(
                    this.transactionsByCategory['Lidgeld'],
                    (transaction: Transaction) =>
                      html`
                        <md-list-item>
                          <span slot="start">${transaction.transactionItems.length}</span>
                          <span slot="end">${transaction.paymentAmount}</span>
                          <span slot="trailing-supporting-text">${transaction.paymentMethod}</span>
                        </md-list-item>
                      `
                  )
                : ''}
            </md-list>
            <flex-row center class="total">
              <strong>Totaal:</strong>
              <flex-it></flex-it>
              <span style="margin-right: 14px">Cash: 0&euro;</span>
              <span>Payconiq: 0&euro;</span>
            </flex-row>
          </flex-column>
          <flex-column>
            <md-list>
              <md-list-item>Lidgeld</md-list-item>
              <md-divider></md-divider>
            </md-list>
            <flex-row center class="total">
              <strong>Totaal:</strong>
              <flex-it></flex-it>
              <span style="margin-right: 14px">Cash: 0&euro;</span>
              <span>Payconiq: 0&euro;</span>
            </flex-row>
          </flex-column>
        </flex-column>
      </flex-container>
    `
  }
}
