import { html, css, LiteElement } from '@vandeurenglenn/lite'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/textfield/filled-text-field.js'
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
      const inputNumber = paths[2]?.hasAttribute ? paths[2].getAttribute('inputNumber') : paths[3].getAttribute('inputNumber')
        this.dispatchEvent(new CustomEvent('input-click', { detail: inputNumber }))
    })
  }

  static styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 333px;
      width: 100%;
      max-width: 228px;
      position: relative;
      background-color: var(--md-sys-color-surface-container-high);
      border-radius: var(--md-sys-shape-corner-extra-large);
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
      margin-top: 12px;
    }
    md-filled-text-field {
      --md-filled-text-field-container-shape-start-start: var(--md-sys-shape-corner-extra-large);
      --md-filled-text-field-container-shape-start-end: var(--md-sys-shape-corner-extra-large);
    }
    md-outlined-button,
    md-filled-text-field,
    md-filled-button {
      pointer-events: auto;
    }
  `
  ]

  render() {
    return html`
      <custom-elevation level="1"></custom-elevation>
      <md-filled-text-field id="inputSales" label="Input" type="number" prefix-text=""> </md-filled-text-field>
      <flex-wrap-evenly>
        <md-outlined-button inputNumber="1">1</md-outlined-button>
        <md-outlined-button inputNumber="2">2</md-outlined-button>
        <md-outlined-button inputNumber="3">3</md-outlined-button>
        <md-outlined-button inputNumber="4">4</md-outlined-button>
        <md-outlined-button inputNumber="5">5</md-outlined-button>
        <md-outlined-button inputNumber="6">6</md-outlined-button>
        <md-outlined-button inputNumber="7">7</md-outlined-button>
        <md-outlined-button inputNumber="8">8</md-outlined-button>
        <md-outlined-button inputNumber="9">9</md-outlined-button>
        <md-outlined-button inputNumber="0" class="big-button">0</md-outlined-button>
        <md-outlined-button inputNumber=".">.</md-outlined-button>
        <flex-row>
          <md-filled-button>Cash</md-filled-button>
          <flex-it></flex-it>
          <md-filled-button>Payconiq</md-filled-button>
        </flex-row>
      </flex-wrap-evenly>
    `
  }


}
