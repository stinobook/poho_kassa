import { html, LiteElement, query, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/lite-elements/notifications.js'
import '@vandeurenglenn/lite-elements/drawer-layout.js'
import '@vandeurenglenn/lite-elements/icon-set.js'
import '@vandeurenglenn/lite-elements/theme.js'
import '@vandeurenglenn/lite-elements/selector.js'
import '@vandeurenglenn/lite-elements/pages.js'
import '@vandeurenglenn/lite-elements/divider.js'
import './components/chip/chip.js'
import './components/search.js'
import icons from './icons.js'
import Router from './routing.js'
import { scrollbar } from './mixins/styles.js'
import type { CustomDrawerLayout, CustomPages, CustomSelector } from './component-types.js'
// import default page
import './views/loading.js'
import { Evenement, Member, PropertyProviderEvents } from './types.js'

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
  @property() accessor userPhoto
  @property({ provides: true }) accessor expiredMembersList

  @property({ provides: true, batches: true, batchDelay: 70 }) accessor products

  @property({ provides: true, batchDelay: 70 }) accessor categories

  @property({ type: Boolean, provides: true, batchDelay: 70 }) accessor eventMode: boolean = false

  @property({ type: Object, provides: true, batchDelay: 70 }) accessor currentEvent: Evenement

  @property({ provides: true, batchDelay: 70 }) accessor events

  @property({ provides: true, batchDelay: 70 }) accessor transactions

  @property({ provides: true, batchDelay: 70 }) accessor members

  @property({ provides: true, batchDelay: 70 }) accessor attendance

  @property({ provides: true, batchDelay: 70 }) accessor promo

  @property({ provides: true, batchDelay: 70 }) accessor tabs

  @property({ provides: true, batchDelay: 70 }) accessor payconiqTransactions

  @property({ provides: true, batchDelay: 70 }) accessor planning

  @property({ provides: true, batchDelay: 70 }) accessor calendar

  @property({ provides: true, batchDelay: 70 }) accessor users

  @property({ provides: 'user', batchDelay: 70 }) accessor user

  @property({ provides: true }) accessor roles

  @property({ provides: true, batchDelay: 70 }) accessor files

  @property() accessor attendanceDate = new Date().toISOString().slice(0, 10)

  @query('custom-drawer-layout') accessor drawerLayout: CustomDrawerLayout

  async selectorSelected({ detail }: CustomEvent) {
    if (detail === 'logout') {
      await firebase.signOut()
    } else {
      this.drawerLayout.drawerOpen = false
      if (firebase.auth.currentUser) {
        location.hash = Router.bang(detail)
      } else {
        location.hash = Router.bang('login')
      }
    }
  }

  #onSearch = ev => {
    if (this.pages.selected === 'sales' || this.pages.selected === 'products') {
      if (this.#inMem) this.products = this.#inMem
      this.#inMem = this.products
      this.products = this.products.filter(product => {
        if (product.key.includes(ev.detail.toLowerCase())) return true
        if (product.name.toLowerCase().includes(ev.detail.toLowerCase())) return true
        if (product.category.toLowerCase().includes(ev.detail.toLowerCase())) return true
      })
    } else if (this.pages.selected === 'categories') {
      if (this.#inMem) this.categories = this.#inMem
      this.#inMem = this.categories
      this.categories = this.categories.filter(category => category.toLowerCase().includes(ev.detail))
    } else if (this.pages.selected === 'members') {
      if (this.#inMem) this.members = this.#inMem
      this.#inMem = this.members
      let varMem = this.members.filter(member => {
        if (member.name.toLowerCase().includes(ev.detail.toLowerCase())) return true
        if (member.lastname.toLowerCase().includes(ev.detail.toLowerCase())) return true
        if (member.group.toLowerCase().includes(ev.detail.toLowerCase())) return true
      })
      for (const extra of varMem) {
        if (extra.extra && !varMem.map(key => key.key).includes(extra.extra))
          varMem.push(this.members.filter(member => member.key === extra.extra)[0])
      }
      this.members = varMem
    }
  }

  /**
   * collection of the views and there desired providers
   */
  propertyProviders = {
    products: ['products', 'categories'],
    sales: [
      'products',
      'categories',
      {
        name: 'payconiqTransactions',
        type: 'array',
        events: { onChildChanged: val => this.salesView.payconiqPaymentChange(val) }
      },
      { name: 'promo', type: 'object' },
      'members',
      'tabs'
    ],
    checkout: ['transactions', 'members'],
    attendance: [{ name: 'attendance', type: 'object' }, 'members', { name: 'promo', type: 'object' }],
    categories: ['categories'],
    members: ['members', { name: 'attendance', type: 'object' }],
    bookkeeping: ['members'],
    users: ['members', 'users', 'transactions'],
    events: ['events', 'categories'],
    planning: [{ name: 'planning', type: 'object' }],
    calendar: ['members', { name: 'planning', type: 'object' }, { name: 'calendar', type: 'object' }],
    files: ['members', { name: 'files', type: 'object' }],
    'add-event': ['events', 'categories', 'products']
  }

  setupPropertyProvider(propertyProvider, type = 'array', events?: PropertyProviderEvents) {
    this.#propertyProviders.push(propertyProvider)

    if (!this[propertyProvider]) this[propertyProvider] = type === 'object' ? {} : []

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
        if (task === 'replace') this[propertyProvider][snap.key] = val
        else delete this[propertyProvider][snap.key]
        this[propertyProvider] = { ...this[propertyProvider] }
      }

      if (task === 'replace') events?.onChildChanged?.(val)
      else events?.onChildRemoved?.(val)
    }

    firebase.onChildAdded(propertyProvider, async snap => {
      const val = await snap.val()
      if (type === 'array') {
        if (typeof val === 'object' && !Array.isArray(val)) val.key = snap.key
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
      events?.onChildAdded?.(val)
    })

    firebase.onChildChanged(propertyProvider, snap => deleteOrReplace(propertyProvider, snap, 'replace'))
    firebase.onChildRemoved(propertyProvider, snap => deleteOrReplace(propertyProvider, snap, 'delete'))
  }

  handlePropertyProvider(propertyProvider) {
    if (this.propertyProviders[propertyProvider]) {
      for (const input of this.propertyProviders[propertyProvider]) {
        let propertyKey
        if (typeof input === 'object') propertyKey = input.name
        else propertyKey = input

        if (!this.#propertyProviders.includes(propertyKey))
          this.setupPropertyProvider(propertyKey, input?.type, input?.events)
      }
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
      if (this.pages.selected === 'members') {
        this.members = this.#inMem
      }
      this.#inMem = undefined
      this._searchInput.value = ''
    }
    this.selector.select(selected)
    this.pages.select(selected)

    if (this.pages.selected === 'add-event') {
      this.handlePropertyProvider(selected)
    }

    if (this.roles.includes(selected)) this.handlePropertyProvider(selected)
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

  async updatePhoto() {
    let uploadUserphoto = await firebase.uploadBytes(
      `members/${
        Object.values(this.members as Member[]).filter(member => member.key === firebase.userDetails.member)[0]
          .lastname +
        Object.values(this.members as Member[]).filter(member => member.key === firebase.userDetails.member)[0].name
      }avatar`,
      this.userPhoto.files[0]
    )
    let userphotoURL = await firebase.getDownloadURL(uploadUserphoto.ref)
    await firebase.set(
      'members/' + firebase.userDetails.member + '/userphotoURL',
      userphotoURL.replace('avatar', 'avatar_300x300')
    )
  }

  async connectedCallback() {
    this.roles = Object.keys(this.propertyProviders)
    this.roles.push('settings')
    if (!globalThis.firebase) {
      await import('./firebase.js')
    }
    this.shadowRoot.addEventListener('click', event => {
      if (event.target instanceof Element)
        if (event.target.tagName === 'CHIP-ELEMENT') {
          this.userPhoto = document.createElement('input')
          this.userPhoto.setAttribute('type', 'file')
          this.userPhoto.click()
          this.userPhoto.addEventListener('change', () => {
            this.updatePhoto()
          })
        }
      if (event.target instanceof Element)
        if (event.target.hasAttribute('input-tap')) {
          this.salesView.inputTap({ detail: event.target.getAttribute('input-tap') })
        }
    })
    this.drawerLayout.drawerOpen = false
    document.addEventListener('search', this.#onSearch)
    this.router = new Router(this)
    this.setupPropertyProvider('promo', 'object')
    this.setupPropertyProvider('events')
    this.eventsinterval()
    this.renderMenu()
    if (this.members) this.expiredMembers()
  }

  stylePaybar() {
    let paybarheight = (document.querySelector('.pay-bar') as HTMLElement).clientHeight + 'px'
    let salesview = document.querySelector('sales-view') as HTMLElement
    salesview.style.setProperty('--paybarheight', paybarheight)
  }

  eventsinterval() {
    setInterval(async () => {
      let change = false
      let pages = this.shadowRoot
        .querySelector('custom-drawer-layout')
        .shadowRoot.querySelector('flex-column > slot:nth-child(2) > custom-top-app-bar') as HTMLElement
      for (const event of this.events) {
        if (!this.didEnd(event) && this.didStart(event)) {
          this.eventMode = true
          this.currentEvent = event
          pages.style.setProperty('background', 'var(--md-sys-color-error-container)')
          change = true
          break
        }
      }
      if (!change) {
        this.eventMode = false
        pages.style.setProperty('background', 'var(--md-sys-color-surface)')
        this.currentEvent = undefined
      }
    }, 5000)
  }

  renderSearch() {
    switch (this.pages?.selected) {
      case 'products':
      case 'categories':
      case 'sales':
      case 'members':
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
        return html`<flex-row
          center
          class="pay-bar">
          <custom-elevation level="2"></custom-elevation>
          <md-filled-button input-tap="cash">Cash</md-filled-button>
          <md-filled-button input-tap="payconiq">Payconiq</md-filled-button>
          <md-filled-button input-tap="tabs">Rekeningen</md-filled-button>
          ${this.promo && Object.values(this.promo).includes(true)
            ? Object.values(this.promo).includes(true)
              ? html`<md-filled-button input-tap="promo">Promo</md-filled-button>`
              : ''
            : ''}
          ${this.expiredMembersList?.length > 0
            ? html`<md-filled-button
                class="expired"
                input-tap="members"
                >Leden</md-filled-button
              >`
            : ''}
        </flex-row>`

      default:
        return ''
    }
  }

  expiredMembers() {
    let expirationDate = new Date()
    expirationDate.setFullYear(expirationDate.getFullYear() - 1)
    if (this.members) {
      this.expiredMembersList = Object.values(this.members).filter(
        (member: Member) =>
          member.group === 'leden' &&
          (new Date(member.paydate) < expirationDate || member.status === 'nieuw') &&
          member.status !== 'inactief'
      )
    }
  }

  renderMenu() {
    for (const item of this.shadowRoot.querySelectorAll('custom-drawer-item')) {
      if (!firebase.userRoles.includes(item.getAttribute('route')) && item.getAttribute('route') !== 'logout') {
        this.shadowRoot
          .querySelector('custom-drawer-layout > custom-selector > [route=' + item.getAttribute('route'))
          .remove()
        this.shadowRoot
          .querySelector('custom-drawer-layout > custom-pages > [route=' + item.getAttribute('route'))
          .remove()
      }
    }
    let dividers = this.shadowRoot.querySelectorAll('custom-divider')

    if (
      !(
        firebase.userRoles.includes('sales') ||
        firebase.userRoles.includes('checkout') ||
        firebase.userRoles.includes('attendance')
      )
    )
      dividers[0].remove()

    if (!(firebase.userRoles.includes('products') || firebase.userRoles.includes('categories'))) dividers[1].remove()
    if (!firebase.userRoles.includes('bookkeeping')) dividers[2].remove()
    if (!(firebase.userRoles.includes('calendar') || firebase.userRoles.includes('files'))) dividers[3].remove()
    if (!firebase.userRoles.includes('settings')) dividers[4].remove()
  }

  onChange(propertyKey: string): void {
    if (propertyKey === 'members' || propertyKey === 'promo') {
      this.expiredMembers()
      this.renderPayBar()
    }
    if (propertyKey === 'roles') {
      if (this.members) this.renderMenu()
    }
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          inset: 0;
          position: absolute;

          --paybarheight: 75px;
        }
        custom-pages {
          width: 100%;
          height: 100%;
          display: flex;
        }

        .logout {
          background: var(--md-sys-color-on-error-container);
          color: var(--md-sys-color-on-error);
          width: auto;
        }
        .logout custom-icon {
          --custom-icon-color: var(--md-sys-color-on-error);
        }
        [slot='top-app-bar-end'] {
          padding-right: 32px;
        }
        flex-row {
          width: 100%;
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
        custom-selector {
          pointer-events: auto;
          margin-bottom: 12px;
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
        chip-element {
          pointer-events: none;
          margin: 12px;
          border-radius: var(--md-sys-shape-corner-extra-large);
          box-shadow: unset;
        }
        .expired {
          --md-filled-button-container-color: var(--md-sys-color-on-error-container);
          --md-filled-button-label-text-color: var(--md-sys-color-on-error);
        }
        .version {
          position: absolute;
          bottom: 0;
        }
        custom-selector {
          overflow-y: auto;
        }

        ${scrollbar}
      </style>
      <!-- just cleaner -->
      ${icons}

      <md-dialog></md-dialog>
      <custom-theme
        loadFont="false"
        loadSymbols="false"
        mobile-trigger="(max-width: 1200px)"></custom-theme>
      <!-- see https://vandeurenglenn.github.io/custom-elements/ -->
      ${this.renderPayBar()}
      <custom-drawer-layout
        appBarType="small"
        mobile-trigger="(max-width: 1200px)">
        <span slot="top-app-bar-title">Menu</span>
        <span slot="top-app-bar-end">${this.renderSearch()}</span>
        <span slot="drawer-headline">
          ${this.members && firebase.userDetails
            ? firebase.userDetails?.member === 'kassa'
              ? html`<span>PoHo App Kassa </span>`
              : html`<chip-element
                  .avatar=${Object.values(this.members as Member[])?.filter(
                    member => member.key === firebase.userDetails.member
                  )[0]?.userphotoURL}
                  .name=${new Date().getHours() < 12
                    ? 'Goeiemorgen, ' +
                      Object.values(this.members as Member[])?.filter(
                        member => member.key === firebase.userDetails.member
                      )[0]?.name +
                      '!'
                    : new Date().getHours() <= 18
                    ? 'Goeiedag, ' +
                      Object.values(this.members as Member[])?.filter(
                        member => member.key === firebase.userDetails.member
                      )[0]?.name +
                      '!'
                    : 'Goeieavond, ' +
                      Object.values(this.members as Member[])?.filter(
                        member => member.key === firebase.userDetails.member
                      )[0]?.name +
                      '!'}>
                </chip-element>`
            : ''}</span
        >
        <custom-selector
          attr-for-selected="route"
          slot="drawer-content"
          @selected=${this.selectorSelected.bind(this)}>
          <custom-drawer-item route="sales">
            Verkoop
            <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="point_of_sale"></custom-icon
          ></custom-drawer-item>
          <custom-drawer-item route="checkout">
            Afsluit<flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="price_check"></custom-icon>
          </custom-drawer-item>
          <custom-drawer-item route="attendance">
            Aanwezigheidslijst<flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="patient_list"></custom-icon>
          </custom-drawer-item>
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="products">
            Producten <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="inventory"></custom-icon
          ></custom-drawer-item>
          <custom-drawer-item route="categories">
            Categorieën
            <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="category"></custom-icon>
          </custom-drawer-item>
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="bookkeeping">
            Boekhouding <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="checkbook"></custom-icon
          ></custom-drawer-item>
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="calendar">
            Kalender
            <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="calendar_month"></custom-icon
          ></custom-drawer-item>
          <custom-drawer-item route="files">
            Bestanden
            <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="topic"></custom-icon
          ></custom-drawer-item>
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="events">
            Evenementinstellingen
            <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="event"></custom-icon
          ></custom-drawer-item>
          <custom-drawer-item route="members">
            Leden
            <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="card_membership"></custom-icon
          ></custom-drawer-item>
          <custom-drawer-item route="planning">
            Planning
            <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="view_agenda"></custom-icon
          ></custom-drawer-item>
          <custom-drawer-item route="users">
            Gebruikers

            <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="groups"></custom-icon
          ></custom-drawer-item>
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="settings">
            Instellingen
            <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="settings"></custom-icon>
          </custom-drawer-item>
          <custom-drawer-item
            route="logout"
            class="logout">
            Uitloggen
            <flex-it></flex-it>
            <custom-icon
              slot="end"
              icon="logout"></custom-icon>
          </custom-drawer-item>
        </custom-selector>
        <flex-row
          slot="drawer-footer"
          class="version">
          <small>V</small>
          <small>@version</small>
        </flex-row>
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
          <files-view route="files"> </files-view>
          <planning-view route="planning"> </planning-view>
          <settings-view route="settings"> </settings-view>
          <users-view route="users"> </users-view>
          <add-product-view route="add-product"> </add-product-view>
          <add-member-view route="add-member"> </add-member-view>
        </custom-pages>
      </custom-drawer-layout>
    `
  }
}
