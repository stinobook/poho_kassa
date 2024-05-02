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
import '@vandeurenglenn/lite-elements/icon.js'
import '@vandeurenglenn/lite-elements/button.js'
import Router from '../routing.js'
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import { MdOutlinedSelect } from '@material/web/select/outlined-select.js'
import { scrollbar } from '../mixins/styles.js'
import './../components/image-selector-dialog.js'
import './../components/image-editor.js'
import '@vandeurenglenn/lite-elements/dialog.js'
import { Member } from '../types.js'

@customElement('add-member-view')
export class AddMemberView extends LiteElement {
  @property({ type: Object })
  accessor params

  @query('md-outlined-select')
  accessor select

  @query('image-selector-dialog')
  accessor dialog
  
  @property({ type: Array, consumer: true })
  accessor members: { [group: string]: Member[] }

  editing

  @property() accessor userphotoURL

  @property() accessor userphotobgURL

  async firstRender() {
    if (this.params) {
      await this.updateView(this.params)
    }
  }

  async willChange(propertyKey: string, value: any): Promise<any> {
    if (propertyKey === 'members') {
      const members = {}
      for (const member of value) {
        if (!members[member.group]) members[member.group] = []
        members[member.group].push(member)
      }
      return members
    }
    return value
  }

  @queryAll('[label]') accessor labels

  reset() {
    this.params = undefined
    for (const label of this.labels) {
      label.reset()
      if (label.placeholder) {
        label.value = label.placeholder
      }
    }

    this.userphotoURL = undefined
    this.userphotobgURL = undefined
    console.log(this.userphotoURL)

    this.requestRender()
  }

  back() {
    history.back()
    this.reset()
  }

  async updateView(value) {
    this.userphotoURL = undefined
    this.userphotobgURL = undefined
    const member = await firebase.get(`members/${value.edit}`)
    for (const [key, value] of Object.entries(member)) {
      if (key === 'userphotoURL' || key === 'userphotobgURL') {
        this[key] = value
      } else if (key === 'extra') {
        let extra = this.shadowRoot.querySelector('[name="extra"]') as HTMLInputElement
        extra.setAttribute('key', value)
        let member = await this.members['leden'].filter(member => member.key === value)[0]
        extra.value = member.name + ' ' + member.lastname
      } else {
        const field = this.shadowRoot.querySelector(`[name=${key}]`) as
          | MdFilledTextField
          | MdOutlinedSelect
          | HTMLImageElement
        field.value = value as string
      }
    }
    this.memberCheck()
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
    user['group'] = (this.shadowRoot.querySelector('[name="group"]') as HTMLOptionElement).value.toLowerCase()
    if (user['group'] === 'leden') user['paydate'] = (this.shadowRoot.querySelector('[name="paydate"]') as HTMLOptionElement).value.toLowerCase()
    if (user['group'] === 'leden') user['status'] = (this.shadowRoot.querySelector('[name="status"]') as HTMLOptionElement).value.toLowerCase()
    if (user['group'] === 'leden' && (this.shadowRoot.querySelector('[name="extra"]') as HTMLOptionElement).value) user['extra'] = (this.shadowRoot.querySelector('[name="extra"]') as HTMLOptionElement).getAttribute('key')
    if (this.userphotoURL) {
      // check if link
      if (this['userphotoURL'].includes?.('https') || this['userphotoURL'].includes?.('http')) {
        user['userphotoURL'] = this.userphotoURL
      } else {
        let uploadUserphoto = await firebase.uploadBytes(
          `members/${user['lastname']}${user['name']}avatar`,
          this.userphotoURL
        )
        user['userphotoURL'] = (await firebase.getDownloadURL(uploadUserphoto.ref)).replace(
          `${user['name']}avatar`,
          `${user['name']}avatar_300x300`
        )
      }
    } else {
      user['userphotoURL'] = this.shadowRoot.querySelector(`img[name="userphotoURL"]`)?.src
    }
    if (this.userphotobgURL) {
      if (this['userphotobgURL'].includes?.('https') || this['userphotobgURL'].includes?.('http')) {
        user['userphotobgURL'] = this.userphotobgURL
      } else {
        let uploadUserphotobg = await firebase.uploadBytes(
          `members/${user['lastname']}${user['name']}background`,
          this.userphotobgURL
        )
        user['userphotobgURL'] = (await firebase.getDownloadURL(uploadUserphotobg.ref)).replace(
          `${user['name']}background`,
          `${user['name']}background_300x300`
        )
      }
    } else {
      user['userphotobgURL'] = this.shadowRoot.querySelector(`img[name="userphotobgURL"]`)?.src
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
      md-select-option {
        text-transform: capitalize;
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
        width: min-content;
      }

      img {
        width: 200px;
        height: 200px;
      }

      .extra label {
        border-radius: var(--md-sys-shape-corner-extra-large);
        background-color: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        padding: 10px 24px;
        font-size: 1em;
        display: none;
        float: unset;
      }
      .extra input[type='checkbox']:checked + label {
        background-color: lightgreen;
      }
      .extra input {
        display: none;
      }
      custom-dialog {
        z-index: 1005;
      }
      .hidden {
        visibility: hidden;
      }
      custom-button {
        background-color: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        height: 75px;
        width: 98px;
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
    } else {
      this[target] = result.image.data[0]
      this.shadowRoot.querySelector(`img[name="${target}"]`).src = result.image.data[0].data
    }
  }

  async _cropImage(target: 'userphotobgURL' | 'userphotoURL') {
    const currentImage = this.shadowRoot.querySelector(`img[name="${target}"]`).src
    const editor = this.shadowRoot.querySelector('image-editor')
    const result = await editor.show(currentImage)
    console.log({ result })
    if (result?.action === 'done') {
      this.shadowRoot.querySelector(`img[name="${target}"]`).src = result.image
    }
  }
  memberCheck() {
    let memberCheck = this.shadowRoot.querySelector('[name="group"]') as HTMLOptionElement
    memberCheck.addEventListener('change', event => {
      if (memberCheck.value === 'leden') {
        (this.shadowRoot.querySelector('[name="extra"]') as HTMLElement).classList.remove('hidden');
        (this.shadowRoot.querySelector('[name="status"]') as HTMLElement).classList.remove('hidden');
        (this.shadowRoot.querySelector('[name="paydate"]') as HTMLElement).classList.remove('hidden');
        (this.shadowRoot.querySelector('[name="title"]') as HTMLElement).classList.add('hidden');
      } else {
        (this.shadowRoot.querySelector('[name="extra"]') as HTMLElement).classList.add('hidden');
        (this.shadowRoot.querySelector('[name="status"]') as HTMLElement).classList.add('hidden');
        (this.shadowRoot.querySelector('[name="paydate"]') as HTMLElement).classList.add('hidden');
        (this.shadowRoot.querySelector('[name="title"]') as HTMLElement).classList.remove('hidden');
      }
    })
  }
  connectedCallback() {
    this.shadowRoot.addEventListener('click', event => {
      if (event.target instanceof Element)
        if (event.target.getAttribute('name') === 'extra') {
          let dialogMembers = this.shadowRoot.querySelector('custom-dialog.dialogMembers') as HTMLDialogElement
          dialogMembers.open = true
        }
    })
    this.memberCheck()

    let dialogMembers = this.shadowRoot.querySelector('custom-dialog.dialogMembers') as HTMLDialogElement
    dialogMembers.addEventListener('close', event => {
      this.updateExtra({ event })
    })
  }

  updateExtra({ event }) {
    let extra = this.shadowRoot.querySelector('[name="extra"]') as HTMLInputElement
    extra.setAttribute('key', event.detail)
    let member = this.members['leden'].filter(member => member.key === event.detail)[0]
    extra.value = member.name + ' ' + member.lastname
  }

  renderMembers() {
    return Object.entries(this.members).map(([group, members]) =>
      (members?.length > 0 && group === 'leden')
        ? members.map( member =>
          html`
            <custom-button
              action=${member.key}
              .label=${member.name + ' ' + member.lastname}
              >${member.name + ' ' + member.lastname}</custom-button
            >
          `
        ) : ''
      )
  }

  render() {
    return html`
      <image-selector-dialog></image-selector-dialog>

      <flex-column class="wrapper">
        <flex-container>
          <flex-column>
            <label><custom-typography>Lid</custom-typography></label>
            ${this.userphotobgURL
              ? html`<img
                    src=${this.userphotobgURL}
                    name="userphotobgURL"
                    @click=${() => this._uploadImage('userphotobgURL')} />
                  <custom-icon-button
                    icon="crop"
                    @click=${() => this._cropImage('userphotobgURL')}></custom-icon-button>`
              : html`<custom-button
                  label="upload pet image"
                  @click=${() => this._uploadImage('userphotobgURL')}
                  ><custom-icon
                    icon="upload"
                    slot="icon"></custom-icon
                ></custom-button>`}
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
            ${this.userphotoURL
              ? html`<img
                    src=${this.userphotoURL}
                    name="userphotoURL"
                    @click=${() => this._uploadImage('userphotoURL')} />
                  <custom-icon-button
                    icon="crop"
                    @click=${() => this._cropImage('userphotoURL')}></custom-icon-button>`
              : html`<custom-button
                  label="upload owner image"
                  @click=${() => this._uploadImage('userphotoURL')}
                  ><custom-icon
                    icon="upload"
                    slot="icon"></custom-icon
                ></custom-button>`}
          </flex-column>
          <md-outlined-text-field
            label="Extra lid"
            name="extra"
            readOnly
            class="leden"
            ></md-outlined-text-field>
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
                value="bestuur"
                headline="bestuur"
                >Bestuur</md-select-option
              >
              <md-select-option
                value="instructeurs"
                headline="instructeurs"
                >Instructeurs</md-select-option
              >
              <md-select-option
                value="leden"
                headline="leden"
                >Leden</md-select-option
              >
            </md-outlined-select>
            <md-outlined-text-field
              label="Functie"
              name="title"
              ></md-outlined-text-field>
            <md-outlined-select
              label="Status"
              name="status"
              class="leden"
              >
              <md-select-option
                value="ingeschreven"
                headline="ingeschreven"
                >Ingeschreven</md-select-option
              >
              <md-select-option
                value="betaald"
                headline="betaald"
                >Betaald</md-select-option
              >
              <md-select-option
                value="nieuw"
                headline="nieuw"
                >Nieuw</md-select-option
              >
              <md-select-option
                value="inactief"
                headline="inactief"
                >Inactief</md-select-option
              >
            </md-outlined-select>
            <md-outlined-text-field 
              label="Betaaldatum" 
              name="paydate"
              type="date" 
              class="leden"
              >
            </md-outlined-text-field>
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
      <md-fab @click=${this.save.bind(this)}
        ><custom-icon
          slot="icon"
          icon="save"></custom-icon
      ></md-fab>

      <image-editor></image-editor>

      <custom-dialog class="dialogMembers">
        <span slot="title">Selecteer hoofdlid</span>
        <flex-wrap-between slot="actions"> ${this.members ? this.renderMembers() : ''} </flex-wrap-between>
      </custom-dialog>
    `
  }
}
