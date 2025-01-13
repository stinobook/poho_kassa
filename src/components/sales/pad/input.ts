import { html, css, LiteElement, customElement } from '@vandeurenglenn/lite'
import '@vandeurenglenn/lite-elements/button.js'
import '@vandeurenglenn/flex-elements/wrap-evenly.js'
import './receipt.js'

@customElement('sales-input')
export class SalesInput extends LiteElement {
  connectedCallback() {
    super.connectedCallback()
    this.shadowRoot.addEventListener('click', ({ target }: CustomEvent) => {
      // @ts-ignore
      this.dispatchEvent(new CustomEvent('input-click', { detail: target.getAttribute('input-tap') }))
    })
  }

  static styles = [
    css`
      * {
        pointer-events: none;
      }
      :host {
        display: flex;
        flex-direction: column;
        height: fit-content;
        width: 100%;
        max-width: 228px;
      }

      custom-elevation {
        border-radius: var(--md-sys-shape-corner-extra-large);
      }

      flex-wrap-evenly {
        background-color: var(--md-sys-color-surface-container-high);
        border-radius: var(--md-sys-shape-corner-extra-large);
        box-sizing: border-box;
        padding: 6px 0;
        margin-bottom: 12px;
        position: relative;
      }

      custom-button {
        margin-top: 6px;
        height: 50px;
        width: 64px;
        margin-bottom: 6px;
        border-radius: var(--md-sys-shape-corner-extra-large);
        pointer-events: auto;
      }
    `
  ]

  render() {
    return html`
      <flex-wrap-evenly>
        <custom-elevation level="1"></custom-elevation>
        <custom-button
          type="filled"
          input-tap="1"
          label="1"
          >1</custom-button
        >
        <custom-button
          input-tap="2"
          type="filled"
          label="2"
          >2</custom-button
        >
        <custom-button
          input-tap="3"
          type="filled"
          label="3"
          >3</custom-button
        >
        <custom-button
          input-tap="4"
          type="filled"
          label="4"
          >4</custom-button
        >
        <custom-button
          input-tap="5"
          type="filled"
          label="5"
          >5</custom-button
        >
        <custom-button
          input-tap="6"
          type="filled"
          label="6"
          >6</custom-button
        >
        <custom-button
          input-tap="7"
          type="filled"
          label="7"
          >7</custom-button
        >
        <custom-button
          input-tap="8"
          type="filled"
          label="8"
          >8</custom-button
        >
        <custom-button
          input-tap="9"
          type="filled"
          label="9"
          >9</custom-button
        >
        <custom-button
          input-tap="+1"
          type="filled"
          label="+1"
          ><custom-typography>+1</custom-typography></custom-button
        >
        <custom-button
          input-tap="0"
          type="filled"
          label="0"
          >0</custom-button
        >

        <custom-button
          input-tap="R"
          type="filled"
          label="R"
          >R</custom-button
        >
      </flex-wrap-evenly>
    `
  }
}
