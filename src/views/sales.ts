import { html, css, LiteElement, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'

import '@material/web/fab/fab.js'

import '../components/sales/pad/pad.js'
import '../components/sales/grid/grid.js'

@customElement('sales-view')
export class SalesView extends LiteElement {
  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        padding: 12px 0 12px 24px;
      }

      md-fab {
        position: absolute;
        right: 12px;
        bottom: 12px;
        opacity: 0;
        pointer-events: none;
      }
      @media (max-width: 689px) {
        :host {
          flex-direction: column;
        }
        sales-pad {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          padding-right: 0;
          padding-bottom: 12px;
        }

        md-fab {
          opacity: 1;
          pointer-events: auto;
        }
        sales-input,
        sales-receipt {
          opacity: 0;
          pointer-events: none;
        }
      }

      .shown {
        z-index: 1000;
        opacity: 1;
        pointer-events: auto;
        max-width: -webkit-fill-available;
        align-items: center;
        background: var(--md-sys-color-background);
      }
    `
  ]

  @query('sales-pad')
  pad

  showPad = () => {
    console.log('show')
    console.log(this)

    this.pad.classList.add('shown')
  }

  render() {
    return html`
      <sales-pad></sales-pad>
      <sales-grid></sales-grid>

      <md-fab @click=${() => this.showPad()}>
        <custom-icon icon="shopping_cart_checkout" slot="icon"></custom-icon>
      </md-fab>
    `
  }
}
