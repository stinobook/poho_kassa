import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@material/web/button/filled-button.js'
import '@vandeurenglenn/flex-elements/wrap-between.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import type { Tab, ReceiptItem } from '../../../types.js'

@customElement('tabs-grid')
export class TabsGrid extends LiteElement {
  @property({ type: Array, consumes: true }) 
  accessor tabs: Tab[]

  static styles = [
    css`
      :host {
        display: flex;
        width: 100%;
        padding: 12px;
        box-sizing: border-box;
        flex-direction: column;
        overflow-y: auto;
      }
      md-filled-button {
        pointer-events: auto;
        height: 50px;
        min-width: 50px;
        font-size: 1.3em;
        text-wrap: wrap;
        line-height: normal;
      }
      flex-wrap-between {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-auto-rows: min-content;
        gap: 16px 8px;
        width: 100%;
      }
      flex-container {
        max-width: -webkit-fill-available;
      }
      details {
        background-color: var(--md-sys-color-primary-container);
        border-radius: var(--md-sys-shape-corner-extra-large);
        color: var(--md-sys-color-on-primary-container);
        padding: 12px;
        height: max-content;
      }
      md-list {
        background: unset;
        padding: 0;
        pointer-events: none;
      }
      details[open] summary ~ * {
        animation: open 0.3s ease-in-out;
      }
      @keyframes open {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      details summary::-webkit-details-marker {
        display: none;
      }

      details summary {
        position: relative;
        cursor: pointer;
        list-style: none;
      }

      details summary:after {
        content: '+';
        height: 10px;
        position: absolute;
        font-size: 1.75rem;
        line-height: 0;
        top: 0;
        right: 0;
        font-weight: 200;
        transform-origin: center;
        transition: 200ms linear;
      }
      details[open] summary:after {
        transform: rotate(45deg);
        font-size: 2rem;
      }
      details summary {
        outline: 0;
      }
    `
  ]

  connectedCallback() {
    this.addEventListener('click', (event) => {
      const paths = event.composedPath() as HTMLElement[]
      const action = paths[2]?.hasAttribute ? paths[2].getAttribute('action') : paths[3].getAttribute('action')
      if (action != null) {
        this.dispatchEvent(new CustomEvent('tabs-click', { detail: action }))
      }
    })
  }

  calcTotal(items: ReceiptItem[]) {
    let total = 0
    for (const item of Object.values(items)) {
      total += Number(item.price) * Number(item.amount)
    }
    return total
  }

  renderTabs() {
    if (this.tabs.length === 0) {
      return html`<p>Geen openstaande rekeningen</p>`
    } else {
      return this.tabs.map((tab) => html`
        <details key=${tab.key}>
          <summary>
            <span>${tab.name}</span>
            <span style="float: right; margin-right: 24px"> Totaal: &euro;${this.calcTotal(tab.transactionItems)}</span>
          </summary>
          <md-list>
            ${
              Object.entries(tab.transactionItems).map(([key, transactionItem]) => html`
                <md-list-item>
                  <span slot="start">${transactionItem.amount} x ${transactionItem.name}</span>
                  <span slot="end"
                    >Eenheid: &euro;${transactionItem.price} / Subtotaal:
                    &euro;${Number(transactionItem.price) * Number(transactionItem.amount)}</span
                  >
                </md-list-item>
              `
              )
            }
          </md-list>
        </details>
      `  
      )
    }
  }

  render() {
    return html`
    <flex-container>
      <flex-row width="100%">
        <custom-typography><h4>Handelingen</h4></custom-typography> 
      </flex-row>
      <flex-wrap-between>
        <md-filled-button action="tabNew">Openen</md-filled-button>
        <md-filled-button action="tabAdd">Toevoegen</md-filled-button>
        <md-filled-button action="tabPay">Afrekenen</md-filled-button>
      </flex-wrap-between>
      <flex-row width="100%">
        <custom-typography><h4>Rekeningen</h4></custom-typography> 
      </flex-row>
      <flex-wrap-between>
        ${this.tabs ? this.renderTabs() : ''}
      </flex-wrap-between>
    </flex-container>
    `
  }
}
