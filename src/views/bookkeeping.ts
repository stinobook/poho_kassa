import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/column.js'
import '@material/web/button/filled-button.js'
import { get, ref, push, getDatabase, child, onChildAdded, onChildRemoved, set } from 'firebase/database'

@customElement('bookkeeping-view')
export class BookkeepingView extends LiteElement {
  @property() accessor books: { [key]: Sales[] } = {}
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
      #card-main {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        position: relative;
        background-color: var(--md-sys-color-surface-variant);
        border-radius: var(--md-sys-shape-corner-extra-large);
        color: var(--md-sys-color-on-surface-variant);
        gap: 12px;
        padding: 12px;
        margin: 12px;
      }
      #card-main .date {
        width: 100%;
        margin: 12px;
        font-size: 1.2em;
        font-weight: bold;
      }
      #card-sub {
        font-size: 1em;
        font-weight: normal;
        background-color: var(--md-sys-color-primary-container);
        border-radius: var(--md-sys-shape-corner-extra-large);
        color: var(--md-sys-color-on-primary-container);
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        flex-grow: 1;
        padding: 12px;
      }
      #card-sub-sub {
        font-size: 0.8em;
        font-weight: normal;
        display: inline-flex;
        flex-direction: column;
      }
      md-list {
        background: unset;
      }
    `
  ]

  async connectedCallback() {
    this.shadowRoot.addEventListener('click', ({ target }: CustomEvent) => {
      // @ts-ignore
      let event = new CustomEvent('checkoutTap', { detail: target.getAttribute('bookkeeping-tap')})
      this.loadBooks(event)
    })
  }

  async loadBooks({ detail }: CustomEvent) {
    if (detail === 'loadbooks') {
      let fromDate = (this.shadowRoot.querySelector('#fromDate') as HTMLInputElement).value
      let toDate = (this.shadowRoot.querySelector('#toDate') as HTMLInputElement).value 
      const salesDB = ref(getDatabase(), 'sales')
      await get(salesDB).then((snapshot) => {
        if (snapshot.exists()) {
          this.books = snapshot.val()
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
      this.requestRender()
    }
  }

  renderBooks(books = this.books) {
    return Object.entries(this.books).map(([key, value]) => 
      books
      ? html`
            <div id="card-main">
              <span class="date">${value.date}</span>
              <div id="card-sub">
                <span>Cashhandeling</span>
                <div id="card-sub-sub">
                <span>Overdracht: &euro;${value.cashTransferCheckout}</span>
                <span>Verschil: &euro;${value.cashDifferenceCheckout}</span>
                </div>
              </div>
              <div id="card-sub">
                <span>Kantine</span>
                <div id="card-sub-sub">
                <span>Cash: &euro;${value.cashKantine}</span>
                <span>Payconiq: &euro;${value.payconiqKantine}</span>
                </div>
              </div>
              <div id="card-sub">
                <span>Winkel</span>
                <div id="card-sub-sub">
                <span>Cash: &euro;${value.cashWinkel}</span>
                <span>Payconiq: &euro;${value.payconiqWinkel}</span>
                </div>
              </div>
              <div id="card-sub">
                <span>Lidgeld</span>
                <div id="card-sub-sub">
                <span>Cash: &euro;${value.cashLidgeld}</span>
                <span>Payconiq: &euro;${value.payconiqLidgeld}</span>
                </div>
              </div>
              <div id="card-sub" style="width: 100%">
                <span>Payconiq betalingen</span>
                <div id="card-sub-sub">
                    ${value.transactions.map((transaction) => {
                      if (transaction.paymentMethod === 'payconiq') {
                          let items = Object.entries(transaction.transactionItems).map(([key, transactionItem]) =>
                              html`
                              <md-list-item>
                              <span slot="headline">${transactionItem.description}</span>
                              <span slot="start">${transactionItem.name}</span>
                              </md-list-item>
                              `
                            )
                            let summary = html`<details><summary>
                            <span>${transaction.paymentMethod}</span>
                            <span>${transaction.paymentAmount}</span>
                            <md-list></summary>
                            ${items}
                            </details>
                            `
                            return [summary]
                    }})}
                </div>
            </div>
            <div id="card-sub" style="width: 100%">
            <span>Lidgeld betalingen</span>
            <div id="card-sub-sub">
            Nog niet klaar!
            </div>
          </div>
        `
      : ''
    )
  }

  render() {
    return html`
      <flex-container direction="row">
      <span><label>Van: <input type="date" id="fromDate"></label></span>
      <span><label>Tot: <input type="date" id="toDate"></label></span>
      <md-filled-button @bookkeeping-click=${(event) => this.loadBooks(event)} bookkeeping-tap="loadbooks" >Load</md-filled-button>
      ${this.books ? this.renderBooks() : ''}
      </flex-container>
    `
  }
}
