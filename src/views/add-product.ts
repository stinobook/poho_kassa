import { html, LiteElement, css, property, query, state } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lit-elements/tabs.js'
import '@vandeurenglenn/lit-elements/tab.js'
import '@vandeurenglenn/lit-elements/divider.js'
import '@vandeurenglenn/lit-elements/icon-button.js'
import '@material/web/fab/fab.js'
import '@material/web/select/outlined-select.js'
import '@material/web/select/select-option.js'
import { get, ref, push, getDatabase, child, onChildAdded, onChildRemoved, set } from 'firebase/database'
import Router from '../routing.js'
import { queryAll } from '@vandeurenglenn/lite/query-all'
export type Product = {
  name: string
  vat: number
  price: number
  category: string
}

export type Products = Product[]

@customElement('add-product-view')
export class AddProductView extends LiteElement {
  @property({ type: Number })
  quickId: Number

  @state()
  category

  @property({ type: Object })
  params

  @property({ type: Array })
  categories: string[] = []

  @query('md-outlined-select')
  select

  editing

  async firstRender() {
    if (this.params) {
      await this.updateView(this.params)
    }
  }

  @queryAll('[label]')
  labels
  back = () => {
    history.back()
    this.params = undefined
    for (const label of this.labels.filter((item) => item.label !== 'category' && item.label !== 'quickId')) {
      label.reset()
      if (label.placeholder) {
        label.value = label.placeholder
      }
    }
  }

  async updateView(value) {
    const product = await (await get(child(ref(getDatabase(), 'products'), value.edit))).val()
    for (const [key, value] of Object.entries(product)) {
      const field = this.shadowRoot.querySelector(`[label=${key}]`)
      if (!field) alert(`property declared but no field found for: ${key}`)
      else if (key === 'category') {
        this.category = value
        field.select(value)
      } else field.value = value
    }
    const category = this.shadowRoot.querySelector(`[label="category"]`)
    if (!category.value) {
      category.selectItem(category.options[0])
    }
  }

  async onChange(propertyKey, value) {
    if (propertyKey === 'params') {
      if (value?.edit) {
        this.editing = true
        if (this.rendered) {
          await this.updateView(value)
        }
      }
    }
  }

  async connectedCallback(): Promise<void> {
    const _ref = ref(getDatabase(), 'categories')
    const categories = await (await get(_ref)).val()
    this.categories = categories ? categories : []
    const productsRef = ref(getDatabase(), 'products')
    this.shadowRoot.querySelector('[label="quickId"]').value = (await get(productsRef)).size
    const category = this.shadowRoot.querySelector(`[label="category"]`)
    if (!category.value) {
      category.selectItem(category.options[0])
    }
    onChildAdded(_ref, async (snap) => {
      const val = await snap.val()
      if (!this.categories.includes(val)) {
        this.categories.push(val)
        this.requestRender()
      }
    })
    onChildRemoved(_ref, async (snap) => {
      const val = await snap.val()
      if (this.categories.includes(val)) {
        this.categories.splice(this.categories.indexOf(val))
        this.requestRender()
      }
    })
  }

  save = async () => {
    const productsRef = await ref(getDatabase(), 'products')
    const product = {}

    const fields = Array.from(this.shadowRoot.querySelectorAll('md-outlined-text-field'))
    for (const field of fields) {
      if (field.value) product[field.label] = field.value
    }
    product.category = this.shadowRoot.querySelector('md-outlined-select').value
    if (this.editing) {
      set(child(productsRef, this.params.edit), product)
      this.params = undefined
    } else push(productsRef, product)
  }

  static styles = [
    css`
      :host {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      md-outlined-text-field,
      md-outlined-select {
        margin-top: 16px;
        width: 100%;
      }
      md-fab {
        position: absolute;
        right: 24px;
        bottom: 24px;
      }

      .back {
        left: 24px;
      }
    `
  ]
  add() {
    location.hash = Router.bang('add-product')
  }

  render() {
    return html`
      <flex-container>
        <md-fab @click=${this.back} class="back"><custom-icon slot="icon" icon="arrow_back"></custom-icon></md-fab>
        <md-outlined-text-field label="quickId"></md-outlined-text-field>
        <md-outlined-text-field label="name"></md-outlined-text-field>
        <md-outlined-text-field label="price" type="number" placeholder="0"></md-outlined-text-field>
        <md-outlined-text-field label="description" type="textarea"></md-outlined-text-field>
        <md-outlined-select label="category">
          ${this.categories
            ? map(
                this.categories,
                (category) =>
                  html` <md-select-option value=${category} headline=${category}>${category}</md-select-option> `
              )
            : ''}
        </md-outlined-select>
      </flex-container>
      <md-fab @click=${this.save}><custom-icon slot="icon">save</custom-icon></md-fab>
    `
  }
}
