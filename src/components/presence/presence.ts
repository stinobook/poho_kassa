import { LiteElement, customElement, html, property } from '@vandeurenglenn/lite'
import { StyleList, css } from '@vandeurenglenn/lite/element'

@customElement('presence-element')
export class PresenceElement extends LiteElement {
  @property() accessor group
  @property() accessor date
  

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
        flex-grow:1;
        min-width:1px;
        height: 40px;
      }
      .presence-toggle label:has(input[type=checkbox]:checked) {
        background-color: lightgreen;
      }
      .presence-toggle label.no:has(input[type=checkbox]:checked) {
        background-color: var(--md-sys-color-surface);
      }
      .presence-toggle label:first-child {
        border-radius: 25px 0 0 25px;
      }
      .presence-toggle label:last-child {
        border-radius: 0 25px 25px 0;
      }
      .presence-toggle input {
        display: none;
      }
      .presence-toggle {
        border-radius: 25px;
      }
    `
  ]


  render() {
    return html`
    <span>${this.date}</span>
    <div class="presence-toggle">
      <label class="no"><input type="checkbox" name="presence" id="no" /></label>
      ${(this.group === 'bestuur') ? 
      html`<label>
      <input type="checkbox" name="presence" id="open" />
      </label>` : '' }
      <label><input type="checkbox" name="presence" id="yes" />
      </label>
      ${(this.group === 'bestuur') ? 
      html`<label>
      <input type="checkbox" name="presence" id="close" />
      </label>` : '' }
    </div>
    `
  }
}
