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
    this.receipt.addProduct(product)
  }


  inputTap = (event) => {
    console.log({event})
  }

  render() {
    return html`
      <sales-receipt></sales-receipt>
      <flex-it></flex-it>
      <sales-input @input-click=${(event) => this.inputTap(event)}></sales-input>
    `
  }
}
