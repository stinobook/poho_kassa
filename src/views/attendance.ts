import { html, css, LitElement, CSSResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('attendance-view')
export class AttendanceView extends LitElement {
  static styles: CSSResult = css`
    :host {
    }
  `

  render() {
    return html` <p>Aanwezigheidsscherm</p> `
  }
}
