import { html, LiteElement, query, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/lite-elements/notifications.js'
import '@vandeurenglenn/lite-elements/drawer-layout.js'
import '@vandeurenglenn/lite-elements/icon-set.js'
import '@vandeurenglenn/lite-elements/theme.js'
import '@vandeurenglenn/lite-elements/selector.js'
import '@vandeurenglenn/lite-elements/pages.js'
import '@vandeurenglenn/lite-elements/divider.js'
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
  #propertyProviders = []
  #inMem

  @query('search-input') accessor _searchInput

  @query('custom-selector') accessor selector: CustomSelector

  @query('custom-pages') accessor pages: CustomPages

  @query('sales-view') accessor salesView

  @property() accessor selected

  @property({ provider: true, batches: true, batchDelay: 70 }) accessor products = []

  @property({ provider: true, batchDelay: 70 }) accessor categories = []

  @property({ provider: true, batchDelay: 70 }) accessor eventMode = false

  @property({ provider: true, batchDelay: 70 }) accessor currentEvent: Evenement

  @property({ provider: true, batchDelay: 70 }) accessor events = []

  @property({ provider: true, batchDelay: 70 }) accessor transactions = []

  @property({ provider: true, batchDelay: 70 }) accessor members = []

  @property({ provider: true, batchDelay: 70 }) accessor attendance = []

  @property({ provider: true, batchDelay: 70 }) accessor promo = {}

  @property({ provider: true, batchDelay: 70 }) accessor tabs = []

  @property({ provider: true, batchDelay: 70 }) accessor payconiqTransactions = []

  @property({ provides: true, batchDelay: 70 }) accessor planning

  @property({ provides: true, batchDelay: 70 }) accessor users

  @property() accessor attendanceDate = new Date().toISOString().slice(0, 10)

  @query('custom-drawer-layout') accessor drawerLayout: CustomDrawerLayout

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

  /**
   * collection of the views and there desired providers
   */
  static propertyProviders = {
    products: ['products', 'categories'],
    sales: ['products', 'categories', 'payconiqTransactions', { name: 'planning', type: 'object' }, 'members', 'tabs'],
    checkout: ['transactions', 'members'],
    attendance: ['attendance', 'members', { name: 'planning', type: 'object' }],
    categories: ['categories'],
    members: ['members'],
    'add-member': ['members'],
    bookkeeping: ['members'],
    users: ['members', 'users'],
    events: ['events'],
    planning: [{ name: 'planning', type: 'object' }],
    calendar: ['members', { name: 'planning', type: 'object' }]
  }

  setupPropertyProvider(propertyProvider, type = 'array') {
    this.#propertyProviders.push(propertyProvider)

    const deleteOrReplace = async (propertyProvider, snap, task = 'replace') => {
      const val = await snap.val()
      if (type === 'array') {
        if (typeof val === 'object' && !Array.isArray(val)) val.key = snap.key
        let i = -1

        for (const item of this[propertyProvider]) {
          i += 1
          if (item.key === snap.key) break
        }

        if (task === 'replace') this[propertyProvider].splice(i, 1, val)
        else this[propertyProvider].splice(i, 1)
        this[propertyProvider] = [...this[propertyProvider]]
      } else if (type === 'object') {
        if (task === 'replace') this[propertyProvider][val.key] = val
        else delete this[propertyProvider][val.key]
        this[propertyProvider] = { ...this[propertyProvider] }
      }
    }

    firebase.onChildAdded(propertyProvider, async (snap) => {
      const val = await snap.val()
      if (type === 'array') {
        if (typeof val === 'object') val.key = snap.key
        if (!this[propertyProvider]) {
          this[propertyProvider] = [val]
        } else if (!this[propertyProvider].includes(val)) {
          this[propertyProvider].push(val)
        }
        this[propertyProvider] = [...this[propertyProvider]]
      } else if (type === 'object') {
        if (!this[propertyProvider]) this[propertyProvider] = {}
        this[propertyProvider][snap.key] = val
        this[propertyProvider] = { ...this[propertyProvider] }
      }
    })

    firebase.onChildChanged(propertyProvider, (snap) => deleteOrReplace(propertyProvider, snap, 'replace'))
    firebase.onChildRemoved(propertyProvider, (snap) => deleteOrReplace(propertyProvider, snap, 'delete'))
  }

  handlePropertyProvider(propertyProvider) {
    for (const input of PoHoShell.propertyProviders[propertyProvider]) {
      let propertyKey
      if (typeof input === 'object') propertyKey = input.name
      else propertyKey = input

      if (!this.#propertyProviders.includes(propertyKey)) this.setupPropertyProvider(propertyKey, input?.type)
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

    this.handlePropertyProvider(selected)
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
    this.setupPropertyProvider('events')
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

        /* Temporary dividers, for organising account access */
        .divider {
          display: flex;
          flex-direction: row;
          pointer-events: auto;
        }
        .divider:before,
        .divider:after {
          content: '';
          flex: 1 1;
          border-bottom: 1px solid;
          margin: auto 10px;
        }
        custom-selector {
          margin-bottom: 125px;
        }
        /* end temporary styles */
      </style>
      <!-- just cleaner -->
      ${icons}

      <md-dialog></md-dialog>
      <custom-theme loadFont="false" mobile-trigger="(max-width: 1200px)"></custom-theme>
      <!-- see https://vandeurenglenn.github.io/custom-elements/ -->
      ${this.renderPayBar()}
      <custom-drawer-layout appBarType="small" mobile-trigger="(max-width: 1200px)">
        <span slot="top-app-bar-title">Poho</span>
        <span slot="top-app-bar-end">${this.renderSearch()}</span>
        <span slot="drawer-headline"> menu </span>
        <custom-selector attr-for-selected="route" slot="drawer-content" @selected=${this.selectorSelected.bind(this)}>
          <h2 class="divider">Kassa</h2>
          <custom-drawer-item route="sales"> Verkoop </custom-drawer-item>
          <custom-drawer-item route="checkout"> Afsluit </custom-drawer-item>
          <custom-drawer-item route="attendance"> Aanwezigheidslijst </custom-drawer-item>
          <custom-drawer-item route="products"> Producten </custom-drawer-item>
          <custom-drawer-item route="categories"> Categorieën </custom-drawer-item>
          <h2 class="divider">Kristel - Ann</h2>
          <custom-drawer-item route="bookkeeping"> Boekhouding </custom-drawer-item>
          <h2 class="divider">Leden</h2>
          <custom-drawer-item route="calendar"> Kalender </custom-drawer-item>
          <h2 class="divider">Stijn</h2>
          <custom-drawer-item route="events"> Evenementinstellingen </custom-drawer-item>
          <custom-drawer-item route="members"> Leden </custom-drawer-item>
          <custom-drawer-item route="planning"> Planning </custom-drawer-item>
          <custom-drawer-item route="users"> Gebruikers </custom-drawer-item>
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
          <users-view route="users"> </users-view>
          <add-product-view route="add-product"> </add-product-view>
          <add-member-view route="add-member"> </add-member-view>
        </custom-pages>
      </custom-drawer-layout>
    `
  }
}
