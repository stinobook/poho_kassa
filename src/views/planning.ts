import { html, css, LiteElement } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import 'lit-flatpickr'

@customElement('planning-view')
export class PlanningView extends LiteElement {
  static styles = [
    css`
      :host {
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `
  ]
  

  render() {
    return html`
    <lit-flatpickr
    id="my-date-picker"
    altInput
    altFormat="F j, Y"
    dateFormat="Y-m-d"
    theme="material_orange"
    minDate="2020-01"
    maxDate="2020-12-31"
  ></lit-flatpickr>
    `
  }
}
