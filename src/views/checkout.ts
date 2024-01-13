import { html, css, LitElement, CSSResult, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'

@customElement('checkout-view')
export class CheckoutView extends LitElement {
  static styles: CSSResult = css`
    :host {
      p: '';
    }
  `

  @property({ type: Array })
  muntEenheid = ['€100', '€50', '€20', '€10', '€5', '€2', '€1', '€0.50', '€0.20', '€0.10']

  render(): TemplateResult<1> {
    return html`
      <md-list>
        ${this.muntEenheid.map((waarde) => html`<md-list-item><span slot="headline">${waarde}</span></md-list-item>`)}
      </md-list>
    `
  }
}
