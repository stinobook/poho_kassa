import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('prices-view')
export class PricesView extends LitElement {
  render() {
    return html` <p>Prijslijst</p> `
  }
}
