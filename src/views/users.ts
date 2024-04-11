import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import { Member } from '../types.js'

@customElement('users-view')
export class UsersView extends LiteElement {
  @property({ type: Array, consumer: true })
  accessor members: Member[]

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
    <flex-container>
 start userpage
    </flex-container>
    `
  }
}
