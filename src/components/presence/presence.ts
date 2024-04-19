import { LiteElement, customElement, html, property } from '@vandeurenglenn/lite'
import { StyleList, css } from '@vandeurenglenn/lite/element'
import '@vandeurenglenn/lite-elements/icon.js'

@customElement('presence-element')
export class PresenceElement extends LiteElement {
  @property() accessor group
  @property() accessor date
  @property() accessor presence
  

  static styles?: StyleList = [
    css`
      :host {
        display: flex;
        align-items: center;
        height: 74px;
        border-radius: var(--md-sys-shape-corner-extra-large);
        min-width: max-content;
        pointer-events: auto !important;
        cursor: pointer;
        align-items: center;
        box-sizing: border-box;
        padding: 12px;
        flex: 1;
      }
      custom-icon {
        pointer-events: none;
      }

      custom-typography {
        display: flex;
      }
      span {
        flex-grow: 1;
      }
      .presence-toggle {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        width: 40%;
      }
      .presence-toggle {
        background-color: var(--md-sys-color-surface-container-highest);
      }
      .presence-toggle label {
        color: var(--md-sys-color-primary);
        display: flex;
        flex-grow:1;
        min-width:1px;
        height: 40px;
        align-items: center;
        justify-content: center;
        --custom-icon-color: var(--md-sys-color-on-surface-variant);
      }
      .presence-toggle label:has(input:checked):where(:has(+ label input:checked)) {
        background-color: lightgreen;
      }
      .presence-toggle label.no:has(input[type=checkbox]:checked) {
        background-color: var(--md-sys-color-on-surface-variant);
      }
      .presence-toggle label:first-child:has(input:checked), 
      .presence-toggle label:has(input:not(:checked)) + label:has(input:checked) {
        background: lightgreen;
        border-top-left-radius: 25px;
        border-bottom-left-radius: 25px;
      }
      .presence-toggle label:last-child:has(input:checked),
      .presence-toggle label:has(input:checked):not(:has(+ label input:checked)) {
        background: lightgreen;
        border-top-right-radius: 25px;
        border-bottom-right-radius: 25px;
      }

      .presence-toggle input {
        display: none;
      }
      .presence-toggle {
        border-radius: 25px;
      }
    `
  ]

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this.#clickHandler)
  }
  
  #clickHandler = event => {
    if (event.target.hasAttribute('id')) {
      const [day, month, year] = this.date.split('-')
      let presence:any = Array.from(this.shadowRoot.querySelectorAll('input[type=checkbox]:checked'))
      if (event.target.getAttribute('id') === 'no') {
        presence.forEach((checkbox) => {
          (checkbox.id !== 'no') ? checkbox.checked = false : ''
        }
        )
      } else {
        presence.forEach((checkbox) => {
          (checkbox.id === 'no') ? checkbox.checked = false : ''
        }
        )
      }
      this.presence = presence.map(checked => checked.id)
      const detail = {
        day,
        year,
        month,
        presence: this.presence
      }
      document.dispatchEvent(
        new CustomEvent('presence-change', {
          detail
        })
      )
    }
  }

  render() {
    return html`
    <span>${new Date(this.date).toLocaleString('nl-BE', { weekday: 'long', day: 'numeric' })}</span>
    <div class="presence-toggle">
      <label class="no">
        <custom-icon icon="location_off"></custom-icon>
        <input type="checkbox" name="presence" id="no" />
      </label>
      ${(this.group === 'bestuur') ? 
      html`<label>
        <custom-icon icon="lock_open"></custom-icon>
        <input type="checkbox" name="presence" id="open" />
      </label>` : '' }
      <label>
        <custom-icon icon="location_on"></custom-icon>
        <input type="checkbox" name="presence" id="yes" />
      </label>
      ${(this.group === 'bestuur') ? 
      html`<label>
        <custom-icon icon="lock"></custom-icon>
        <input type="checkbox" name="presence" id="close" />
      </label>` : '' }
    </div>
    `
  }
}