import { html, css, LitElement, CSSResult } from 'lit'
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
import './input.js'
import '@vandeurenglenn/flex-elements/wrap-evenly.js'
import { query } from '@vandeurenglenn/lite'
import '@material/web/dialog/dialog.js'

@customElement('sales-pad')
export class SalesPad extends LitElement {
  static styles: CSSResult = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      max-width: 240px;
      padding-right: 12px;
      box-sizing: border-box;
      position: relative;
    }

    sales-receipt {
      margin-bottom: 24px;
    }
  `

  
  @query('sales-receipt')
  receipt

 
  addProduct(product) {
    this.currentSelectedProduct = product
    this.receipt.addProduct(product)
  }

  inputTap({detail}: CustomEvent) {
    if (detail == 'cash' || detail == 'payconiq') {
      let popupCash = this.shadowRoot.querySelector('#popupcash') as HTMLDialogElement
      popupCash.open = true;
    } else if (this.currentSelectedProduct != undefined) {
    this.receipt.addProduct(this.currentSelectedProduct, detail)
    }
  }

  render() {
    return html`
      <sales-receipt></sales-receipt>
      <flex-it></flex-it>
      <sales-input @input-click=${(event) => this.inputTap(event)}></sales-input>
      <md-dialog id="popupcash">
        <div slot="headline">
          Cash Ontvangst
        </div>
        <form slot="content" id="form-id" method="dialog">
        <md-filled-button form="form-id" value="50">&euro;50</md-filled-button>
        <md-filled-button form="form-id" value="20">&euro;20</md-filled-button>
        <md-filled-button form="form-id" value="10">&euro;10</md-filled-button>
        <md-filled-button form="form-id" value="5">&euro;5</md-filled-button>
        </form>
        <div slot="actions">
        <md-outlined-button form="form-id" value="">Gepast</md-outlined-button>
        </div>
    </md-dialog>
    `
  }
}
