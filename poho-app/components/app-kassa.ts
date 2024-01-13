import {html, css, LitElement, CSSResult, render} from 'lit'
import {customElement} from 'lit/decorators.js'
import '@material/web/button/filled-button.js'
import '@material/web/menu/menu.js'
import '@material/web/menu/menu-item.js'
import { Router } from '@vaadin/router';


const routes = [
    {
      path: '/',
      component: 'app-verkoop',
      children: [
        {
          path: 'verkoop',
          component: 'app-verkoop',
          action: async () => {
            await import('/poho-app/components/app-verkoop');
          },
        },
        {
          path: 'afsluit',
          component: 'app-afsluit',
          action: async () => {
            await import('/poho-app/components/app-afsluit');
          },
        },
        {
          path: 'aanwezigheidslijst',
          component: 'app-aanwezigheidslijst',
          action: async () => {
            await import('/poho-app/components/app-aanwezigheidslijst');
          },
        },
        {
          path: 'prijslijst',
          component: 'app-prijslijst',
          action: async () => {
            await import('/poho-app/components/app-prijslijst');
          },
        },
      ]
    },
  ];

const outlet = document.getElementById('outlet');
export const router = new Router(outlet);
router.setRoutes(routes);

@customElement('app-kassa')
export class appKassa extends LitElement
{
    render()
    {
        return html`
        <span style="position: relative">
            <md-filled-button id="usage-anchor" @click=${this._menuPressed}>PoHo Kassa</md-filled-button>
            <md-menu id="usage-menu" anchor="usage-anchor">
                <md-menu-item href="/">
                <div slot="headline">Verkoop</div>
                </md-menu-item>
                <md-menu-item href="/afsluit">
                <div" slot="headline">Afsluit</div>
                </md-menu-item>
                <md-menu-item href="/aanwezigheidslijst">
                <div slot="headline">Aanwezigheidslijst</div>
                </md-menu-item>
                <md-menu-item href="/prijslijst">
                <div slot="headline">Prijslijst</div>
                </md-menu-item>
            </md-menu>
        </span>
    `

    }
    _menuPressed(e) {
        const anchorEl = this.shadowRoot.querySelector('#usage-anchor');
        const menuEl = this.shadowRoot.querySelector('#usage-menu');
        menuEl.open = !menuEl.open;
    }
}