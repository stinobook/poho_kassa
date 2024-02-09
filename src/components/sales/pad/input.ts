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
    this.addEventListener('click', (event) => {
      const paths = event.composedPath() as HTMLElement[]
      const inputDetail = paths[2]?.hasAttribute ? paths[2].getAttribute('input-tap') : paths[3].getAttribute('input-tap')
        this.dispatchEvent(new CustomEvent('input-click', { detail: inputDetail }))
    })
  }

  static styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 274px;
      width: 100%;
      max-width: 228px;
      position: relative;
      border-radius: var(--md-sys-shape-corner-extra-large);
    }
    flex-wrap-evenly {
      background-color: var(--md-sys-color-surface-container-high);
      border-radius: var(--md-sys-shape-corner-extra-large);
      padding: 6px 0;
      margin-bottom: 12px;
    }
    flex-row {
      margin-top: 12px;
      height: 50px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 12px;
    }

    .big-button {
      width: calc((100% / 2) + 24px);
    }

    md-outlined-button {
      margin-top: 6px;
      height: 50px;
      margin-bottom: 6px;
    }
    md-outlined-button,
    md-filled-button {
      pointer-events: auto;
    }
  `
  ]

  render() {
    return html`
      <custom-elevation level="1"></custom-elevation>
      <flex-wrap-evenly>
        <md-outlined-button input-tap="1">1</md-outlined-button>
        <md-outlined-button input-tap="2">2</md-outlined-button>
        <md-outlined-button input-tap="3">3</md-outlined-button>
        <md-outlined-button input-tap="4">4</md-outlined-button>
        <md-outlined-button input-tap="5">5</md-outlined-button>
        <md-outlined-button input-tap="6">6</md-outlined-button>
        <md-outlined-button input-tap="7">7</md-outlined-button>
        <md-outlined-button input-tap="8">8</md-outlined-button>
        <md-outlined-button input-tap="9">9</md-outlined-button>
      </flex-wrap-evenly>
      <flex-row>
      <md-filled-button input-tap="cash">Cash</md-filled-button>
      <flex-it></flex-it>
      <md-filled-button input-tap="payconiq">Payconiq</md-filled-button>
    </flex-row>
    `
  }


}
