import { LiteElement, customElement, html, property } from '@vandeurenglenn/lite'
import { TemplateResult } from 'lit-html'
import '@material/web/slider/slider.js'
import '@material/web/button/filled-button.js'
import { StyleList, css } from '@vandeurenglenn/lite/element'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/it.js'
import '@vandeurenglenn/flex-elements/row.js'

const defaultSalesInputSizes = {
  height: 64,
  minmax: '196px',
  fontSize: 0.95
}

const maxSalesInputSizes = {
  height: 86,
  minmax: '250px',
  fontSize: 1.3
}

const calculateSalesInputButtonSize = value => {
  const heightRange = maxSalesInputSizes.height - defaultSalesInputSizes.height
  const fontSizeRange = maxSalesInputSizes.fontSize - defaultSalesInputSizes.fontSize

  const height = heightRange * (value / 100)
  const fontSize = fontSizeRange * (value / 100)

  return { height, fontSize }
}

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
      flex-row {
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
  }

  onChange(propertyKey) {
    if (propertyKey === 'salesInputButtonSize') {
      this.onSalesInputButtonSizeChange()
    }
  }

  onSalesInputButtonSizeChange() {
    const value = this.shadowRoot.querySelector('md-slider').value
    const { height, fontSize } = calculateSalesInputButtonSize(value)

    document.body.style.setProperty('--sales-input-height', `${defaultSalesInputSizes.height + height}px`)
    document.body.style.setProperty('--sales-input-font-size', `${defaultSalesInputSizes.fontSize + fontSize}em`)
    localStorage.setItem('settings', JSON.stringify({ salesInputButtonSize: value }))
  }

  onSalesInputButtonSizeInput() {
    const value = this.shadowRoot.querySelector('md-slider').value
    const { height, fontSize } = calculateSalesInputButtonSize(value)

    this.style.setProperty('--sales-input-height', `${defaultSalesInputSizes.height + height}px`)
    this.style.setProperty('--sales-input-font-size', `${defaultSalesInputSizes.fontSize + fontSize}em`)
  }

  render(): TemplateResult<1> {
    return html`
      <flex-container>
        <h4>settings</h4>
        <section>
          <flex-row center>
            <strong>sales input button size</strong>
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
      </flex-container>
    `
  }
}
