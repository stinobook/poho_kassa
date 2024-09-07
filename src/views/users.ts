import { html, css, LiteElement, property, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/lite-elements/button.js'
import '@vandeurenglenn/lite-elements/dialog.js'
import { Member, User } from '../types.js'
import { scrollbar } from '../mixins/styles.js'

@customElement('users-view')
export class UsersView extends LiteElement {
  @property({ type: Object, consumer: true }) accessor members: { Type: Member }

  @property({ consumer: true }) accessor users: User[]
  @property({ consumer: true }) accessor roles

  @query('input[label="email"]') accessor email: HTMLInputElement

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
      flex-container {
        gap: 24px;
        align-items: stretch;
        overflow-y: auto;
        max-width: 100%;
        min-width: 100%;
        width: 100%;
      }
      ${scrollbar}
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
      .end {
        float: right;
      }
      .userlist span {
        pointer-events: none;
      }
      .rolesselector {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        gap: 12px;
      }
      .rolesselector label {
        border-radius: var(--md-sys-shape-corner-extra-large);
        background-color: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        padding: 10px 24px;
      }
      .rolesselector input[type=checkbox]:checked + label {
        background-color: lightgreen;
      }
      .rolesselector input {
        display: none;
    }
      .subheading {
        font-weight: var(--md-sys-typescale-title-medium-font-weight);
        font-size: var(--md-sys-typescale-title-medium-font-size);
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 12px;
      }
    `
  ]

  async sendInvite() {
    const email = this.email.value
    await firebase.sendSignInLinkToEmail(email)
    this.email.value = ''
  }

  renderMembers() {
    return Object.values(this.members).map(
      (member) =>
        html`
          <option value=${member.key}>${member.name + ' ' + member.lastname}</option>
        `
    )
  }
  renderRoles() {
    return this.roles.map((role) =>
    html`
    <input type="checkbox" name="roles" id=${role} />
    <label for=${role}>${role}</label>
    `)
  }

  renderUsers() {
    return Object.values(this.users).map(
      user =>
        html`
          <div key=${user.key}>
            <span class="start">${user.email}</span>
            ${(user.key) ? html` <span class="end"> ${ (user?.member && user?.member !== 'kassa') ?
              Object.values(this.members).filter((member) => member.key === user.member)[0]?.name + ' ' + 
              Object.values(this.members).filter((member) => member.key === user.member)[0]?.lastname
              : ''
            } </span>`: '' }
            ${(user.key) ? html` <span class="end"> ${ (user?.member && user?.member === 'kassa') ? 'Kassa' : ''} </span>`: '' }
            ${(user.key) ? html` <span class="end"> ${ (!user?.member) ? 'Unlinked' : ''} </span>`: '' }
          </div>
        `
    )
  }

  connectedCallback() {
    let dialogEdit = this.shadowRoot.querySelector('custom-dialog.dialogEdit') as HTMLDialogElement
    dialogEdit.addEventListener('close', event => {
      this.edit({ event })
    })
    this.shadowRoot.querySelector('.userlist').addEventListener('click', this.#clickHandler.bind(this))
  }
  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#clickHandler.bind(this))
  }

  #clickHandler = event => {
    const key = event.target.getAttribute('key')
    if (!key) return
    this.editUser = key
    let dialogEdit = this.shadowRoot.querySelector('custom-dialog.dialogEdit') as HTMLDialogElement
    let selected = this.shadowRoot.querySelector('.memberselector') as HTMLSelectElement
    this.shadowRoot.querySelectorAll('input[name=roles]:checked').forEach((checkbox) => checkbox.removeAttribute('checked'))
    let member = this.users.filter(user => user.key === this.editUser)[0].member
    if (member) selected.value = member
    let roles = Object.keys(this.users.filter(user => user.key === this.editUser)[0].roles || {})
    if (roles) {
      for (const role of roles) {
        const roleID = this.shadowRoot.querySelector('#' + role) as HTMLInputElement
        if (roleID) roleID.setAttribute('checked', '')
      }
    }
    dialogEdit.open = true
    this.requestRender()
  }

  edit({ event }) {
    if (event.detail === 'cancel' || event.detail === 'close') return
    let selected = this.shadowRoot.querySelector('.memberselector') as HTMLSelectElement
    const updates = {}
    updates['member'] = selected.value
    updates['roles'] = (Array.from(this.shadowRoot.querySelectorAll(`input[name=roles]:checked`)).map(check => check.id)).reduce((m, v) => (m[v] = true, m), {})
    firebase.update('users/' + this.editUser, updates)
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
        <span slot="title">${this.editUser ? this.users.filter(user => user.key === this.editUser)[0].email : ''}</span>
        <span class="subheading">Link with user:
          <select class="memberselector">
            <option value='kassa'>Kassa</option>
          ${this.members ? this.renderMembers() : ''}
          </select>
        </span>
        <span class="subheading">Roles:
          <div class="rolesselector">
          ${this.roles ? this.renderRoles() : ''}
          </div>
        </span>
        <flex-wrap-between slot="actions">
          <custom-button action="save" label="Save"></custom-button>
        </flex-wrap-between>
      </custom-dialog>
    </flex-container>
    `
  }
}
