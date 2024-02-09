import { html, css, LiteElement } from '@vandeurenglenn/lite'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/column.js'

@customElement('checkout-view')
export class CheckoutView extends LiteElement {
  static styles = [
    css`
      * {
        pointer-events: none;
      }
      :host {
        pointer-events: none;
        display: flex;
        flex-direction: column;
        max-width: 255px;
        width: 100%;
        height: 100%;
        max-height: calc(100% - 354px);
        position: relative;
        border-radius: var(--md-sys-shape-corner-extra-large);
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
      flex-container {
        min-width: 0;
        height: -webkit-fill-available;
        position: relative;
        overflow: hidden;
        overflow-y: auto;
      }
      flex-row,
      flex-column {
        width: 100%;
      }
      `
    ]

  @property({ type: Array })
  muntEenheid = ['€100', '€50', '€20', '€10', '€5', '€2', '€1', '€0.50', '€0.20', '€0.10']

  render() {
    return html`
      <flex-container>
        <flex-column>
          <md-list>
            ${this.muntEenheid.map((waarde) => html`<md-list-item><span slot="headline">${waarde}</span></md-list-item>`)}
          </md-list>
        </flex-column>
        <flex-column>
          <flex-row>
          <md-list>
            <md-list-item>(Winkel/lidgeld) Cash</md-list-item>
            <md-divider></md-divider>
            <md-list-item>Zwan 3&euro;</md-list-item>
            <md-list-item>
              <div slot="headline">Lidgeld 120&euro;</div>
              <div slot="supporting-text">John Doe met Rocky</div>
            </md-list-item>
            <md-list-item>
              <div slot="headline">Extra lid 10&euro;</div>
              <div slot="supporting-text">Jane Doe</div>
            </md-list-item>
            <md-list-item></md-list-item>
          </md-list>
          </flex-row>
          <flex-row>
          <md-list>
            <md-list-item>(Winkel/lidgeld) Payconiq</md-list-item>
            <md-divider></md-divider>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
          </md-list>
          </flex-row>
        </flex-column>
      </flex-container>
    `
  }
}
