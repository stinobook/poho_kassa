import { html, css, LiteElement, property, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/textfield/outlined-text-field.js'
import '@vandeurenglenn/lite-elements/typography.js'
import { Member } from '../types.js'
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'

@customElement('users-view')
export class UsersView extends LiteElement {
  @property({ type: Object, consumer: true })
  accessor members: { Type: Member }
  @query('md-outlined-text-field[label="email"]')
  accessor email: MdOutlinedTextField

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

  async sendInvite() {
    const email = this.email.value
    await firebase.sendSignInLinkToEmail(email)
    this.cancel()
  }

  cancel() {
    this.email.value = null
  }

  async test() {
    let option = this.shadowRoot.querySelector('select') as HTMLSelectElement
    console.log(option.value)
    console.log(firebase.auth)
  }

  renderMembers() {
    return Object.values(this.members).map(
      (member) =>
        html`
          <option value=${member.key}>${member.name + ' ' + member.lastname}</option>
        `
    )

  }

  render() {
    return html`
    <flex-container>
      <custom-typography size="medium"><h4>Register</h4></custom-typography>
      <form>
        <h1>Link with user:</h1>
        <select>
        ${this.members ? this.renderMembers() : ''}
        </select>
        <md-outlined-text-field
          label="email"
          type="email"
          placeholder="email@domain.com"
          autocomplete="email"
          name="email"
        >
        </md-outlined-text-field>
      </form>
      <flex-row>
        <md-outlined-button @click=${this.cancel.bind(this)}>cancel</md-outlined-button>
        <flex-it></flex-it>
        <md-filled-button @click=${this.sendInvite.bind(this)}>Send</md-filled-button>

        <md-filled-button @click=${this.test.bind(this)}>test</md-filled-button>
      </flex-row>
    </flex-container>
    `
  }
}
