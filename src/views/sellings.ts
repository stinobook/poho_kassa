import { html, css, LitElement, CSSResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@material/web/list/list.js'

@customElement('sellings-view')
export class SellingsView extends LitElement {
  static styles: CSSResult = css`
    :host {
    }
  `

  render() {
    return html` <p>Verkoopscherm</p> `
  }
}
