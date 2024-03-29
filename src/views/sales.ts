import { html, css, LiteElement, property, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@material/web/fab/fab.js'
import '../components/sales/pad/pad.js'
import '../components/sales/grid/grid.js'
import '../components/sales/tabs/tabs.js'
import '@vandeurenglenn/lite-elements/button.js'
import type { ReceiptItem, Tab } from '../types.js'
import { Transaction } from 'firebase/firestore'

@customElement('sales-view')
export class SalesView extends LiteElement {
  fabIcon = 'shopping_cart_checkout'

  @property({ type: Array, consumer: true }) 
  accessor tabs: Tab[]

  @query('sales-pad')
  accessor salesPad

  @query('sales-grid')
  accessor grid

  @query('tabs-grid')
  accessor tabsGrid


  inputTap(event) {
    if (event.detail === 'tabs') { 
      this.toggleTabs() 
    } else {
      this.salesPad.inputTap(event)
    }
  }

  payconiqPaymentChange(payment) {
    this.salesPad.payconiqPaymentChange(payment)
  }
  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        padding: 12px 0 12px 24px;
      }

      md-fab {
        position: absolute;
        right: 12px;
        bottom: 12px;
        opacity: 0;
        pointer-events: none;
      }
      sales-grid, tabs-grid {
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        transform: translateX(0%);
        z-index: 0;
        opacity: 1;
        left: 0;
        position: relative;
      }
      .toggle {
        transform: translateX(200%);
        z-index: 1;
        opacity: 0;
        left: 240px;
        position: absolute;
      }
      custom-button {
        background-color: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        height: 50px;
        width: 98px;
      }
      flex-wrap-between {
        max-width: 320px;
        background-color: var(--md-sys-color-surface-container-high);
        border-radius: var(--md-sys-shape-corner-extra-large);

        margin-top: 24px;
        gap: 12px;
      }
      @media (max-width: 689px) {
        :host {
          flex-direction: column;
        }
        sales-pad {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          padding-right: 0;
          inset: 0;
        }

        .shown {
          padding-bottom: 12px;
        }

        md-fab {
          opacity: 1;
          pointer-events: auto;
          z-index: 1001;
          width: min-content;
        }
        sales-input,
        sales-receipt {
          opacity: 0;
          pointer-events: none;
        }
      }

      .shown {
        z-index: 1000;
        opacity: 1;
        pointer-events: auto;
        max-width: -webkit-fill-available;
        align-items: center;
        background: var(--md-sys-color-background);
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
    `
  ]

  togglePad = () => {
    let customIcon = this.shadowRoot.querySelector('.fabicon') as HTMLElement
    let fab = this.shadowRoot.querySelector('md-fab')
    if (this.salesPad.classList.contains('shown')) {
      this.salesPad.classList.remove('shown')
      fab.style.setProperty('left', '')
    } else {
      this.salesPad.classList.add('shown')
      fab.style.setProperty('left', '24px')
    }
  }

  toggleTabs() {
    let salesGrid = this.shadowRoot.querySelector('sales-grid') as HTMLElement
    let tabsGrid = this.shadowRoot.querySelector('tabs-grid') as HTMLElement
    if (tabsGrid.classList.contains('toggle')) {
      tabsGrid.classList.remove('toggle')
      salesGrid.classList.add('toggle')
    } else {
      tabsGrid.classList.add('toggle')
      salesGrid.classList.remove('toggle')
    }
  }

  addProductToReceipt = (event) => {
    this.salesPad.addProduct(event.detail)
  }

  dialogInput(): Promise<string> {
    return new Promise((resolve) => {
      const dialog = this.shadowRoot.querySelector('custom-dialog.dialogInput') as HTMLDialogElement
      const closeAction = () => {
        let inputValue = (this.shadowRoot.querySelector('md-filled-text-field.dialoginput-value') as HTMLInputElement)
          .value
        if (inputValue !== '') {
          resolve(inputValue)
          ;(this.shadowRoot.querySelector('md-filled-text-field.dialoginput-value') as HTMLInputElement).value = ''
          dialog.removeEventListener('close', closeAction)
        } else {
          alert('Nothing entered')
          dialog.removeEventListener('close', closeAction)
        }
      }
      dialog.addEventListener('close', closeAction)
      dialog.open = true
    })
  }

  dialogKey(): Promise<string> {
    return new Promise((resolve) => {
      const dialog = this.shadowRoot.querySelector('custom-dialog.dialogTabs') as HTMLDialogElement
      const closeAction = (event) => {
          resolve(event.detail)
          dialog.removeEventListener('close', closeAction)
      }
      dialog.addEventListener('close', closeAction)
      dialog.open = true
    })
  }

  dialogPay(): Promise<CustomEvent> {
    return new Promise((resolve) => {
      const dialog = this.shadowRoot.querySelector('custom-dialog.dialogPay') as HTMLDialogElement
      const closeAction = (event) => {
          resolve(event)
          dialog.removeEventListener('close', closeAction)
      }
      dialog.addEventListener('close', closeAction)
      dialog.open = true
    })
  }

  handleTabs = async (event) => {
    switch (event.detail) {
      case 'tabNew':
        if (Object.keys(this.salesPad.receipt.items).length === 0) {
          alert('Geen items om op een rekening te plaatsen')
          break
        }
        const name = await this.dialogInput()
        let tab: Tab = {
          name: name,
          transactionItems: this.salesPad.receipt.items
        }
        await firebase.push('tabs',tab)
        this.salesPad.receipt.items = {}
        this.salesPad.receipt.textTotalorChange = 'Rekening'
        break
      case 'tabAdd':
        if (Object.keys(this.salesPad.receipt.items).length === 0) {
          alert('Geen items om op een rekening te plaatsen')
          break
        }
        let tabKey = await this.dialogKey()    
        if (tabKey === 'cancel' || tabKey === 'close') {
          break
        }
        let tabAdd: Tab
        tabAdd = Object.values(this.tabs).filter((tab) => tab.key === tabKey)[0]
        for (const [key, item] of Object.entries(this.salesPad.receipt.items)) {
          if (Object.keys(tabAdd.transactionItems).includes(key)) {
            tabAdd.transactionItems[key].amount += item.amount
          } else {
            tabAdd.transactionItems[key] = item
          }
        }
        await firebase.update('tabs/' + tabKey, tabAdd)
        this.salesPad.receipt.items = {}
        this.salesPad.receipt.textTotalorChange = 'Toegevoegd'
        break
      case 'tabPay':
        if (Object.keys(this.salesPad.receipt.items).length !== 0) {
          alert('Er staan nog items die niet afgeboekt zijn.')
          break
        }
        let tabPay = ''
        tabPay = await this.dialogKey()
        if (tabPay === 'close' || tabPay === 'cancel' ) break
        let paymentMethod = await this.dialogPay()
        if (paymentMethod.detail === 'close' || paymentMethod.detail === 'cancel' ) break
        firebase.set('tabPay', tabPay)
        this.salesPad.inputTap(paymentMethod)
        break
      default:
        console.log(event.detail)
    }
  }

  renderTabs() {
    return this.tabs.map(tab =>
        html `
          <custom-button action=${tab.key} .label=${tab.name}>${tab.name}</custom-button>
        `
      )
  }

  render() {
    return html`
      <sales-pad></sales-pad>
      <sales-grid @product-click=${(event) => this.addProductToReceipt(event)}></sales-grid>
      <tabs-grid class="toggle" @tabs-click=${(event) => this.handleTabs(event)}></tabs-grid>
      <md-fab @click=${() => this.togglePad()}>
        <custom-icon icon="shopping_cart_checkout" class="fabicon" slot="icon"></custom-icon>
      </md-fab>
      <custom-dialog class="dialogInput" has-actions="" has-header="">
        <span slot="title">Naam rekening?</span>
        <md-filled-text-field class="dialoginput-value"></md-filled-text-field>
        <flex-row slot="actions" direction="row">
          <custom-button label="send" action="send" has-label="">Accepteer</custom-button>
        </flex-row>
      </custom-dialog>
      <custom-dialog class="dialogTabs" has-actions="" has-header="">
        <span slot="title">Selecteer een rekening</span>
        <flex-wrap-between slot="actions" direction="row">
          ${this.tabs ? this.renderTabs() : ''}
        </flex-wrap-between>
      </custom-dialog>
      <custom-dialog class="dialogPay" has-actions="" has-header="">
        <span slot="title">Betaalmethode</span>
        <flex-wrap-between slot="actions" direction="row">
          <custom-button action='cash' label='cash'>Cash</custom-button>
          <custom-button action='payconiq' label='payconiq'>Payconiq</custom-button>
        </flex-wrap-between>
      </custom-dialog>
    `
  }
}
