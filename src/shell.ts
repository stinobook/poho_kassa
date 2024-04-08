import { html, LiteElement, query, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/lite-elements/notifications.js'
import '@vandeurenglenn/lite-elements/drawer-layout.js'
import '@vandeurenglenn/lite-elements/icon-set.js'
import '@vandeurenglenn/lite-elements/theme.js'
import '@vandeurenglenn/lite-elements/selector.js'
import '@vandeurenglenn/lite-elements/pages.js'
import '@vandeurenglenn/lite-elements/divider.js'
import '@vandeurenglenn/lite-elements/theme.js'
import './components/search.js'
import icons from './icons.js'
import Router from './routing.js'
import type { CustomDrawerLayout, CustomPages, CustomSelector } from './component-types.js'
// import default page
import './views/loading.js'
import { Evenement } from './types.js'

@customElement('po-ho-shell')
export class PoHoShell extends LiteElement {
  router: Router

  #inMem

  @query('search-input')
  accessor _searchInput

  @query('custom-selector')
  accessor selector: CustomSelector

  @query('custom-pages')
  accessor pages: CustomPages

  @query('sales-view')
  accessor salesView

  @property()
  accessor selected

  @property({ provider: true, batches: true, batchDelay: 70 })
  accessor products = []

  @property({ provider: true, batchDelay: 70 })
  accessor categories = []

  @property({ provider: true, batchDelay: 70 })
  accessor eventMode = false

  @property({ provider: true, batchDelay: 70 })
  accessor currentEvent: Evenement

  @property({ provider: true, batchDelay: 70 })
  accessor events = []

  @property({ provider: true, batchDelay: 70 })
  accessor transactions = []

  @property({ provider: true, batchDelay: 70 })
  accessor members = []

  @property({ provider: true, batchDelay: 70 })
  accessor attendance = []

  @property({ provider: true, batchDelay: 70 })
  accessor promo = {}

  @property({ provider: true, batchDelay: 70 })
  accessor tabs = []

  @property({ provider: true, batchDelay: 70 })
  accessor payconiqTransactions = []

  @property({ provider: true, batchDelay: 70 })
  accessor planning = []

  @property()
  accessor attendanceDate = new Date().toISOString().slice(0, 10)

  @query('custom-drawer-layout')
  accessor drawerLayout: CustomDrawerLayout

  selectorSelected({ detail }: CustomEvent) {
    if (detail === 'logout') {
      this.logout()
    } else {
      this.drawerLayout.drawerOpen = false
      if (firebase.auth.currentUser) {
        location.hash = Router.bang(detail)
      } else {
        location.hash = Router.bang('login')
      }
    }
  }
  setupTabsListener() {
    this.#listeners.push('tabs')
    firebase.onChildAdded('tabs', async (snap) => {
      const val = await snap.val()
      const key = snap.key
      val.key = key
      if (!this.tabs) {
        this.tabs = [val]
      } else if (!this.tabs.includes(val)) {
        this.tabs.push(val)
      }
      this.tabs = [...this.tabs]
    })
    firebase.onChildChanged('tabs', async (snap) => {
      const val = await snap.val()
      const key = snap.key
      val.key = key
      let i = -1

      for (const event of this.tabs) {
        i += 1
        if (event.key === val.key) break
      }
      this.tabs.splice(i, val)
      this.tabs = [...this.tabs]
    })
    firebase.onChildRemoved('tabs', async (snap) => {
      const val = await snap.val()
      val.key = snap.key
      let i = -1

      for (const event of this.tabs) {
        i += 1
        if (event.key === val.key) break
      }
      this.tabs.splice(i)
      this.tabs = [...this.tabs]
    })
  }
  setupPromoListener() {
    this.#listeners.push('promo')
    firebase.onChildAdded(`promo`, async (snap) => {
      const key = await snap.key
      const val = await snap.val()
      if (!this.promo) {
        this.promo[key] = val
      } else if (!this.promo[key]) {
        this.promo[key] = val
      }
    })
    firebase.onChildChanged(`promo`, async (snap) => {
      const key = await snap.key
      const val = await snap.val()
      if (this.promo[key]) {
        this.promo[key] = val
      }
    })
    firebase.onChildRemoved(`promo`, async (snap) => {
      const key = await snap.key
      if (this.promo[key]) {
        delete this.promo[key]
      }
    })
  }
  setupAttendanceListener() {
    this.#listeners.push('attendance')
    firebase.onChildAdded(`attendance/${this.attendanceDate}`, async (snap) => {
      const val = await snap.val()
      if (!this.attendance) {
        this.attendance = [val]
      } else if (!this.attendance.includes(val)) {
        this.attendance.push(val)
      }
      this.attendance = [...this.attendance]
    })
    firebase.onChildChanged(`attendance/${this.attendanceDate}`, async (snap) => {
      const val = await snap.val()

      if (!this.attendance.includes(val)) {
        this.attendance.push(val)
      } else {
        const i = this.attendance.indexOf(val)
        this.attendance.splice(i, val)
      }
      this.attendance = [...this.attendance]
    })
    firebase.onChildRemoved(`attendance/${this.attendanceDate}`, async (snap) => {
      const val = await snap.val()
      if (this.attendance.includes(val)) {
        const i = this.attendance.indexOf(val)
        this.attendance.splice(i, val)
      }
      this.attendance = [...this.attendance]
    })
  }
  setupMembersListener() {
    this.#listeners.push('members')
    firebase.onChildAdded('members', async (snap) => {
      const val = await snap.val()
      const key = snap.key
      val.key = key
      if (!this.members) {
        this.members = [val]
      } else if (!this.members.includes(val)) {
        this.members.push(val)
      }
      this.members = [...this.members]
    })
    firebase.onChildChanged('members', async (snap) => {
      const val = await snap.val()
      const key = snap.key
      val.key = key
      let i = -1

      for (const event of this.members) {
        i += 1
        if (event.key === val.key) break
      }
      this.members.splice(i, val)
      this.members = [...this.members]
    })
    firebase.onChildRemoved('members', async (snap) => {
      const val = await snap.val()
      val.key = snap.key
      let i = -1

      for (const event of this.members) {
        i += 1
        if (event.key === val.key) break
      }
      this.members.splice(i)
      this.members = [...this.members]
    })
  }

  setupProductsListener() {
    this.#listeners.push('products')
    firebase.onChildAdded('products', async (snap) => {
      const val = await snap.val()
      const key = snap.key
      val.key = key
      if (!this.categories) {
        this.products = [val]
      } else if (!this.products.includes(val)) {
        this.products.push(val)
      }
      this.products = [...this.products]
    })
    firebase.onChildChanged('products', async (snap) => {
      const val = await snap.val()
      const key = snap.key
      val.key = key
      let i = -1

      for (const event of this.products) {
        i += 1
        if (event.key === val.key) break
      }
      this.products.splice(i, val)
      this.products = [...this.products]
    })
    firebase.onChildRemoved('products', async (snap) => {
      const val = await snap.val()
      val.key = snap.key
      let i = -1

      for (const event of this.products) {
        i += 1
        if (event.key === val.key) break
      }
      this.products.splice(i)
      this.products = [...this.products]
    })
  }

  setupCategoriesListener() {
    this.#listeners.push('categories')
    firebase.onChildAdded('categories', async (snap) => {
      const val = await snap.val()

      if (!this.categories) {
        this.categories = [val]
      } else if (!this.categories.includes(val)) {
        this.categories.push(val)
      }
      this.categories = [...this.categories]
    })
    firebase.onChildChanged('categories', async (snap) => {
      const val = await snap.val()
      this.categories.splice(this.categories.indexOf(val), val)
      this.categories = [...this.categories]
    })
    firebase.onChildRemoved('categories', async (snap) => {
      const val = await snap.val()

      if (this.categories.includes(val)) {
        this.categories.splice(this.categories.indexOf(val))
      }
      this.categories = [...this.categories]
    })
  }

  setupTransactionsListener() {
    this.#listeners.push('transactions')
    firebase.onChildAdded('transactions', async (snap) => {
      const val = await snap.val()
      const key = snap.key
      val.key = key
      if (!this.transactions) {
        this.transactions = [val]
      } else if (!this.transactions.includes(val)) {
        this.transactions.push(val)
      }
      this.transactions = [...this.transactions]
    })
    firebase.onChildChanged('transactions', async (snap) => {
      const val = await snap.val()
      const key = snap.key
      val.key = key
      let i = -1

      for (const event of this.transactions) {
        i += 1
        if (event.key === val.key) break
      }
      this.transactions.splice(i, val)
      this.transactions = [...this.transactions]
    })
    firebase.onChildRemoved('transactions', async (snap) => {
      const val = await snap.val()
      val.key = snap.key
      let i = -1

      for (const event of this.transactions) {
        i += 1
        if (event.key === val.key) break
      }
      this.transactions.splice(i)
      this.transactions = [...this.transactions]
    })
  }

  setupPayconiqTransactionsListener() {
    this.#listeners.push('payconiqTransactions')
    firebase.onChildAdded('payconiqTransactions', async (snap) => {
      const val = await snap.val()

      if (!this.payconiqTransactions) {
        this.payconiqTransactions = [val]
      } else {
        let i = -1

        for (const event of this.payconiqTransactions) {
          i += 1
          if (event.paymentId === val.paymentId) break
        }
        if (i === -1) this.payconiqTransactions.push(val)
        else this.payconiqTransactions.splice(i, val)
      }
      this.payconiqTransactions = [...this.payconiqTransactions]
    })
    firebase.onChildChanged('payconiqTransactions', async (snap) => {
      const val = await snap.val()
      let i = -1

      for (const tx of this.payconiqTransactions) {
        i += 1
        if (tx.paymentId === val.paymentId) break
      }
      this.payconiqTransactions.splice(i, val)
      this.payconiqTransactions = [...this.payconiqTransactions]
    })
    firebase.onChildRemoved('payconiqTransactions', async (snap) => {
      const val = await snap.val()
      let i = -1

      for (const event of this.payconiqTransactions) {
        i += 1
        if (event.paymentId === val.paymentId) break
      }
      this.salesView.payconiqPaymentChange(val)
      this.payconiqTransactions.splice(i)
      this.payconiqTransactions = [...this.payconiqTransactions]
    })
  }

  setupEventsListener() {
    this.#listeners.push('events')
    firebase.onChildAdded('events', async (snap) => {
      const val = await snap.val()
      val.key = snap.key
      if (!this.events) {
        this.events = [val]
      } else if (!this.events.includes(val)) {
        this.events.push(val)
      }
      this.events = [...this.events]
    })
    firebase.onChildChanged('events', async (snap) => {
      const val = await snap.val()
      const key = snap.key
      val.key = key
      let i = -1

      for (const event of this.events) {
        i += 1
        if (event.key === val.key) break
      }
      this.events.splice(i, val)
      this.events = [...this.events]
    })
    firebase.onChildRemoved('events', async (snap) => {
      const val = await snap.val()
      val.key = snap.key

      let i = -1

      for (const event of this.events) {
        i += 1
        if (event.key === val.key) break
      }

      this.events.splice(i)
      this.events = [...this.events]
    })
  }

  #listeners = []

  #onSearch = (ev) => {
    if (this.pages.selected === 'sales' || this.pages.selected === 'products') {
      if (this.#inMem) this.products = this.#inMem
      this.#inMem = this.products
      this.products = this.products.filter((product) => {
        if (product.key.includes(ev.detail.toLowerCase())) return true
        if (product.name.toLowerCase().includes(ev.detail.toLowerCase())) return true
        if (product.category.toLowerCase().includes(ev.detail.toLowerCase())) return true
      })
    } else if (this.pages.selected === 'categories') {
      if (this.#inMem) this.categories = this.#inMem
      this.#inMem = this.categories
      this.categories = this.categories.filter((category) => category.toLowerCase().includes(ev.detail))
    }
  }

  async select(selected) {
    if (this.#inMem) {
      if (this.pages.selected === 'sales' || this.pages.selected === 'products') {
        this.products = this.#inMem
      }

      if (this.pages.selected === 'categories') {
        this.categories = this.#inMem
      }
      this.#inMem = undefined
      this._searchInput.value = ''
    }
    this.selector.select(selected)
    this.pages.select(selected)
    if (selected === 'products' || selected === 'sales') {
      if (!this.#listeners.includes('categories')) this.setupCategoriesListener()
      if (!this.#listeners.includes('products')) this.setupProductsListener()
      if (!this.#listeners.includes('payconiqTransactions')) this.setupPayconiqTransactionsListener()
      if (!this.#listeners.includes('promo')) this.setupPromoListener()
      if (!this.#listeners.includes('members')) this.setupMembersListener()
      if (!this.#listeners.includes('tabs')) this.setupTabsListener()
    } else if (selected === 'checkout') {
      if (!this.#listeners.includes('transactions')) this.setupTransactionsListener()
      if (!this.#listeners.includes('members')) this.setupMembersListener()
    } else if (selected === 'attendance') {
      if (!this.#listeners.includes('attendance')) this.setupAttendanceListener()
      if (!this.#listeners.includes('members')) this.setupMembersListener()
      if (!this.#listeners.includes('promo')) this.setupPromoListener()
    } else if (selected === 'categories' || selected === 'add-product' || selected === 'add-event') {
      if (!this.#listeners.includes('categories')) this.setupCategoriesListener()
    } else if (selected === 'members' || selected === 'add-member' || selected === 'bookkeeping') {
      if (!this.#listeners.includes('members')) this.setupMembersListener()
    } else if (selected === 'events') {
      if (!this.#listeners.includes('events')) this.setupEventsListener()
    }
    this.drawerLayout.drawerOpen = false
  }

  didStart({ startDate, startTime }) {
    const start = new Date(`${startDate} ${startTime}`).getTime()
    if (start < new Date().getTime()) return true
    return false
  }

  didEnd({ endDate, endTime }) {
    const end = new Date(`${endDate} ${endTime}`).getTime()
    if (end < new Date().getTime()) return true
    return false
  }

  async connectedCallback() {
    if (!globalThis.firebase) {
      await import('./firebase.js')
    }

    if (firebase.auth.currentUser) await firebase.set('tabPay', null)
    
    this.shadowRoot.addEventListener('click', (event) => {
      if (event.target.hasAttribute('input-tap')) {
        this.salesView.inputTap({ detail: event.target.getAttribute('input-tap') })
      }
    })
    this.drawerLayout.drawerOpen = false
    document.addEventListener('search', this.#onSearch)
    this.router = new Router(this)
    this.setupEventsListener()
    this.eventsinterval()
  }

  stylePaybar() {
    let paybarheight = (document.querySelector('.pay-bar') as HTMLElement).clientHeight + 'px'
    let salesview = document.querySelector('sales-view') as HTMLElement
    salesview.style.setProperty('--paybarheight', paybarheight)
  }

  eventsinterval() {
    setInterval(async () => {
      let change = false
      for (const event of this.events) {
        if (!this.didEnd(event) && this.didStart(event)) {
          this.eventMode = true
          this.currentEvent = event
          change = true
          break
        }
      }
      if (!change) {
        this.eventMode = false
        this.currentEvent = undefined
      }
    }, 5000)
  }

  async logout() {
    await firebase.signOut()
  }

  renderSearch() {
    switch (this.pages?.selected) {
      case 'products':
      case 'categories':
      case 'sales':
        return html` <search-input></search-input> `

      default:
        return ''
    }
  }

  paymentInput(event) {
    this.salesView.inputTap(event)
  }

  renderPayBar() {
    switch (this.pages?.selected) {
      case 'sales':
        return html`<flex-row center class="pay-bar">
          <custom-elevation level="2"></custom-elevation>
          <md-filled-button input-tap="cash">Cash</md-filled-button>
          <md-filled-button input-tap="payconiq">Payconiq</md-filled-button>
          <md-filled-button input-tap="tabs">Rekeningen</md-filled-button>
          ${Object.values(this.promo).includes(true)
            ? html`<md-filled-button input-tap="promo">Promo</md-filled-button>`
            : ''}
        </flex-row>`

      default:
        return ''
    }
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          inset: 0;
          position: relative;
          height: 100%;
          width: 100%;
          --paybarheight: 75px;
        }
        custom-pages {
          width: 100%;
          height: 100%;
          display: flex;
        }
        .logout {
          position: absolute;
          bottom: 24px;
          background: var(--md-sys-color-on-error-container);
          color: var(--md-sys-color-on-error);
          width: auto;
        }
        [slot='top-app-bar-end'] {
          padding-right: 32px;
        }
        .pay-bar {
          z-index: 1;
          position: absolute;
          transform: translateX(-50%);
          left: 50%;
          top: 12px;
          background: var(--md-sys-color-surface-container-high);
          height: 58px;
          width: 100%;
          box-sizing: border-box;
          padding: 12px;
          max-width: fit-content;
          border-radius: var(--md-sys-shape-corner-extra-large);
          gap: 6px;
        }
        .pay-bar custom-elevation {
          border-radius: var(--md-sys-shape-corner-extra-large);
        }
        @media (max-width: 689px) {
          .pay-bar {
            position: absolute;
            bottom: 12px;
            top: unset;
            flex-wrap: wrap;
            height: min-content;
            max-width: max-content;
          }
          sales-view {
            margin-bottom: var(--paybarheight);
          }
        }
      </style>
      <!-- just cleaner -->
      ${icons}

      <md-dialog></md-dialog>
      <custom-theme loadFont="false"></custom-theme>
      <!-- see https://vandeurenglenn.github.io/custom-elements/ -->
      ${this.renderPayBar()}
      <custom-drawer-layout appBarType="small">
        <span slot="top-app-bar-title">Poho</span>
        <span slot="top-app-bar-end">${this.renderSearch()}</span>
        <span slot="drawer-headline"> menu </span>
        <custom-selector attr-for-selected="route" slot="drawer-content" @selected=${this.selectorSelected.bind(this)}>
          <custom-drawer-item route="sales"> Verkoop </custom-drawer-item>
          <custom-drawer-item route="checkout"> Afsluit </custom-drawer-item>
          <custom-drawer-item route="attendance"> Aanwezigheidslijst </custom-drawer-item>
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="products"> Producten </custom-drawer-item>
          <custom-drawer-item route="categories"> Categorieën </custom-drawer-item>
          <custom-drawer-item route="events"> Evenementinstellingen </custom-drawer-item>
          <custom-drawer-item route="members"> Leden </custom-drawer-item>
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="bookkeeping"> Boekhouding </custom-drawer-item>
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="calendar"> Kalender </custom-drawer-item>
          <custom-drawer-item route="planning"> Planning </custom-drawer-item>
          <custom-drawer-item route="logout" class="logout"> Uitloggen </custom-drawer-item>
        </custom-selector>

        <custom-pages attr-for-selected="route">
          <loading-view route="loading"> </loading-view>
          <sales-view route="sales"> </sales-view>
          <login-view route="login"> </login-view>
          <attendance-view route="attendance"> </attendance-view>
          <checkout-view route="checkout"> </checkout-view>
          <bookkeeping-view route="bookkeeping"> </bookkeeping-view>
          <categories-view route="categories"> </categories-view>
          <events-view route="events"> </events-view>
          <members-view route="members"> </members-view>
          <add-event-view route="add-event"> </add-event-view>
          <products-view route="products"> </products-view>
          <calendar-view route="calendar"> </calendar-view>
          <planning-view route="planning"> </planning-view>
          <add-product-view route="add-product"> </add-product-view>
          <add-member-view route="add-member"> </add-member-view>
        </custom-pages>
      </custom-drawer-layout>
    `
  }
}
