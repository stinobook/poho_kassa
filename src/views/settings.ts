import { LiteElement, customElement, html, property } from '@vandeurenglenn/lite'
import { TemplateResult } from 'lit-html'
import '@material/web/slider/slider.js'
import '@material/web/button/filled-button.js'
import { StyleList, css } from '@vandeurenglenn/lite/element'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/it.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@material/web/select/outlined-select.js'
import '@material/web/select/select-option.js'
import '@vandeurenglenn/lite-elements/typography.js'
import { calculateSalesInputButtonSize, resizeSalesInputButton } from '../utils/resize-sales-input-button.js'

@customElement('settings-view')
export class SettingsView extends LiteElement {
  @property({ type: Number }) accessor salesInputButtonSize

  static styles?: StyleList = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      h4 {
        margin-bottom: 74px;
      }
      flex-row,
      section {
        width: 100%;
      }

      md-filled-button {
        height: var(--sales-input-height, 64px);
        font-size: var(--sales-input-font-size, 0.95em);
      }
    `
  ]

  connectedCallback() {
    let settings = localStorage.getItem('settings')
    if (settings) {
      settings = JSON.parse(settings)
      for (const [key, value] of Object.entries(settings)) {
        this[key] = value
      }
    } else {
      this.salesInputButtonSize = 0
    }
    this.shadowRoot.addEventListener('change', event => {
      if ((event.target as HTMLSelectElement).id === 'setting.defaultpage') {
        firebase.set(
          'users/' + firebase.auth.currentUser.uid + '/defaultpage',
          (event.target as HTMLSelectElement).value
        )
      }
    })
    if (firebase.userDefaultPage)
      (this.shadowRoot.getElementById('setting.defaultpage') as HTMLSelectElement).value = firebase.userDefaultPage
  }

  onChange(propertyKey) {
    if (propertyKey === 'salesInputButtonSize') {
      this.onSalesInputButtonSizeChange()
    }
  }

  onSalesInputButtonSizeChange() {
    const value = this.shadowRoot.querySelector('md-slider').value
    resizeSalesInputButton(value)
    localStorage.setItem('settings', JSON.stringify({ salesInputButtonSize: value }))
  }

  onSalesInputButtonSizeInput() {
    const value = this.shadowRoot.querySelector('md-slider').value
    const { height, fontSize } = calculateSalesInputButtonSize(value)

    this.style.setProperty('--sales-input-height', `${height}px`)
    this.style.setProperty('--sales-input-font-size', `${fontSize}em`)
  }

  render(): TemplateResult<1> {
    return html`
      <flex-container>
        <custom-typography>settings</custom-typography>
        <section>
          <flex-row center>
            <custom-typography size="medium">sales input button size</custom-typography>
            <flex-it></flex-it>
            <md-slider
              @change=${this.onSalesInputButtonSizeChange.bind(this)}
              @input=${this.onSalesInputButtonSizeInput.bind(this)}
              labeled
              ticks
              step="5"
              value=${this.salesInputButtonSize}></md-slider>
          </flex-row>

          <md-filled-button>neuzeke</md-filled-button>
        </section>
        <section>
          <flex-row center>
            <custom-typography size="medium">Default page</custom-typography>
            <flex-it></flex-it>
            <md-outlined-select
              name="setting.defaultpage"
              id="setting.defaultpage">
              ${firebase.userRoles.map(role => html` <md-select-option value=${role}>${role}</md-select-option> `)}
            </md-outlined-select>
          </flex-row>
        </section>
      </flex-container>
    `
  }
}
