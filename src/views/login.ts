import { html, css, LiteElement } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/textfield/outlined-text-field.js'
import '@vandeurenglenn/lit-elements/typography.js'

@customElement('login-view')
export class LoginView extends LiteElement {
  static styles = [
    css`
      :host {
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        display: block;
      }
      flex-container {
        background-color: var(--md-sys-color-surface-variant);
        max-width: fit-content;
        max-height: 420px;
        min-width: auto;
        border-radius: var(--md-sys-shape-corner-extra-large);
        box-sizing: border-box;
        padding: 16px 32px;
      }

      md-outlined-text-field {
        margin-bottom: 16px;
        --md-outlined-text-field-container-shape: var(--md-sys-shape-corner-large);
      }

      flex-row {
        margin-top: 24px;
        width: 100%;
      }
      h3,
      h4 {
        margin-top: 0;
        text-align: center;
        width: 100%;
        margin-bottom: 8px;
      }

      h4 {
        margin-bottom: 24px;
      }
    `
  ]

  render() {
    return html`
      <flex-container>
        <h3><custom-typography>Welcome Back</custom-typography></h3>
        <custom-typography size="medium"><h4>Login To Continue</h4></custom-typography>
        <md-outlined-text-field label="email" type="email" placeholder="email@domain.com"> </md-outlined-text-field>
        <md-outlined-text-field label="password" type="password"> </md-outlined-text-field>

        <flex-row>
          <md-outlined-button>cancel</md-outlined-button>
          <flex-it></flex-it>
          <md-filled-button>login</md-filled-button>
        </flex-row>
      </flex-container>
    `
  }
}