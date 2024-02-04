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
import { prijslijst } from './prices.js'
import { prijslijst_categories } from './prices.js'
import '../components/sales/pad/pad.js'
import '../components/sales/grid/grid.js'

@customElement('sales-view')
export class SalesView extends LitElement {
  static styles: CSSResult = css`
    :host {
    }
    #saleList {
    }
  `

  render() {
    return html`
      <sales-pad></sales-pad>
      <sales-grid></sales-grid>
    `
  }
}
// <div id="itemGrid-cat">${prijslijst.filter(i => i.category === category )}</div>
