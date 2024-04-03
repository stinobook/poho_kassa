import { html, css, LiteElement } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'

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
      <h1>Work in progress...</h1>
    `
  }
}
