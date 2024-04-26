import { LiteElement, html, css, property, query, customElement } from '@vandeurenglenn/lite'
import { render } from 'lit-html'
import '@vandeurenglenn/lite-elements/dialog.js'
import '@vandeurenglenn/lite-elements/button.js'
import '@vandeurenglenn/lite-elements/icon-button.js'
import '@vandeurenglenn/lite-elements/icon.js'
import '@vandeurenglenn/lite-elements/tabs.js'
import '@vandeurenglenn/lite-elements/tab.js'
import '@vandeurenglenn/lite-elements/selector.js'
import '@vandeurenglenn/lite-elements/pages.js'

import '@material/web/textfield/outlined-text-field.js'
import '@material/web/progress/circular-progress.js'
import { DeviceApi } from './../apis/device.js'

declare type actionResult = {
  action: string
  fields: []
  image?: { data: string | { name: string; data: string }[]; type: string }
}

declare global {
  interface HTMLElementTagNameMap {
    'image-selector-dialog': ImageSelectorDialog
  }
}

@customElement('image-selector-dialog')
export class ImageSelectorDialog extends LiteElement {
  deviceApi: DeviceApi = new DeviceApi()
  @query('custom-pages')
  accessor pages

  @property({ type: Array, consumes: true })
  accessor images

  @query('custom-tabs')
  accessor selector

  @property({ type: Boolean, reflect: true })
  accessor open: boolean = false

  @property({ type: Boolean })
  accessor frontCameraDisabled: boolean = false

  @property({ type: Boolean })
  accessor rearCameraDisabled: boolean = false

  @property({ type: Boolean, attribute: 'has-library' })
  accessor hasLibrary: boolean

  @query('custom-dialog') accessor #dialog

  static styles = [
    css`
      :host {
        display: block;
      }

      h5 {
        margin: 0;
      }

      custom-tab.custom-selected {
        background: var(--md-sys-color-tertiary);
        border: none;
      }

      custom-tab.custom-selected span,
      custom-tab.custom-selected custom-icon {
        color: var(--md-sys-color-on-tertiary);
      }

      custom-tab {
        gap: 8px;
        height: 40px;
        padding: 0 12px;
        box-sizing: border-box;
        width: auto;
        border-radius: 20px;
        font: var(--_supporting-text-type);
      }

      custom-tabs {
        height: 40px;
      }

      section {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        min-height: 168px;
        position: absolute;
        transform: scale(0);
        justify-content: center;
        align-items: center;
      }

      section[route='camera'] {
        overflow-y: hidden;
      }

      section.custom-selected {
        transform: scale(1);
        position: relative;
      }
      md-outlined-text-field {
        padding-top: 12px;
      }

      .camera-actions {
        width: 100%;
        position: absolute;
        bottom: 0;
      }

      section[route='camera'] flex-container {
        height: 320px;
      }

      flex-column {
        width: auto;
      }

      flex-container video,
      img:not([data-variant='icon']) {
        height: -webkit-fill-available;
        width: -webkit-fill-available;
      }

      [route='library'] img {
        width: 150px;
        cursor: pointer;
      }

      [data-variant='icon'] {
        height: 48px;
        width: 48px;
      }

      custom-dialog {
        z-index: 1000;
      }
    `
  ]

  get #cameraPreview() {
    return this.shadowRoot.querySelector('.camera-preview')
  }

  #cameraFacingMode = 'user'
  #image: { data: string | { name: string; data: string }[]; type: string } = { data: null, type: null }

  #takePhoto = async () => {
    // this._previewEl.stop();
    // this._previewEl.srcObject = null;
    const blob = await this.deviceApi.camera.takePhoto(this.#cameraFacingMode)

    // const fd = new FormData();
    // fd.append('image', blob);

    this.#image.data = await globalThis.readAsDataURL(blob)
    this.#image.type = 'base64'

    const img = document.createElement('img')
    img.src = this.#image.data as string
    this.shadowRoot.querySelector('flex-container').replaceChild(img.cloneNode(true), this.#cameraPreview)
  }

  readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(file)
    })
  }

  #selectFile = ({}) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true

    const onchange = async event => {
      console.log({ event })

      const files = await Promise.all(
        Array.from(input.files).map(async file => {
          const data = await this.readAsDataURL(file)
          const item = document.createElement('md-list-item')
          item.headline = file.name
          item.setAttribute('noninteractive', '')
          item.innerHTML = `
          <img data-variant="icon" slot="start" src="${data}">
          <custom-icon-button slot="end"><custom-icon>delete</custom-icon></custom-icon-button>
        `
          item.onclick = () => {
            this.shadowRoot.querySelector('section[route="file"]').removeChild(item)
          }
          this.shadowRoot.querySelector('section[route="file"]').appendChild(item)
          file.data = data
          return file
        })
      )
      this.#image.data = files as { name: string; data: string }[]
      this.#image.type = 'base64[]'
      input.removeEventListener('change', onchange)
    }

    input.addEventListener('change', onchange)

    input.click()
  }

  onChange(propertyKey, value): void {
    if (propertyKey === 'open' && value) {
      this.hasLibrary ? this.select('library') : this.select('url')
    }
  }

  select(value) {
    this.selector.select(value)
  }

  #onSelected = async ({ detail }) => {
    this.shadowRoot.querySelector('custom-pages').select(detail)
    if (detail === 'camera') {
      this.frontCameraDisabled = !(await this.deviceApi.hasFrontCam())
      this.rearCameraDisabled = !(await this.deviceApi.hasBackCam())
      this.deviceApi.camera.preview(this.#cameraPreview, this.#cameraFacingMode)
    }
  }

  #onlibclick = (event, hash) => {
    this.#image.data = hash
    this.#image.type = 'library'
  }

  show() {
    this.#dialog.open = true
  }

  #addImageTemplate() {
    return html`
      <header slot="header"></header>

      <custom-tabs
        attr-for-selected="route"
        @selected=${this.#onSelected.bind(this)}>
        ${this.hasLibrary
          ? html`
              <custom-tab route="library">
                <custom-icon icon="photo_library"></custom-icon>
                <span>library</span>
              </custom-tab>
            `
          : ''}
        <custom-tab route="url">
          <custom-icon icon="link"></custom-icon>
          <span>url</span>
        </custom-tab>
        <flex-it flex="1"></flex-it>

        <custom-tab route="camera">
          <custom-icon icon="camera"></custom-icon>
          <span>camera</span>
        </custom-tab>
        <flex-it flex="1"></flex-it>

        <custom-tab route="file">
          <custom-icon icon="upload"></custom-icon>
          <span>file</span>
        </custom-tab>
        <flex-it flex="2"></flex-it>
      </custom-tabs>
      <custom-pages attr-for-selected="route">
        ${this.hasLibrary
          ? html`
              <section route="library">
                <flex-wrap-around>
                  ${this.images.map(
                    image => html`
                      <img
                        @click=${event => this.#onlibclick.call(this, event, image.firebaseKey)}
                        src=${`${location.origin}/api/image?image=${image.link.replace('.png', 'b.png')}`} />
                    `
                  )}
                </flex-wrap-around>
              </section>
            `
          : ''}
        <section route="url">
          <flex-column>
            add image using a link/url
            <md-outlined-text-field
              label="url"
              input-field="url"></md-outlined-text-field>
          </flex-column>
        </section>

        <section route="camera">
          <flex-container>
            <video
              autoplay
              mute="true"
              class="camera-preview"></video>
          </flex-container>

          <flex-row class="camera-actions">
            <flex-it flex="2"></flex-it>

            <custom-icon-button
              @click=${() => (this.#cameraFacingMode = 'user')}
              ?disabled=${this.frontCameraDisabled}
              icon="photo_camera_front">
            </custom-icon-button>

            <flex-it flex="1"></flex-it>

            <custom-icon-button
              style="transform: scale(1.66);"
              @click=${this.#takePhoto}
              icon="photo_camera">
            </custom-icon-button>

            <flex-it flex="1"></flex-it>

            <custom-icon-button
              @click=${() => (this.#cameraFacingMode = 'environment')}
              ?disabled=${this.rearCameraDisabled}
              icon="photo_camera_back">
            </custom-icon-button>

            <flex-it flex="2"></flex-it>
          </flex-row>
        </section>

        <section route="file">
          <custom-button
            type="tonal"
            label="select"
            @click=${this.#selectFile.bind(this)}>
            <custom-icon
              slot="icon"
              icon="upload"></custom-icon>
          </custom-button>
        </section>
      </custom-pages>

      <flex-row slot="actions">
        <custom-button
          action="cancel"
          label="cancel"></custom-button>
        <flex-one></flex-one>
        <custom-button
          action="submit"
          label="submit"></custom-button>
      </flex-row>
    `
  }

  onAction(): Promise<actionResult> {
    return new Promise((resolve, reject) => {
      const action = event => {
        console.log(event)

        const inputFields = Array.from(this.shadowRoot.querySelectorAll('[input-field]')) as MdFilledTextField[]
        const fields = {}

        for (const field of inputFields) {
          fields[field.label] = field.value
        }

        if (!this.#image.type) {
          const inputField = this.shadowRoot.querySelector('[input-field]') as HTMLInputElement
          this.#image.type = inputField ? 'url' : undefined
          this.#image.data = inputField?.value
        }

        const image = {
          type: this.#image.type,
          data: Array.isArray(this.#image.data) ? [...this.#image.data] : this.#image.data
        }

        resolve({ action: event.detail, fields, image })

        // @ts-ignore
        this.#dialog.removeEventListener('close', action)

        this.#image.data = null
        this.#image.type = null

        this.deviceApi.camera.close()
        render(html``, this.#dialog)
      }

      // @ts-ignore
      this.#dialog.addEventListener('close', action)
    })
  }

  #busytemplate(title, description) {
    return html`
      <flex-row slot="header">
        <h5>${title}</h5>
      </flex-row>
      <flex-column slot="content">
        <flex-column> ${description} </flex-column>

        <flex-row style="justify-content: center; width: 100%;">
          <md-circular-progress indeterminate></md-circular-progress>
        </flex-row>
      </flex-column>
    `
  }
  async addImage() {
    render(this.#addImageTemplate(), this.#dialog)
    this.show()
    return this.onAction()
  }

  async busy(title, description?) {
    render(this.#busytemplate(title, description), this.#dialog)
    this.show()
  }

  close() {
    this.#dialog.open = false
  }

  render() {
    return html` <custom-dialog .open=${this.open}></custom-dialog> `
  }
}
