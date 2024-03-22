import { html, css, LiteElement, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'

import '@material/web/fab/fab.js'

import '../components/sales/pad/pad.js'
import '../components/sales/grid/grid.js'

@customElement('sales-view')
export class SalesView extends LiteElement {
  fabIcon = 'shopping_cart_checkout'

  @query('sales-pad')
  accessor salesPad

  inputTap(event) {
    console.log(event)

    this.salesPad.inputTap(event)
  }

  payconiqPaymentChange(payment) {
    this.salesPad.payconiqPaymentChange(payment)
  }
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
          inset: 0;
        }

        .shown {
          padding-bottom: 12px;
        }

        md-fab {
          opacity: 1;
          pointer-events: auto;
          z-index: 1001;
          width: min-content;
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
  accessor pad

  @query('sales-grid')
  accessor grid

  togglePad = () => {
    let customIcon = this.shadowRoot.querySelector('.fabicon') as HTMLElement
    let fab = this.shadowRoot.querySelector('md-fab')
    if (this.pad.classList.contains('shown')) {
      this.pad.classList.remove('shown')
      fab.style.setProperty('left', '')
    } else {
      this.pad.classList.add('shown')
      fab.style.setProperty('left', '24px')
    }
  }

  addProductToReceipt = (event) => {
    this.pad.addProduct(event.detail)
  }

  render() {
    return html`
      <sales-pad></sales-pad>
      <sales-grid @product-click=${(event) => this.addProductToReceipt(event)}></sales-grid>

      <md-fab @click=${() => this.togglePad()}>
        <custom-icon icon="shopping_cart_checkout" class="fabicon" slot="icon"></custom-icon>
      </md-fab>
    `
  }
}
