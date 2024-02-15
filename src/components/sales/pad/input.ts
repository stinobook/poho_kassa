import { html, css, LiteElement } from '@vandeurenglenn/lite'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lit-elements/tabs.js'
import '@vandeurenglenn/lit-elements/tab.js'
import '@vandeurenglenn/lit-elements/divider.js'
import '@vandeurenglenn/lit-elements/icon-button.js'
import '@vandeurenglenn/lit-elements/button.js'
import '@vandeurenglenn/lit-elements/card.js'
import './receipt.js'
import '@vandeurenglenn/flex-elements/wrap-evenly.js'

@customElement('sales-input')
export class SalesInput extends LiteElement {
  connectedCallback() {
    this.shadowRoot.addEventListener('click', ({ target }: CustomEvent) => {
      // @ts-ignore
      this.dispatchEvent(new CustomEvent('input-click', { detail: target.getAttribute('input-tap') }))
    })
  }

  static styles = [
    css`
      * {
        pointer-events: none;
      }
      :host {
        display: flex;
        flex-direction: column;
        height: fit-content;
        width: 100%;
        max-width: 228px;
      }

      custom-elevation {
        border-radius: var(--md-sys-shape-corner-extra-large);
      }
      flex-wrap-evenly {
        background-color: var(--md-sys-color-surface-container-high);
        border-radius: var(--md-sys-shape-corner-extra-large);
        padding: 6px 0;
        margin-bottom: 12px;
        position: relative;
      }
      flex-row {
        background: var(--md-sys-color-surface-container-high);
        height: 58px;
        width: 100%;
        box-sizing: border-box;
        padding: 12px;
        box-sizing: border-box;
        position: relative;
        border-radius: var(--md-sys-shape-corner-extra-large);
      }

      .big-button {
        width: calc((100% / 2) + 24px);
      }

      md-outlined-button,
      custom-button {
        margin-top: 6px;
        height: 50px;
        width: 64px;
        margin-bottom: 6px;

        border-radius: var(--md-sys-shape-corner-extra-large);
      }
      md-outlined-button,
      md-filled-button {
        pointer-events: auto;
      }
    `
  ]

  render() {
    return html`
      <flex-wrap-evenly>
        <custom-elevation level="1"></custom-elevation>
        <md-outlined-button input-tap="1">1</md-outlined-button>
        <md-outlined-button input-tap="2">2</md-outlined-button>
        <md-outlined-button input-tap="3">3</md-outlined-button>
        <md-outlined-button input-tap="4">4</md-outlined-button>
        <md-outlined-button input-tap="5">5</md-outlined-button>
        <md-outlined-button input-tap="6">6</md-outlined-button>
        <md-outlined-button input-tap="7">7</md-outlined-button>
        <md-outlined-button input-tap="8">8</md-outlined-button>
        <md-outlined-button input-tap="9">9</md-outlined-button>
        <md-outlined-button input-tap="+1"><custom-typography>+1</custom-typography></md-outlined-button>
        <md-outlined-button input-tap="0">0</md-outlined-button>

        <md-outlined-button input-tap="R">R</md-outlined-button>
      </flex-wrap-evenly>
      <flex-row center>
        <custom-elevation level="2"></custom-elevation>
        <md-filled-button input-tap="cash">Cash</md-filled-button>
        <flex-it></flex-it>
        <md-filled-button input-tap="payconiq">Payconiq</md-filled-button>
      </flex-row>
    `
  }
}
