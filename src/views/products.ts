import { html, LiteElement, css, property, customElement } from '@vandeurenglenn/lite'
import '@vandeurenglenn/flex-elements/container.js'
import '@material/web/fab/fab.js'
import '@material/web/dialog/dialog.js'
import '@material/web/list/list-item.js'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/textfield/outlined-text-field.js'
import '@vandeurenglenn/flex-elements/it.js'
import Router from '../routing.js'
import type { Product } from '../types.js'
import { scrollbar } from './../mixins/styles.js'
@customElement('products-view')
export class ProductsView extends LiteElement {
  @property({ consumer: true })
  accessor products: Product[]

  static styles = [
    css`
      * {
        pointer-events: none;
      }
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }

      ${scrollbar}

      md-list-item {
        background: var(--md-sys-color-surface-container-high);
        border: 1px solid rgba(0, 0, 0, 0.34);
        border-radius: 48px;
        margin-top: 8px;
        width: 100%;
        --md-list-item-leading-space: 24px;
        cursor: pointer;
      }

      md-fab {
        position: absolute;
        right: 24px;
        bottom: 24px;
      }

      main,
      md-icon-button,
      md-fab,
      md-list-item,
      md-outlined-button {
        pointer-events: auto;
      }

      main {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        width: 100%;
        align-items: center;
      }
    `
  ]

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this.#clickHandler)
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#clickHandler)
  }

  #clickHandler = (event) => {
    const key = event.target.getAttribute('key')
    const name = event.target.getAttribute('name')
    const action = event.target.getAttribute('action')
    if (!action) return
    this[`_${action}`](key, name)
  }

  _add() {
    location.hash = Router.bang('add-product')
  }

  _delete = (target, name) => {
    const dialog = document.querySelector('po-ho-shell').shadowRoot.querySelector('md-dialog')
    dialog.innerHTML = `
    <div slot="headline">
      Deleting Product
    </div>
    <form slot="content" id="delete-form" method="dialog">
      Are you sure you want to delete ${name}?
    </form>
    <div slot="actions">
      <md-outlined-button form="delete-form" value="cancel">Cancel</md-outlined-button>
      <flex-it></flex-it>
      <md-outlined-button form="delete-form" value="delete">Delete</md-outlined-button>
    </div>
    `
    const handleClose = async () => {
      if (dialog.returnValue === 'delete') {
        await firebase.remove(`products/${target}`)
      }
      dialog.removeEventListener('close', handleClose)
    }
    dialog.addEventListener('close', handleClose)
    dialog.open = true
  }

  _edit = (target) => {
    location.hash = Router.bang(`add-product?edit=${target}`)
  }

  render() {
    return html`
      <main>
        <flex-container>
          ${this.products
            ? this.products.map(
                (item) => html`
                  <md-list-item action="edit" key=${item.key}>
                    <span slot="headline">${item.name}</span>
                    <span slot="supporting-text" style="width:50%">Prijs: &euro;${item.price} - BTW: ${item.vat}%</span>
                    <md-icon-button slot="end" action="delete" key=${item.key} name=${item.name}>
                      <custom-icon icon="delete"></custom-icon>
                    </md-icon-button>
                  </md-list-item>
                `
              )
            : ''}
        </flex-container>
      </main>
      <md-fab action="add"><custom-icon slot="icon">add</custom-icon></md-fab>
    `
  }
}
