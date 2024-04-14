import { html, LiteElement, css, property, query, queryAll, customElement } from '@vandeurenglenn/lite'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lite-elements/typography.js'
import '@material/web/fab/fab.js'
import '@material/web/select/outlined-select.js'
import '@material/web/textfield/outlined-text-field.js'
import '@material/web/select/select-option.js'
import '@material/web/checkbox/checkbox.js'
import '@vandeurenglenn/flex-elements/wrap-between.js'
import '@vandeurenglenn/flex-elements/it.js'
import Router from '../routing.js'
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import { MdOutlinedSelect } from '@material/web/select/outlined-select.js'
import { scrollbar } from '../mixins/styles.js'

import './../components/image-selector-dialog.js'
@customElement('add-member-view')
export class AddMemberView extends LiteElement {
  @property({ type: Object })
  accessor params

  @query('md-outlined-select')
  accessor select

  @query('image-selector-dialog')
  accessor dialog

  editing

  userphotoURL

  userphotobgURL

  async firstRender() {
    if (this.params) {
      await this.updateView(this.params)
    }
  }

  @queryAll('[label]') accessor labels

  reset() {
    this.params = undefined
    for (const label of this.labels.filter(item => item.label)) {
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
    const member = await firebase.get(`members/${value.edit}`)
    for (const [key, value] of Object.entries(member)) {
      const field = this.shadowRoot.querySelector(`[name=${key}]`) as
        | MdFilledTextField
        | MdOutlinedSelect
        | HTMLImageElement
      if (!field) alert(`property declared but no field found for: ${key}`)
      else {
        if (field.tagName === 'IMG') {
          field.src = value
        } else field.value = value as string
      }
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

  async save() {
    const user = {}

    const fields = Array.from(this.shadowRoot.querySelectorAll('md-outlined-text-field'))
    for (const field of fields) {
      if (field.value) user[field.name] = field.value
    }
    user['group'] = this.shadowRoot.querySelector('md-outlined-select').value
    if (this.userphotoURL) {
      // check if link
      if (typeof this['userphotoURL'] === 'string') {
        user['userphotoURL'] = this.userphotoURL
      } else {
        let uploadUserphoto = await firebase.uploadBytes(
          `members/${user['lastname'] + user['name']}avatar`,
          this.userphotoURL
        )
        user['userphotoURL'] = await firebase.getDownloadURL(uploadUserphoto.ref)
      }
    } else {
      user['userphotoURL'] = this.shadowRoot.querySelector(`img[name="userphotoURL"]`).src
    }
    if (this.userphotobgURL) {
      if (typeof this['userphotobgURL'] === 'string') {
        user['userphotobgURL'] = this.userphotobgURL
      } else {
        let uploadUserphotobg = await firebase.uploadBytes(
          `members/${user['lastname'] + user['name']}background`,
          this.userphotobgURL
        )
        user['userphotobgURL'] = await firebase.getDownloadURL(uploadUserphotobg.ref)
      }
    } else {
      user['userphotobgURL'] = this.shadowRoot.querySelector(`img[name="userphotobgURL"]`).src
    }
    if (this.editing) {
      await firebase.set(`members/${this.params.edit}`, user)
      this.params = undefined
      this.editing = false
      this.back()
    } else {
      if (!user['userphotobgURL'] || !user['userphotoURL']) {
        alert('Picture missing!')
        return
      }
      firebase.push(`members`, user)
      this.back()
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
      flex-column {
        width: auto;
      }
      flex-column.wrapper {
        overflow-y: auto;
        width: 100%;
        align-items: center;
      }
      md-outlined-text-field,
      md-outlined-select,
      label,
      span {
        margin-top: 16px;
      }
      md-fab {
        position: absolute;
        right: 24px;
        bottom: 24px;
      }
      md-checkbox {
        margin-right: 12px;
      }

      ${scrollbar}
      .back {
        left: 24px;
        right: 0;
      }

      img {
        width: 200px;
        height: 200px;
      }
    `
  ]
  add() {
    location.hash = Router.bang('add-member')
  }

  async _uploadImage(target: 'userphotobgURL' | 'userphotoURL') {
    const result = await this.dialog.addImage()
    if (result.fields.url.length > 0) {
      this[target] = result.fields.url
    } else if (result.image) {
      this[target] = result.image.data[0].data
    }
    this.shadowRoot.querySelector(`img[name="${target}"]`).src = this[target]
  }

  render() {
    return html`
      <image-selector-dialog></image-selector-dialog>

      <flex-column class="wrapper">
        <flex-container>
          <flex-column>
            <label><custom-typography>Lid</custom-typography></label>
            <img
              name="userphotobgURL"
              @click=${() => this._uploadImage('userphotobgURL')} />
          </flex-column>
          <flex-wrap-between>
            <md-outlined-text-field
              label="Geboortedatum"
              type="date"
              name="birthday"></md-outlined-text-field>

            <md-outlined-text-field
              label="naam"
              name="dogname"></md-outlined-text-field>
            <md-outlined-text-field
              label="ras"
              name="dograce"></md-outlined-text-field>

            <md-outlined-text-field
              label="Stamboomnummer"
              name="pedigree"></md-outlined-text-field>
            <md-outlined-text-field
              label="Chipnummer"
              name="chipnumber"></md-outlined-text-field>
          </flex-wrap-between>

          <flex-column>
            <label><custom-typography>Baasje</custom-typography></label>
            <img
              name="userphotoURL"
              @click=${() => this._uploadImage('userphotoURL')} />
          </flex-column>

          <flex-wrap-between>
            <md-outlined-text-field
              label="Voornaam"
              name="name"
              required></md-outlined-text-field>
            <md-outlined-text-field
              label="Naam"
              name="lastname"
              required></md-outlined-text-field>

            <md-outlined-select
              label="Groep"
              name="group"
              required>
              <md-select-option
                value="Bestuur"
                headline="bestuur"
                >Bestuur</md-select-option
              >
              <md-select-option
                value="Instructeurs"
                headline="instructeurs"
                >Instructeurs</md-select-option
              >
              <md-select-option
                value="Leden"
                headline="leden"
                >Leden</md-select-option
              >
            </md-outlined-select>
            <md-outlined-text-field
              label="Functie"
              name="title"
              required></md-outlined-text-field>
            <md-outlined-text-field
              label="Straat + huisnummer"
              name="street"></md-outlined-text-field>

            <md-outlined-text-field
              label="Gemeente"
              name="community"></md-outlined-text-field>
            <md-outlined-text-field
              label="Postcode"
              name="postalcode"></md-outlined-text-field>

            <md-outlined-text-field
              label="Telefoonnummer"
              name="phone"></md-outlined-text-field>
            <md-outlined-text-field
              label="E-mail adres"
              name="email"></md-outlined-text-field>
          </flex-wrap-between>
        </flex-container>
      </flex-column>

      <md-fab
        @click=${this.back.bind(this)}
        class="back"
        ><custom-icon
          slot="icon"
          icon="arrow_back"></custom-icon
      ></md-fab>
      <md-fab @click=${this.save.bind(this)}><custom-icon slot="icon">save</custom-icon></md-fab>
    `
  }
}
