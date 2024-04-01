import { html, LiteElement, property, customElement } from '@vandeurenglenn/lite'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/column.js'
import '@material/web/button/filled-button.js'
import { get, ref, getDatabase } from 'firebase/database'
import { Sales, Member } from '../types.js'
import style from './bookkeeping-css.js'

const formatDate = () => {
  const date = new Date().toLocaleDateString('fr-CA').split('-')
  if (date[1].length === 1) date[1] = `0${date[1]}`
  if (date[2].length === 1) date[2] = `0${date[2]}`
  return date.join('-')
}

@customElement('bookkeeping-view')
export class BookkeepingView extends LiteElement {
  @property({ type: Array, consumer: true }) accessor members: { Type: Member }
  @property() accessor books: { [key: string]: Sales[] }

  static styles = [style]

  connectedCallback() {
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
  }

  renderBooks() {
    return Object.entries(this.books).map(([key, value]) =>
      this.books
        ? html`
            <div id="card-main">
              <span class="date">${value.date}</span>
              <div id="card-sub">
                <span>Kassa</span>
                <div id="card-sub-sub">
                  <span>Verschil: &euro;${value.cashDifferenceCheckout}</span>
                  <span>Naar kluis: &euro;${value.cashTransferCheckout}</span>
                </div>
              </div>
              <div id="card-sub">
                <span>Kluis & Bank</span>
                <div id="card-sub-sub">
                  <span>In kluis: &euro;${value.cashVaultCheckout}</span>
                  <span>Naar bank: &euro;${value.cashBank}</span>
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
                                >Eenheid: &euro;${transactionItem.price} / Subtotaal:
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
              <div id="card-sub-wide">
                <details>
                  <summary>
                    <span>Details Promotransacties</span>
                  </summary>
                  ${value.transactions.map((transaction) => {
                    if (transaction.paymentMethod === 'promo') {
                      let name = Object.values(this.members)
                        .filter((member) => member.key === transaction.member)
                        .map((member) => member.name + ' ' + member.lastname)
                      let item = Object.entries(transaction.transactionItems).map(
                        ([key, transactionItem]) => transactionItem.name
                      )
                      let summary = html`
                        <md-list>
                          <md-list-item>
                            <span slot="start">${name}</span>
                            <span slot="end">${item}</span>
                          </md-list-item>
                        </md-list>
                      `
                      return [summary]
                    }
                  })}
                </details>
              </div>
            </div>
          `
        : ''
    )
  }

  render() {
    return html`
      <flex-container>
        <flex-row class="card-input">
          <flex-row width="auto" center>
            <label for="fromDate">van</label>
            <input type="date" id="fromDate" value=${formatDate()} />
          </flex-row>
          <flex-it></flex-it>
          <flex-row width="auto" center>
            <label for="toDate">tot</label>
            <input type="date" id="toDate" value=${formatDate()} />
          </flex-row>
        </flex-row>
        ${this.books ? this.renderBooks() : ''}
      </flex-container>
    `
  }
}
