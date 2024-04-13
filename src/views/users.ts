import { html, css, LiteElement, property, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/lite-elements/button.js'
import '@vandeurenglenn/lite-elements/dialog.js'
import { Member, User } from '../types.js'

@customElement('users-view')
export class UsersView extends LiteElement {
  @property({ type: Object, consumer: true })
  accessor members: { Type: Member }
  @property({ consumer: true })
  accessor users: User[]
  @query('input[label="email"]')
  accessor email: HTMLInputElement
  @property()
  accessor editUser: String

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
      flex-container{
        gap: 24px;
        align-items: stretch;
      }
      flex-row {
        background-color: var(--md-sys-color-surface-container-high);
        color: var(--md-sys-color-on-surface-container-high);
        border-radius: var(--md-sys-shape-corner-extra-large);
        padding: 20px;
        flex-wrap: wrap;
        gap: 24px;
      }
      .title {
        width: 100%;
        margin: 12px;
        font-size: 1.2em;
        font-weight: bold;
      }
      input {
        padding: 10px 0 10px 15px;
        font-size: 1rem;
        color: var(--md-sys-color-on-primary-container);
        background: var(--md-sys-color-primary-container);
        border: 0;
        border-radius: 3px;
        outline: 0;
        margin: 0 24px;
      }
      .actioninput {
        display: flex;
        flex: 1;
        & input {
          flex: 1;
        }
      }
      custom-button {
        background-color: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        height: 38px;
      }
      .userlist {
        gap: 24px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .userlist div {
        background-color: var(--md-sys-color-surface-container-highest);
        border-radius: var(--md-sys-shape-corner-extra-large);
        color: var(--md-sys-color-on-primary-container);
        padding: 12px;
      }
    `
  ]

  async sendInvite() {
    const email = this.email.value
    await firebase.sendSignInLinkToEmail(email)
    this.email.value = ''
  }

  async test() {
    console.log(this.users)
  }
  
  renderUsers() {
    return Object.values(this.users).map(
      (user) =>
        html`
          <div key=${user.key}>
            <span class="start">${user.email}</span>
            ${(user.key) ? html` <span class="end"> ${user.member} </span>`: '' }
          </div>
        `
    )
  }

  connectedCallback() {
    let dialogEdit = this.shadowRoot.querySelector('custom-dialog.dialogEdit') as HTMLDialogElement
    dialogEdit.addEventListener('close', (event) => {
      this.edit({ event })
    })
    this.shadowRoot.querySelector('.userlist').addEventListener('click', this.#clickHandler.bind(this))
  }
  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#clickHandler.bind(this))
  }

  #clickHandler = (event) => {
    const key = event.target.getAttribute('key')
    if (!key) return
    this.editUser = key
    this.requestRender()
    let dialogEdit = this.shadowRoot.querySelector('custom-dialog.dialogEdit') as HTMLDialogElement
    dialogEdit.open = true
  }

  edit({event}) {
    if (event.detail === 'cancel' || event.detail === 'close') return
  }

  render() {
    return html`
    <flex-container>
      <flex-row>
      <span class="title">Send invite</span>
      <span class="actioninput">
        <input 
          label="email"
          type="email"
          placeholder="email@domain.com"
          autocomplete="email"
          name="email" />
        <custom-button @click=${this.sendInvite.bind(this)} label="Send"></custom-button>
      </span>
      </flex-row>
      <flex-row>
        <span class="title">Userlist</span>
        <span  class="userlist">
        ${this.users ? this.renderUsers() : ''}
        </span>
      </flex-row>
      <custom-dialog class="dialogEdit">
        <span slot="title">${this.editUser}</span>
        <flex-wrap-between slot="actions">
          <custom-button action="save" label="Save"></custom-button>
        </flex-wrap-between>
      </custom-dialog>
      <custom-button @click=${this.test.bind(this)} label="test()"></custom-button>
    </flex-container>
    `
  }
}
