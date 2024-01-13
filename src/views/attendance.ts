import { html, css, LitElement, CSSResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@material/web/list/list.js'

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
