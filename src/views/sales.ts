import { html, css, LitElement, CSSResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'

@customElement('sales-view')
export class SalesView extends LitElement {
  static styles: CSSResult = css`
    :host {
    }
    #saleList {
    }
    #saleNumpad {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; 
      grid-template-rows: 1fr 1fr 1fr 1fr 1fr; 
      gap: 5px 5px; 
      grid-template-areas: 
        "seven seven eight eight nine nine"
        "four four five five six six"
        "one one two two three three"
        "zero zero zero zero dot dot"
        "cash cash cash payconiq payconiq payconiq"; 
    }
    md-outlined-button:nth-child(1) {
      grid-area: one;
    }
    md-outlined-button:nth-child(2) {
      grid-area: two;
    }
    md-outlined-button:nth-child(3) {
      grid-area: three;
    }
    md-outlined-button:nth-child(4) {
      grid-area: four;
    }
    md-outlined-button:nth-child(5) {
      grid-area: five;
    }
    md-outlined-button:nth-child(6) {
      grid-area: six;
    }
    md-outlined-button:nth-child(7) {
      grid-area: seven;
    }
    md-outlined-button:nth-child(8) {
      grid-area: eight;
    }
    md-outlined-button:nth-child(9) {
      grid-area: nine;
    }
    md-outlined-button:nth-child(10) {
      grid-area: zero;
    }
    md-outlined-button:nth-child(11) {
      grid-area: dot;
    }
    md-filled-button:nth-child(12) {
      grid-area: cash;
    }
    md-filled-button:nth-child(13) {
      grid-area: payconiq;
      height: 50px;
    }

  `
  

  render() {
    return html` 
    <flex-column>
      <custom-card type="filled" id="saleList">
        <ul slot="supportingText">
        <li>Cola</li>
        <li>Jupiler</li>
        <li>Cava</li>
        </ul>
      </custom-card>
      <md-filled-text-field label="Ontvangen" type="number" prefix-text="€">
      </md-filled-text-field>
      <div id="saleNumpad">
      <md-outlined-button>1</md-outlined-button>
      <md-outlined-button>2</md-outlined-button>
      <md-outlined-button>3</md-outlined-button>
      <md-outlined-button>4</md-outlined-button>
      <md-outlined-button>5</md-outlined-button>
      <md-outlined-button>6</md-outlined-button>
      <md-outlined-button>7</md-outlined-button>
      <md-outlined-button>8</md-outlined-button>
      <md-outlined-button>9</md-outlined-button>
      <md-outlined-button>0</md-outlined-button>
      <md-outlined-button>.</md-outlined-button>
      <md-filled-button>Cash</md-filled-button>
      <md-filled-button>Payconiq</md-filled-button>
      </div>

    </flex-column>
    
    
    
    `
  }
}
