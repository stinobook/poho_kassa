import { property, html, LiteElement, css } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lit-elements/tabs.js'
import '@vandeurenglenn/lit-elements/tab.js'
import '@vandeurenglenn/lit-elements/divider.js'
import '@vandeurenglenn/lit-elements/icon-button.js'
import '@material/web/textfield/outlined-text-field.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/fab/fab.js'
import '@material/web/dialog/dialog.js'
import '@material/web/button/outlined-button.js'
import { ref, set, getDatabase } from 'firebase/database'
export type Product = {
  name: string
  vat: number
  price: number
  category: string
}

export type Products = Product[]

@customElement('categories-view')
export class CategoriesView extends LiteElement {
  @property({ type: Array, consumer: true })
  categories: string[]

  @property()
  targetEdit

  #ref = ref(getDatabase(), 'categories')

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

      md-outlined-text-field {
        margin-top: 6px;
      }

      custom-divider {
        margin-top: 4px;
      }
    `
  ]
  add = async () => {
    const category = await prompt('input category to add')
    if (!category) return
    if (!this.categories.includes(category)) {
      this.categories.push(category)
      await set(this.#ref, this.categories)
      this.requestRender()
    }
  }

  save = async () => {
    const field = this.shadowRoot.querySelector('md-outlined-text-field').value
    if (!field) return
    this.categories.splice(this.categories.indexOf(this.targetEdit), 1)
    if (!this.categories.includes(field)) {
      this.categories.push(field)
      await set(this.#ref, this.categories)
    }
    this.targetEdit = null
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
        if (this.categories.includes(target)) {
          this.categories.splice(this.categories.indexOf(target))
          this.requestRender()

          await set(this.#ref, this.categories)
        }
      }
      dialog.removeEventListener('close', handleClose)
    }
    dialog.addEventListener('close', handleClose)
    dialog.open = true
  }

  edit = (event: CustomEvent) => {
    const paths = event.composedPath()
    this.targetEdit = paths[2].getAttribute('target')
  }

  renderHeadline(item) {
    if (this.targetEdit === item)
      return html`<span slot="headline">
        <md-outlined-text-field label="value" value=${item}></md-outlined-text-field>
      </span>`

    return html`<span slot="headline">${item}</span>`
  }

  render() {
    return html`
      <flex-container>
        <md-list>
          ${this.categories
            ? this.categories.map(
                (item) => html`
                  <md-list-item>
                    ${this.renderHeadline(item)}
                    <flex-row slot="end">
                      <custom-icon-button icon="delete" target=${item} @click=${this.delete}></custom-icon-button>

                      <custom-icon-button
                        icon=${this.targetEdit === item ? 'save' : 'edit'}
                        target=${item}
                        @click=${this.targetEdit === item ? this.save : this.edit}
                      ></custom-icon-button>
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
