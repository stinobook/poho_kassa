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

      ::-webkit-scrollbar {
        width: 8px;
        border-radius: var(--md-sys-shape-corner-extra-large);
        background-color: var(--md-sys-color-surface-container-highest);
      }
      ::-webkit-scrollbar-thumb {
        background: var(--md-sys-color-on-surface-container-highest);
        border-radius: var(--md-sys-shape-corner-extra-large);
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.5) inset;
      }
    `
  ]

  @query('sales-pad')
  pad

  @query('sales-grid')
  grid

  togglePad = () => {
    if (this.classList.contains('shown')) this.classList.remove('shown')
    else this.pad.classList.add('shown')
  }

  addProductToReceipt = (event) => {
    this.pad.addProduct(event.detail)
  }

  render() {
    return html`
      <sales-pad></sales-pad>
      <sales-grid @product-click=${(event) => this.addProductToReceipt(event)}></sales-grid>

      <md-fab @click=${() => this.togglePad()}>
        <custom-icon icon="shopping_cart_checkout" slot="icon"></custom-icon>
      </md-fab>
    `
  }
}
