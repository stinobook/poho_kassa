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
// import default page
import './views/loading.js'

@customElement('po-ho-shell')
export class PoHoShell extends LiteElement {
  router: Router

  selectorSelected({ detail }: CustomEvent) {
    console.log({ detail })

    this.drawerLayout.drawerOpen = false
    location.hash = Router.bang(detail)
  }

  @query('custom-selector')
  selector: CustomSelector

  @query('custom-pages')
  pages: CustomPages

  @property({ provider: true })
  products

  @query('custom-drawer-layout')
  drawerLayout: CustomDrawerLayout

  async select(selected) {
    console.log({ selected })
    this.selector.select(selected)
    this.pages.select(selected)
    if (selected === 'products' || selected === 'sales') {
      const products = await firebase.get('products')
      this.products = products
    }
  }

  async connectedCallback() {
    this.drawerLayout.drawerOpen = false
    if (!globalThis.firebase) {
      await import('./firebase.js')
    }
    this.router = new Router(this)
  }

  render() {
    return html`
      <style>
        custom-pages {
          width: 100%;
          height: 100%;
          display: block;
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
          <custom-drawer-item route="prices"> Prijslijst </custom-drawer-item>
          <custom-divider middle-inset></custom-divider>
          <custom-drawer-item route="products"> products </custom-drawer-item>
          <custom-drawer-item route="categories"> categories </custom-drawer-item>
        </custom-selector>

        <custom-pages attr-for-selected="route">
          <loading-view route="loading"> </loading-view>
          <login-view route="login"> </login-view>
          <sales-view route="sales"> </sales-view>
          <attendance-view route="attendance"> </attendance-view>
          <checkout-view route="checkout"> </checkout-view>
          <products-view route="products"> </products-view>
          <categories-view route="categories"> </categories-view>
          <add-product-view route="add-product"> </add-product-view>
          <prices-view route="prices"> </prices-view>
        </custom-pages>
      </custom-drawer-layout>
    `
  }
}
