import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/column.js'
import { get, ref, getDatabase, remove, child, onChildAdded, onChildRemoved, onValue } from 'firebase/database'
import type { Cashtotal, Transaction } from '../types.js'

@customElement('checkout-view')
export class CheckoutView extends LiteElement {
  @property({ type: Object })
  accessor cashTotals: Cashtotal[] = [];
  @property({ type: Object })
  accessor allTransactions: { [key: string]: Transaction } = {}
  @property({ type: Number })
  accessor cashTotal: number = 0
  @property({ type: Number })
  accessor cashExpected: number = 0
  @property({ type: Number })
  accessor cashDifference: number = 0
  @property({ type: Number })
  accessor cashTransfer: number = 0
  @property({ type: Number })
  accessor cashStart: number = 100

  

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
        box-sizing: border-box;
        padding: 12px 24px;
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
    }
    )
    this.cashDifference = this.cashTotal - this.cashExpected
    this.cashTransfer = this.cashTotal - this.cashStart
  }

  async connectedCallback(): Promise<void> {
    this.shadowRoot.addEventListener('input', ({ target }: CustomEvent) => {
      // @ts-ignore
      let inputValue = new CustomEvent('inputCash', { detail: target.getAttribute('input-cash') })
      this.inputCash(inputValue, target)
    })
    const _ref = ref(getDatabase(), 'transactions')
    onValue(_ref, async (snap) => {
      this.cashExpected = 100
      this.allTransactions = await snap.val()
      let keylessTransactions = Object.values(this.allTransactions)
      keylessTransactions.forEach((key) => {
        if (key.paymentMethod === 'cash'){
          this.cashExpected += key.paymentAmount
        }
      })
      this.requestRender()
    })
  }




  render() {
    return html`
      <flex-container>
        <flex-column class="cashtelling">
          <md-list>
            <md-list-item>&euro;100</md-list-item
            ><md-filled-text-field input-cash="100"></md-filled-text-field>
            <md-list-item>&euro;50</md-list-item
            ><md-filled-text-field input-cash="50"></md-filled-text-field>
            <md-list-item>&euro;20</md-list-item
            ><md-filled-text-field input-cash="20"></md-filled-text-field>
            <md-list-item>&euro;10</md-list-item
            ><md-filled-text-field input-cash="10"></md-filled-text-field> <md-list-item>&euro;5</md-list-item
            ><md-filled-text-field input-cash="5"></md-filled-text-field> <md-list-item>&euro;2</md-list-item
            ><md-filled-text-field input-cash="2"></md-filled-text-field> <md-list-item>&euro;1</md-list-item
            ><md-filled-text-field input-cash="1"></md-filled-text-field>
            <md-list-item>&euro;0.50</md-list-item
            ><md-filled-text-field input-cash="0.50"></md-filled-text-field>
            <md-list-item>&euro;0.20</md-list-item
            ><md-filled-text-field input-cash="0.20"></md-filled-text-field>
            <md-list-item>&euro;0.10</md-list-item
            ><md-filled-text-field input-cash="0.10"></md-filled-text-field>
            <md-list-item>&euro;0.05</md-list-item
            ><md-filled-text-field input-cash="0.05"></md-filled-text-field>
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
              <md-list-item>
                <span slot="start">Zwan</span>
                <span slot="end">3&euro;</span>
                <span slot="trailing-supporting-text">Payconiq</span>
              </md-list-item>
              <md-list-item>
                <span slot="start">Groot been</span>
                <span slot="end">3&euro;</span>
                <span slot="trailing-supporting-text">Payconiq</span>
              </md-list-item>
              <md-list-item>
                <span slot="start">Klein been</span>
                <span slot="end">3&euro;</span>
                <span slot="trailing-supporting-text">Cash</span>
              </md-list-item>
              <md-list-item>
                <span slot="start">Rodiworst</span>
                <span slot="end">3&euro;</span>
                <span slot="trailing-supporting-text">Cash</span>
              </md-list-item>
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
              <md-list-item>
                <span slot="headline">Lidgeld</span>
                <span slot="supporting-text">Mary Jane met Robin</span>
                <span slot="end">120&euro;</span>
                <span slot="trailing-supporting-text">Payconiq</span>
              </md-list-item>
              <md-list-item>
                <span slot="headline">Extra lid</span>
                <span slot="supporting-text">Peter Parker</span>
                <span slot="end">10&euro;</span>
                <span slot="trailing-supporting-text">Payconiq</span>
              </md-list-item>
              <md-list-item>
                <span slot="headline">Lidgeld</span>
                <span slot="supporting-text">Carmen Waterslaeghers met Nero</span>
                <span slot="end">120&euro;</span>
                <span slot="trailing-supporting-text">Cash</span>
              </md-list-item>
              <md-list-item>
                <span slot="headline">Extra lid</span>
                <span slot="supporting-text">Xavier Waterslaeghers</span>
                <span slot="end">10&euro;</span>
                <span slot="trailing-supporting-text">Cash</span>
              </md-list-item>
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
