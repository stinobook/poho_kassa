import { html, css, LiteElement, property, customElement } from '@vandeurenglenn/lite'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/column.js'
import '@material/web/button/filled-button.js'
import { get, ref, getDatabase } from 'firebase/database'
import { Sales } from '../types.js'

const formatDate = () => {
  const date = new Date().toLocaleDateString('fr-CA').split('-')
  if (date[1].length === 1) date[1] = `0${date[1]}`
  if (date[2].length === 1) date[2] = `0${date[2]}`
  return date.join('-')
}

@customElement('bookkeeping-view')
export class BookkeepingView extends LiteElement {
  @property() accessor books: { [key: string]: Sales[] } = {}
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
        flex-direction: column;
        flex: 1;
        padding: 12px;
        gap: 12px;
      }
      #card-sub-wide {
        font-size: 1em;
        font-weight: normal;
        background-color: var(--md-sys-color-primary-container);
        border-radius: var(--md-sys-shape-corner-extra-large);
        color: var(--md-sys-color-on-primary-container);
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        width: 100%;
        padding: 12px;
        gap: 12px;
      }
      #card-sub-sub {
        font-size: 0.8em;
        font-weight: normal;
        position: relative;
      }
      #card-sub-sub span {
        float: left;
        clear: both;
      }
      #card-sub-details {
        font-weight: normal;
        display: inline-flex;
        flex-direction: column;
        gap: 12px;
      }
      md-list {
        background: unset;
        padding: 0;
      }
      details {
        background-color: var(--md-sys-color-secondary-container);
        border-radius: var(--md-sys-shape-corner-extra-large);
        color: var(--md-sys-color-on-secondary-container);
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
        height: 10px;
        position: absolute;
        font-size: 1.75rem;
        line-height: 0;
        top: 0;
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
      #card-input {
        display: flex;
        justify-content: center;
        flex: 1;
        width: 100%;
        position: relative;
        background-color: var(--md-sys-color-surface-variant);
        border-radius: var(--md-sys-shape-corner-extra-large);
        color: var(--md-sys-color-on-surface-variant);
        gap: 12px;
        padding: 12px;
        margin: 12px;
        flex-wrap: wrap;
      }
      #card-input input {
        padding: 10px 15px;
        font-size: 1rem;
        color: var(--md-sys-color-on-primary);
        background: var(--md-sys-color-secondary);
        border: 0;
        border-radius: 3px;
        outline: 0;
        margin-left: 24px;
        margin-right: 4px;
      }

      #card-input label {
        font-size: 1rem;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        display: inline-flex;
        align-items: center;
      }
    `
  ]

  async connectedCallback() {
    this.shadowRoot.addEventListener('input', ({ detail }: CustomEvent) => {
      this.loadBooks()
    })
    this.loadBooks()
  }

  async loadBooks() {
    let fromDate = new Date((this.shadowRoot.querySelector('#fromDate') as HTMLInputElement).value)
    let toDate = new Date((this.shadowRoot.querySelector('#toDate') as HTMLInputElement).value)
    const salesDB = ref(getDatabase(), 'sales')
    let dbData = await get(salesDB)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          console.log('No data available')
        }
      })
      .catch((error) => {
        console.error(error)
      })
    let filteredData = Object.fromEntries(
      Object.entries(dbData).filter(
        ([key, value]) =>
          new Date(value.date.slice(0, 10)).toISOString() >= fromDate.toISOString() &&
          new Date(value.date.slice(0, 10)).toISOString() <= toDate.toISOString()
      )
    )
    this.books = filteredData
    this.requestRender()
  }

  renderBooks() {
    return Object.entries(this.books).map(([key, value]) =>
      this.books
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
              <div id="card-sub-wide">
                <span>Payconiq betalingen</span>
                <div id="card-sub-details">
                  ${value.transactions.map((transaction) => {
                    if (transaction.paymentMethod === 'payconiq') {
                      let items = Object.entries(transaction.transactionItems).map(
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
                      )
                      let summary = html`<details>
                        <summary>
                          <span>Transactie van: &euro;</span>
                          <span>${transaction.paymentAmount}</span>
                        </summary>
                        <md-list> ${items} </md-list>
                      </details> `
                      return [summary]
                    }
                  })}
                </div>
              </div>
              <div id="card-sub-wide">
                <span>Lidgeld betalingen</span>
                <div id="card-sub-details">
                  ${value.transactions.map((transaction) => {
                    let paymentAmount = transaction.paymentAmount
                    let paymentMethod = transaction.paymentMethod
                    let transactionItemLidgeld = Object.entries(transaction.transactionItems)
                      .filter(([key, transactionItem]) => transactionItem.category === 'Lidgeld')
                      .map(
                        ([key, transactionItem]) =>
                          html`
                            <md-list-item>
                              <span slot="headline">${transactionItem.description}</span>
                              <span slot="start">${transactionItem.name}</span>
                              <span slot="end">&euro;${transactionItem.price}</span>
                            </md-list-item>
                          `
                      )
                    let summary = html`<details>
                      <summary>
                        <span>${paymentMethod[0].toUpperCase() + paymentMethod.slice(1)}betaling van: &euro;</span>
                        <span>${paymentAmount}</span>
                      </summary>
                      <md-list> ${transactionItemLidgeld} </md-list>
                    </details> `
                    if (transactionItemLidgeld.length !== 0) {
                      return [summary]
                    }
                  })}
                </div>
              </div>
            </div>
          `
        : ''
    )
  }

  render() {
    return html`
      <flex-container direction="row">
        <div id="card-input">
          <span
            ><label>Van: <input type="date" id="fromDate" value=${formatDate()} /></label
          ></span>
          <span
            ><label>Tot: <input type="date" id="toDate" value=${formatDate()} /></label
          ></span>
        </div>
        ${this.books ? this.renderBooks() : ''}
      </flex-container>
    `
  }
}
