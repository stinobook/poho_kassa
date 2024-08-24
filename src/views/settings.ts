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
import { MdOutlinedSelect } from '@material/web/select/outlined-select.js'
import { MdSlider } from '@material/web/slider/slider.js'

@customElement('settings-view')
export class SettingsView extends LiteElement {
  @property({ consumes: 'user' }) accessor user

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
      flex-container {
        gap: 12px;
      }

      md-filled-button {
        height: var(--sales-input-height, 64px);
        font-size: var(--sales-input-font-size, 0.95em);
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
      }
    `
  ]

  #setSetting(name, value) {
    firebase.set(`users/${firebase.auth.currentUser.uid}/${name}`, value)
  }

  firstRender(): void {
    this.shadowRoot.addEventListener('change', event => {
      if (event.target instanceof MdOutlinedSelect) {
        const name = event.target.getAttribute('name')
        this.#setSetting(name, event.target.value)
      } else if (event.target instanceof MdSlider) {
        this.onSalesInputButtonSizeChange(event.target.value)
      }
    })
  }

  onSalesInputButtonSizeChange(value) {
    resizeSalesInputButton(value)
    this.#setSetting('salesInputButtonSize', value)
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
        <custom-typography><h2>Instellingen</h2></custom-typography>
        <section>
          <flex-row center class='card'>
            <custom-typography size="medium">Verkoopscherm knop grootte</custom-typography>
            <flex-it></flex-it>
            <md-slider
              @change=${this.onSalesInputButtonSizeChange.bind(this)}
              @input=${this.onSalesInputButtonSizeInput.bind(this)}
              labeled
              ticks
              step="5"
              value=${this.user?.salesInputButtonSize || 0}></md-slider>
              <md-filled-button>Voorbeeld</md-filled-button>
          </flex-row>

        </section>
        <section>
          <flex-row center class='card'>
            <custom-typography size="medium">Standaardpagina bij openen app</custom-typography>
            <flex-it></flex-it>
            <md-outlined-select
              name="defaultpage"
              value=${this.user?.defaultpage}>
              ${this.user?.userRoles.map(role => html` <md-select-option value=${role}>${role}</md-select-option> `)}
            </md-outlined-select>
          </flex-row>
        </section>
      </flex-container>
    `
  }
}
