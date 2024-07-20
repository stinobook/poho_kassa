import { html, LiteElement, property, customElement, css } from '@vandeurenglenn/lite'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/column.js'
import '@material/web/button/filled-button.js'
import '@vandeurenglenn/lite-elements/tabs.js'
import '@vandeurenglenn/lite-elements/selector.js'
import '@vandeurenglenn/lite-elements/icon-button.js'
import '@vandeurenglenn/lite-elements/icon.js'
import '@material/web/textfield/outlined-text-field.js'
import '@material/web/dialog/dialog.js'
import '@material/web/button/outlined-button.js'
import { Member } from '../types.js'
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'

@customElement('files-view')
export class FilesView extends LiteElement {
  @property({ type: Array, consumer: true }) accessor members: { Type: Member[] }
  @property({ type: Object, consumer: true }) accessor files
  @property({ type: Object,}) accessor filesOfGroup: {}
  @property({ type: Array,}) accessor categories: string[]

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        align-items: center;
        border-radius: var(--md-sys-shape-corner-extra-large);
        overflow-y: auto;
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
      .download,
      .upload {
        transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
        transform: translatex(0%);
        z-index: 0;
        opacity: 1;
        position: absolute;
        top: 60px;
      }
      .toggle {
        transform: translatex(300%);
        z-index: 1;
        opacity: 0;
        position: absolute;
      }
      .card {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        background-color: var(--md-sys-color-surface-container-high);
        color: var(--md-sys-color-on-surface-container-high);
        border-radius: var(--md-sys-shape-corner-extra-large);
        gap: 12px;
        box-sizing: border-box;
        padding: 12px;
        margin-top: 12px;
      }
      input, select {
        padding: 10px 10px 10px 15px;
        font-size: 1rem;
        color: var(--md-sys-color-on-secondary);
        background: var(--md-sys-color-secondary);
        border: 0;
        border-radius: 3px;
        outline: 0;
        margin-left: 24px;
        box-sizing: border-box;
        float:right;
        width: 70%;
      }
      label {
        float: left;
        width: 100%;
        padding: 4px 12px;
        margin-right: 12px;
        font-size: 1rem;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }
      #errortext {
        color: var(--md-sys-color-error);
        font-weight: bold;
      }
      .title {
        width: 100%;
        margin: 12px;
        font-size: 1.2em;
        font-weight: bold;
      }
      md-list-item {
        background: var(--md-sys-color-surface-container-high);
        border: 1px solid rgba(0, 0, 0, 0.34);
        border-radius: 48px;
        margin-top: 8px;
        width: 100%;
        --md-list-item-leading-space: 24px;
        cursor: pointer;
      }
    `
  ]

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this._onclick.bind(this))
  }

  async onChange(propertyKey: any, value: any) {
    console.log({ propertyKey, value })
    
    if (propertyKey === 'files') {
      let group = firebase.userDetails.group
      this.filesOfGroup = Object.values(this.files[group])
      this.categories = Object.keys(this.files[group])
    }
  }
  
  async select(selected) {
    let download = this.shadowRoot.querySelector('.download') as HTMLElement
    let upload = this.shadowRoot.querySelector('.upload') as HTMLElement
    if (selected.detail === 'download') {
      download.classList.remove('toggle')
      upload.classList.add('toggle')
    } else {
      download.classList.add('toggle')
      upload.classList.remove('toggle')
    }
  }
  async _onclick(event) {
    const target = event.target as HTMLElement
    const action = target.getAttribute('action')
    if (action === 'upload') {
      this.Upload()
    }
  }

  async Upload() {
    this.shadowRoot.querySelector('#errortext').innerHTML = ""
    let title = this.shadowRoot.querySelector('[name="filename"]') as HTMLInputElement
    let file = this.shadowRoot.querySelector('[name="file"]') as HTMLInputElement
    let category = this.shadowRoot.querySelector('select').value
    if (category === 'new') category = await prompt('Naam categorie?').replace(/ /g, '_').toLowerCase()
    if (!title.value || !file.files[0]) {
      this.shadowRoot.querySelector('#errortext').innerHTML = "Bestand of naam ontbreekt!"
    } else {
      let fileData = {
        group: firebase.userDetails.group,
        title: title.value,
        date: new Date()
      }
      let fileKey = await firebase.push('files/' + firebase.userDetails.group + '/' + category, fileData)
      let uploadFile = await firebase.uploadBytes(
        firebase.userDetails.group + '/' + category + '/' + fileKey, file.files[0]
      )
      let fileURL = await firebase.getDownloadURL(uploadFile.ref)
      await firebase.set('files/' + firebase.userDetails.group + '/' + category + '/' + fileKey + '/fileURL', fileURL)
    }
  }

  renderFiles() {
    
  }
  
  render() {
    return html`
      <flex-container>
        <custom-tabs
          attr-for-selected="page"
          @selected=${this.select.bind(this)}>
          <custom-tab page="download">Downloaden</custom-tab>
          ${this.filesOfGroup ? this.renderFiles() : ''}
          <custom-tab page="upload">Uploaden</custom-tab>
        </custom-tabs>
        <flex-container class="download">
        </flex-container>
        <flex-container class="upload toggle">
          <flex-row class="card">
          <span class='title'>Bestand uploaden</span>
          <label>
            Categorie
            <select>
              ${this.categories ? this.categories.map((category) =>
                html`<option value=${category}>${category.replace(/_/g, ' ')}</option>`
              ) : ''}
              <option value='new'>Nieuwe categorie toevoegen</option>
            </select>
          </label>
          <label
            >Naam<input
              type="text"
              name="filename"
          /></label>
          <label
            >Bestand<input
              type="file"
              name="file"
          /></label>
            <span id="errortext"></span>
            <md-filled-button action="upload">Uploaden</md-filled-button>
          </flex-row>
        </flex-container>
      </flex-container>
    `
  }
}
