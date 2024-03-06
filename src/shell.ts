import { html, LiteElement, query, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/lit-elements/drawer-layout.js'
import '@vandeurenglenn/lit-elements/icon-set.js'
import '@vandeurenglenn/lit-elements/theme.js'
import '@vandeurenglenn/lit-elements/selector.js'
import '@vandeurenglenn/lit-elements/pages.js'
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

  @property({ provider: true, batches: true, batchDelay: 50 })
  accessor products = []

  @property({ provider: true })
  accessor categories = []

  @property({ provider: true })
  accessor eventMode = false

  @property({ provider: true })
  accessor events = []

  @property({ provider: true })
  accessor transactions = []

  @query('custom-drawer-layout')
  accessor drawerLayout: CustomDrawerLayout

  selectorSelected({ detail }: CustomEvent) {
    if (detail === 'logout') {
      this.logout()
    } else {
      this.drawerLayout.drawerOpen = false
      location.hash = Router.bang(detail)
    }
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
      const key = snap.key
      val.key = key
      let i = -1

      for (const event of this.categories) {
        i += 1
        if (event.key === val.key) break
      }
      this.categories.splice(i, val)
      this.categories = [...this.categories]
    })
    firebase.onChildRemoved('categories', async (snap) => {
      const val = await snap.val()
      val.key = snap.key
      let i = -1

      for (const event of this.transactions) {
        i += 1
        if (event.key === val.key) break
      }
      this.categories.splice(i)
      this.categories = [...this.categories]
    })
  }

  setupTransactionsListener() {
    this.#listeners.push('transactions')
    firebase.onChildAdded('transactions', async (snap) => {
      const val = await snap.val()

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
      console.log(val)

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
      if (!this.#listeners.includes('products')) {
        this.setupProductsListener()
        return
      }
    }

    if (selected === 'categories' || selected === 'add-product' || selected === 'add-event') {
      if (!this.#listeners.includes('categories')) this.setupCategoriesListener()
    } else if (selected === 'checkout' && !this.#listeners.includes('transactions')) this.setupTransactionsListener()
    else if (selected === 'events') {
      if (!this.#listeners.includes('events')) this.setupEventsListener()
    }
    this.drawerLayout.drawerOpen = false
  }

  didStart = ({ startDate, startTime }) => {
    const start = new Date(`${startDate} ${startTime}`).getTime()
    if (start < new Date().getTime()) return true
    return false
  }

  didEnd = ({ endDate, endTime }) => {
    const end = new Date(`${endDate} ${endTime}`).getTime()
    if (end < new Date().getTime()) return true
    return false
  }

  async connectedCallback() {
    if (!globalThis.firebase) {
      await import('./firebase.js')
    }

    this.drawerLayout.drawerOpen = false
    document.addEventListener('search', this.#onSearch)
    this.router = new Router(this)
    this.setupEventsListener()
    this.eventsinterval()
  }

  eventsinterval() {
    setInterval(async () => {
      let change = false
      for (const event of this.events) {
        if (!this.didEnd(event) && this.didStart(event)) {
          this.eventMode = true
          change = true
          break
        }
      }
      if (!change) this.eventMode = false
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

  render() {
    return html`
      <style>
        custom-pages {
          width: 100%;
          height: 100%;
          display: block;
        }
        .logout {
          position: absolute;
          bottom: 24px;
          background: var(--md-sys-color-on-error-container);
          color: var(--md-sys-color-on-error);
          width: auto;
        }
      </style>
      <!-- just cleaner -->
      ${icons}

      <md-dialog></md-dialog>
      <!-- see https://vandeurenglenn.github.io/custom-elements/ -->
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
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="bookkeeping"> Boekhouding </custom-drawer-item>
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
          <add-event-view route="add-event"> </add-event-view>
          <products-view route="products"> </products-view>
          <add-product-view route="add-product"> </add-product-view>
        </custom-pages>
      </custom-drawer-layout>
    `
  }
}
