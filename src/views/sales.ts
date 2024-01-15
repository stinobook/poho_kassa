import { html, css, LitElement, CSSResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'

@customElement('sales-view')
export class SalesView extends LitElement {
  static styles: CSSResult = css`
    :host {
    }
    #saleList {
      width: 20%;
      height: 60%;
      border: 1px solid white;
    }
  `

  render() {
    return html` 
      <div id="saleList">
      <p>item</p>
      </div>
      <div id="saleNumpad">

      </div>

    
    
    
    
    `
  }
}
