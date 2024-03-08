import { html, LiteElement, css, property, query, queryAll } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lit-elements/tabs.js'
import '@vandeurenglenn/lit-elements/tab.js'
import '@vandeurenglenn/lit-elements/divider.js'
import '@vandeurenglenn/lit-elements/icon-button.js'
import '@material/web/fab/fab.js'
import '@material/web/select/outlined-select.js'
import '@material/web/textfield/outlined-text-field.js'
import '@material/web/select/select-option.js'
import '@material/web/checkbox/checkbox.js'
import Router from '../routing.js'
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import { MdOutlinedSelect } from '@material/web/select/outlined-select.js'
import { Product } from '../types.js'

export type Products = Product[]

@customElement('add-product-view')
export class AddProductView extends LiteElement {
  @property({ type: Number })
  accessor quickId: Number

  @property()
  accessor category

  @property({ type: Object })
  accessor params

  @property({ type: Array, consumer: true })
  accessor categories: string[]

  @query('md-outlined-select')
  accessor select

  editing

  async firstRender() {
    if (this.params) {
      await this.updateView(this.params)
    }
  }

  @queryAll('[label]')
  accessor labels

  reset() {
    this.params = undefined
    for (const label of this.labels.filter((item) => item.label !== 'category')) {
      label.reset()
      if (label.placeholder) {
        label.value = label.placeholder
      }
    }
  }

  back() {
    history.back()
    this.reset()
  }

  async updateView(value) {
    const product = await firebase.get(`products/${value.edit}`)
    for (const [key, value] of Object.entries(product)) {
      const field = this.shadowRoot.querySelector(`[label=${key}]`) as MdFilledTextField | MdOutlinedSelect
      if (!field) alert(`property declared but no field found for: ${key}`)
      else if (key === 'category') {
        this.category = value
        field.select(value as string)
      } else field.value = value as string
    }
    const category = this.shadowRoot.querySelector(`[label="category"]`) as MdOutlinedSelect
    if (!category.value) {
      // @ts-ignore
      category.selectItem(category.options[0])
    }
    this.requestRender()
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
    const category = this.shadowRoot.querySelector(`[label="category"]`) as MdOutlinedSelect
    if (!category.value) {
      await category.updateComplete
      // @ts-ignore
      category.selectItem(category.options[0])
    }
  }

  async save() {
    const product = {}
    const descriptBox = this.shadowRoot.querySelector('#description') as HTMLInputElement
    const fields = Array.from(this.shadowRoot.querySelectorAll('md-outlined-text-field'))
    for (const field of fields) {
      if (field.value) product[field.label] = field.value
    }
    product['category'] = this.shadowRoot.querySelector('md-outlined-select').value
    if (descriptBox.checked) {
      product['description'] = 'needsExtra'
    }
    if (this.editing) {
      await firebase.set(`products/${this.params.edit}`, product)
      this.params = undefined
      this.editing = false
      this.back()
    } else {
      firebase.push(`products`, product)
      this.reset()
    }
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
      md-outlined-select,
      label {
        margin-top: 16px;
        width: 100%;
      }
      md-fab {
        position: absolute;
        right: 24px;
        bottom: 24px;
      }
      md-checkbox {
        margin-right: 12px;
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
        <md-outlined-text-field label="name"></md-outlined-text-field>
        <md-outlined-text-field label="price" type="number" placeholder="0"></md-outlined-text-field>
        <md-outlined-text-field label="vat" type="number" placeholder="0"></md-outlined-text-field>
        <md-outlined-select label="category">
          ${this.categories
            ? map(
                this.categories,
                (category) =>
                  html` <md-select-option value=${category} headline=${category}>${category}</md-select-option> `
              )
            : ''}
        </md-outlined-select>
        <label><md-checkbox id="description"></md-checkbox>Extra gegevens nodig?</label>
      </flex-container>

      <md-fab @click=${this.back.bind(this)} class="back"
        ><custom-icon slot="icon" icon="arrow_back"></custom-icon
      ></md-fab>
      <md-fab @click=${this.save.bind(this)}><custom-icon slot="icon">save</custom-icon></md-fab>
    `
  }
}
