import { html, LiteElement, css, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lit-elements/tabs.js'
import '@vandeurenglenn/lit-elements/tab.js'
import '@vandeurenglenn/lit-elements/divider.js'
import '@vandeurenglenn/lit-elements/icon-button.js'
import '@material/web/fab/fab.js'
import '@material/web/dialog/dialog.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import { get, ref, getDatabase, remove, child, onChildAdded, onChildRemoved } from 'firebase/database'
import Router from '../routing.js'

export type Product = {
  name: string
  vat: number
  price: number
  category: string
  id: number
}

export type Products = Product[]

@customElement('products-view')
export class ProductsView extends LiteElement {
  @property({ type: Array })
  items: Products

  #ref = ref(getDatabase(), 'products')

  async connectedCallback(): Promise<void> {
    const products = await (await get(this.#ref)).val()
    this.items = products ? products : []
    onChildAdded(this.#ref, async (snap) => {
      const key = snap.key
      if (!this.items[key]) {
        this.items[key] = await snap.val()
        this.requestRender()
      }
    })
    onChildRemoved(this.#ref, async (snap) => {
      const key = await snap.key
      if (this.items[key]) {
        delete this.items[key]
        this.requestRender()
      }
    })
  }

  static styles = [
    css`
      :host {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      md-list {
        overflow-y: auto;
        width: 100%;
      }
      md-list-item {
        --md-list-item-bottom-space: 0;
      }
      md-fab {
        position: absolute;
        right: 24px;
        bottom: 24px;
      }
    `
  ]
  add() {
    location.hash = Router.bang('add-product')
  }

  delete = (event: CustomEvent) => {
    const paths = event.composedPath()
    const target = paths[2].getAttribute('target')
    const dialog = document.querySelector('po-ho-shell').shadowRoot.querySelector('md-dialog')
    dialog.innerHTML = `
    <div slot="headline">
      Deleting category
    </div>
    <form slot="content" id="delete-form" method="dialog">
      Are you sure you want to delete ${target}?
    </form>
    <div slot="actions">
      <md-outlined-button form="delete-form" value="cancel">Cancel</md-outlined-button>
      <flex-it></flex-it>
      <md-outlined-button form="delete-form" value="delete">Delete</md-outlined-button>
    </div>
    `
    const handleClose = async () => {
      if (dialog.returnValue === 'delete') {
        await remove(child(this.#ref, target))
      }
      dialog.removeEventListener('close', handleClose)
    }
    dialog.addEventListener('close', handleClose)
    dialog.open = true
  }

  edit = (event: CustomEvent) => {
    const paths = event.composedPath()

    const target = paths[2].getAttribute('target')
    location.hash = Router.bang(`add-product?edit=${target}`)

    // this.targetEdit = paths[2].getAttribute('target')
  }
  render() {
    return html`
      <flex-container>
        <md-list>
          ${this.items
            ? Object.entries(this.items).map(
                ([key, item]) => html`
                  <md-list-item>
                    <span slot="headline">${item.name}</span>
                    <flex-row slot="end">
                      <custom-icon-button icon="delete" target=${key} @click=${this.delete}></custom-icon-button>

                      <custom-icon-button icon="edit" target=${key} @click=${this.edit}></custom-icon-button>
                    </flex-row>
                  </md-list-item>

                  <custom-divider middle-inset></custom-divider>
                `
              )
            : ''}
        </md-list>
      </flex-container>
      <md-fab @click=${this.add}><custom-icon slot="icon">add</custom-icon></md-fab>
    `
  }
}
