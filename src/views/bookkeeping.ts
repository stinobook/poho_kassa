import { html, LiteElement, property, customElement } from '@vandeurenglenn/lite'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/column.js'
import '@material/web/button/filled-button.js'
import '@vandeurenglenn/lite-elements/tabs.js'
import '@vandeurenglenn/lite-elements/selector.js'
import '@material/web/button/filled-button.js'
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
  @property({ type: Array, consumer: true }) accessor members: { Type: Member[] }
  @property() accessor books: { [key: string]: Sales }
  @property({ type: Number }) accessor cashVault: number
  @property({ type: Number }) accessor cashStart: number

  static styles = [style]

  connectedCallback() {
    this.shadowRoot.addEventListener('input', ({ detail }: CustomEvent) => {
      this.loadBooks()
    })
    this.shadowRoot.addEventListener('click', this.#clickHandler)
    this.loadBooks()
  }

  async select(selected) {
    let read = this.shadowRoot.querySelector('.books') as HTMLElement
    let write = this.shadowRoot.querySelector('.cash') as HTMLElement
    if (selected.detail === 'read') {
      read.classList.remove('toggle')
      write.classList.add('toggle')
      this.loadBooks()
    } else {
      read.classList.add('toggle')
      write.classList.remove('toggle')
      this.books = null
      this.latestSales()
    }
  }

  #clickHandler = event => {
    const action = event.target.getAttribute('action')
    if (action === 'book') this.book()
  }

  book() {
    let cashTransfer = this.shadowRoot.querySelector('[name="amount"]') as HTMLInputElement
    this.cashVault -= Number(cashTransfer.value)
    let transferDescription = this.shadowRoot.querySelector('[name="reason"]') as HTMLInputElement
    let name =
      Object.values(this.members)?.filter(member => member.key === firebase.userDetails.member)[0]?.name +
      ' ' +
      Object.values(this.members)?.filter(member => member.key === firebase.userDetails.member)[0]?.lastname
    let sales = {
      date: new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleTimeString('nl-BE').slice(0, 5),
      cashStartCheckout: this.cashStart,
      cashVaultCheckout: this.cashVault,
      transferDescription: transferDescription.value,
      transferAmount: cashTransfer.value,
      user: name
    }
    firebase.push('sales', sales)
    cashTransfer.value = ''
    transferDescription.value = ''
  }

  latestSales() {
    firebase.limitToLast('sales', 1, snapshot => {
      let lastCheckout = snapshot.val() as Sales
      this.cashVault = Object.values(lastCheckout)[0].cashVaultCheckout
      this.cashStart = Object.values(lastCheckout)[0].cashStartCheckout
      if (!this.cashVault) this.cashVault = 0
    })
  }

  async loadBooks() {
    let fromDate = new Date((this.shadowRoot.querySelector('#fromDate') as HTMLInputElement).value)
    let toDate = new Date((this.shadowRoot.querySelector('#toDate') as HTMLInputElement).value)
    const data = await firebase.get('sales')

    if (data) {
      let filteredData = Object.fromEntries(
        Object.entries(data).filter(
          ([key, value]) =>
            new Date((value as Sales).date.slice(0, 10)).toISOString() >= fromDate.toISOString() &&
            new Date((value as Sales).date.slice(0, 10)).toISOString() <= toDate.toISOString()
        )
      )
      this.books = filteredData as { [key: string]: Sales }
    }
  }

  renderBooks() {
    return Object.entries(this.books).map(([key, value]) =>
      (this.books as { [key: string]: Sales })
        ? html`
            <div id="card-main">
              <span class="date">${value.date}</span>
              ${value.cashDifferenceCheckout
                ? html`
                    <div id="card-sub">
                      <span>Kassa</span>
                      <div id="card-sub-sub">
                        <span>Verschil: &euro;${value.cashDifferenceCheckout}</span>
                        <span>Naar kluis: &euro;${value.cashTransferCheckout}</span>
                      </div>
                    </div>
                  `
                : ''}
              ${value.cashVaultCheckout
                ? html`
                    <div id="card-sub">
                      <span>Kluis & Bank</span>
                      <div id="card-sub-sub">
                        <span>In kluis: &euro;${value.cashVaultCheckout}</span>
                        <span>Naar bank: &euro;${value.cashBank}</span>
                      </div>
                    </div>
                  `
                : ''}
              ${value.cashKantine
                ? html`
                    <div id="card-sub">
                      <span>Kantine</span>
                      <div id="card-sub-sub">
                        <span>Cash: &euro;${value.cashKantine}</span>
                        <span>Payconiq: &euro;${value.payconiqKantine}</span>
                      </div>
                    </div>
                  `
                : ''}
              ${value.cashWinkel
                ? html`
                    <div id="card-sub">
                      <span>Winkel</span>
                      <div id="card-sub-sub">
                        <span>Cash: &euro;${value.cashWinkel}</span>
                        <span>Payconiq: &euro;${value.payconiqWinkel}</span>
                      </div>
                    </div>
                  `
                : ''}
              ${value.cashLidgeld
                ? html`
                    <div id="card-sub">
                      <span>Lidgeld</span>
                      <div id="card-sub-sub">
                        <span>Cash: &euro;${value.cashLidgeld}</span>
                        <span>Payconiq: &euro;${value.payconiqLidgeld}</span>
                      </div>
                    </div>
                  `
                : ''}
              ${value.transferDescription
                ? html`
                    <div
                      id="card-sub"
                      class="wide">
                      <span>Cashbetaling</span>
                      <div id="card-sub-details">
                        <span>Bedrag: &euro;${value.transferAmount}</span>
                        <span>Reden: ${value.transferDescription}</span>
                        <span>Door: ${value.user}</span>
                      </div>
                    </div>
                  `
                : ''}
              <div id="card-sub-wide">
                <span>Payconiq betalingen</span>
                <div id="card-sub-details">
                  ${value.transactions?.map(transaction => {
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
                  ${value.transactions?.map(transaction => {
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
                  ${value.transactions?.map(transaction => {
                    if (transaction.paymentMethod === 'promo') {
                      let name = Object.values(this.members)
                        .filter(member => member.key === transaction.member)
                        .map(member => member.name + ' ' + member.lastname)
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
        <custom-tabs
          attr-for-selected="page"
          @selected=${this.select.bind(this)}>
          <custom-tab page="read">Uitlezen</custom-tab>
          <custom-tab page="write">Cashhandeling</custom-tab>
        </custom-tabs>
        <flex-container class="books">
          <flex-row class="card-input">
            <flex-row
              width="auto"
              center>
              <label for="fromDate">van</label>
              <input
                type="date"
                id="fromDate"
                value=${formatDate()} />
            </flex-row>
            <flex-it></flex-it>
            <flex-row
              width="auto"
              center>
              <label for="toDate">tot</label>
              <input
                type="date"
                id="toDate"
                value=${formatDate()} />
            </flex-row>
          </flex-row>
          ${this.books ? this.renderBooks() : ''}
        </flex-container>
        <flex-container class="cash toggle">
          <flex-row id="card-sub">
            <label
              >Beschikbaar<input
                class="readonly"
                class="cashInputfield"
                type="text"
                value=${this.cashVault}
                readonly
            /></label>
            <label
              >Bedrag<input
                class="cashInputfield"
                type="text"
                name="amount"
            /></label>
            <label
              >Reden<input
                class="cashInputfield"
                type="text"
                name="reason"
            /></label>
            <md-filled-button action="book">Afboeken</md-filled-button>
          </flex-row>
        </flex-container>
      </flex-container>
    `
  }
}
