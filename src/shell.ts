import { html, LiteElement, query, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/lit-elements/drawer-layout.js'
import '@vandeurenglenn/lit-elements/icon-set.js'
import '@vandeurenglenn/lit-elements/theme.js'
import '@vandeurenglenn/lit-elements/selector.js'
import '@vandeurenglenn/lit-elements/pages.js'
import icons from './icons.js'
import Router from './routing.js'
import type { CustomDrawerLayout, CustomPages, CustomSelector } from './component-types.js'
import { getAuth, signOut } from 'firebase/auth'
// import default page
import './views/loading.js'

@customElement('po-ho-shell')
export class PoHoShell extends LiteElement {
  router: Router

  selectorSelected({ detail }: CustomEvent) {
    if (detail === 'logout') {
      this.logout()
    } else {
      this.drawerLayout.drawerOpen = false
      location.hash = Router.bang(detail)
    }
  }

  @query('custom-selector')
  accessor selector: CustomSelector

  @query('custom-pages')
  accessor pages: CustomPages

  @property({ provider: true, batches: true, batchDelay: 50 })
  accessor products = []

  @property({ provider: true })
  accessor categories = []

  @property({ provider: true })
  accessor transactions = []

  @query('custom-drawer-layout')
  accessor drawerLayout: CustomDrawerLayout

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
      this.products.filter((product) => {
        i += 1
        return product.key === key
      })
      this.products.splice(i, val)
      this.products = [...this.products]
    })
    firebase.onChildRemoved('products', async (snap) => {
      const val = await snap.val()
      if (this.products.includes(val)) {
        this.products.splice(this.products.indexOf(val))
      }
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
      this.categories.filter((product) => {
        i += 1
        return product.key === key
      })
      this.categories.splice(i, val)
      this.categories = [...this.categories]
    })
    firebase.onChildRemoved('categories', async (snap) => {
      const val = await snap.val()
      if (this.categories.includes(val)) {
        this.categories.splice(this.categories.indexOf(val))
      }
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
      this.transactions.filter((product) => {
        i += 1
        return product.key === key
      })
      this.transactions.splice(i, val)
      this.transactions = [...this.transactions]
    })
    firebase.onChildRemoved('transactions', async (snap) => {
      const val = await snap.val()
      if (this.transactions.includes(val)) {
        this.transactions.splice(this.transactions.indexOf(val))
      }
    })
  }

  #listeners = []

  async select(selected) {
    this.selector.select(selected)
    this.pages.select(selected)
    if (selected === 'products' || selected === 'sales') {
      if (selected === 'products' && !this.#listeners.includes('products')) this.setupCategoriesListener()
      if (!this.#listeners.includes('products')) {
        this.setupProductsListener()
        return
      }
    }

    if (selected === 'categories' || selected === 'events') {
    if (!this.#listeners.includes('categories')) return this.setupCategoriesListener()
    }
    if (selected === 'checkout' && !this.#listeners.includes('transactions')) return this.setupTransactionsListener()
  }

  async connectedCallback() {
    this.drawerLayout.drawerOpen = false
    if (!globalThis.firebase) {
      await import('./firebase.js')
    }

    this.router = new Router(this)
  }

  async logout() {
    const auth = getAuth()
    await signOut(auth)
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
        <span slot="drawer-headline"> menu </span>
        <custom-selector attr-for-selected="route" slot="drawer-content" @selected=${this.selectorSelected.bind(this)}>
          <custom-drawer-item route="sales"> Verkoop </custom-drawer-item>
          <custom-drawer-item route="checkout"> Afsluit </custom-drawer-item>
          <custom-drawer-item route="attendance"> Aanwezigheidslijst </custom-drawer-item>
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="products"> Producten </custom-drawer-item>
          <custom-drawer-item route="categories"> Categorieën  </custom-drawer-item>
          <custom-drawer-item route="events"> Evenementinstellingen  </custom-drawer-item>
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
          <products-view route="products"> </products-view>
          <add-product-view route="add-product"> </add-product-view>
        </custom-pages>
      </custom-drawer-layout>
    `
  }
}
