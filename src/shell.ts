import { html, LitElement } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import '@vandeurenglenn/lit-elements/icon-set.js'
import '@vandeurenglenn/lit-elements/theme.js'
import '@vandeurenglenn/lit-elements/drawer-layout.js'
import '@vandeurenglenn/lit-elements/selector.js'
import '@vandeurenglenn/lit-elements/pages.js'
import icons from './icons.js'
import Router from './routing.js'
// import default page
import './views/sales.js'
import { CustomSelector } from '@vandeurenglenn/lit-elements/selector.js'

@customElement('po-ho-shell')
export class PoHoShell extends LitElement {
  router: Router

  #selectorSelected = ({ detail }: CustomEvent) => {
    location.href = Router.bang(detail)
  }

  @query('custom-selector')
  selector: CustomSelector

  @query('custom-pages')
  pages

  select(selected) {
    console.log({ selected })

    this.selector.select(selected)
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
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
      <!-- theme handler, see rollup config in .config dir, can add own theme instead... -->
      <custom-theme load-icons="false" load-font="false"></custom-theme>
      <!-- just cleaner -->
      ${icons}

      <!-- see https://vandeurenglenn.github.io/custom-elements/ -->
      <custom-drawer-layout appBarType="small">
        <span slot="top-app-bar-title">Poho</span>
        <span slot="drawer-headline"> menu </span>
        <custom-selector
          attr-for-selected="route"
          default-selected="sales"
          slot="drawer-content"
          @selected=${this.#selectorSelected}
        >
          <custom-drawer-item route="sales"> Verkoop </custom-drawer-item>
          <custom-drawer-item route="checkout"> Afsluit </custom-drawer-item>
          <custom-drawer-item route="attendance"> Aanwezigheidslijst </custom-drawer-item>
          <custom-drawer-item route="prices"> Prijslijst </custom-drawer-item>
        </custom-selector>

        <custom-pages attr-for-selected="route" default-selected="sales">
          <sales-view route="sales"> </sales-view>
          <attendance-view route="attendance"> </attendance-view>
          <checkout-view route="checkout"> </checkout-view>
          <prices-view route="prices"> </prices-view>
        </custom-pages>
      </custom-drawer-layout>
    `
  }
}
