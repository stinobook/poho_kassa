import { html, LiteElement, css, property, customElement } from '@vandeurenglenn/lite'
import '@vandeurenglenn/flex-elements/container.js'
import '@material/web/fab/fab.js'
import '@material/web/dialog/dialog.js'
import '@material/web/list/list-item.js'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/textfield/outlined-text-field.js'
import Router from '../routing.js'
import type { Evenement, Product } from '../types.js'
import { scrollbar } from './../mixins/styles.js'
@customElement('events-view')
export class EventsView extends LiteElement {
  @property({ consumer: true })
  accessor events: Evenement[]

  static styles = [
    css`
      * {
        pointer-events: none;
        user-select: none;
      }
      :host {
        display: flex;
        width: 100%;
        height: 100%;
        overflow-y: auto;
      }

      ${scrollbar}

      md-list-item {
        background: var(--md-sys-color-surface-container-high);
        border: 1px solid rgba(0, 0, 0, 0.34);
        border-radius: 48px;
        margin-top: 8px;
        width: 100%;
        --md-list-item-leading-space: 24px;
        cursor: pointer;
      }

      md-fab {
        position: absolute;
        right: 24px;
        bottom: 24px;
      }

      main,
      md-icon-button,
      md-fab,
      md-list-item,
      md-outlined-button {
        pointer-events: auto;
      }

      main {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        width: 100%;
        align-items: center;
      }

      md-list-item[disabled] {
        pointer-events: none;
      }
    `
  ]

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this.#clickHandler)
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#clickHandler)
  }

  #clickHandler = (event) => {
    const key = event.target.getAttribute('key')
    const action = event.target.getAttribute('action')
    if (!action) return
    this[`_${action}`](key)
  }

  _add() {
    location.hash = Router.bang('add-event')
  }

  _delete = (target) => {
    const dialog = document.querySelector('po-ho-shell').shadowRoot.querySelector('md-dialog')
    dialog.innerHTML = `
    <div slot="headline">
      Removing event
    </div>
    <form slot="content" id="delete-form" method="dialog">
      Are you sure you want to remove ${target}?
    </form>
    <div slot="actions">
      <md-outlined-button form="delete-form" value="cancel">Cancel</md-outlined-button>
      <flex-it></flex-it>
      <md-outlined-button form="delete-form" value="delete">Delete</md-outlined-button>
    </div>
    `
    const handleClose = async () => {
      if (dialog.returnValue === 'delete') {
        await firebase.remove(`events/${target}`)
      }
      dialog.removeEventListener('close', handleClose)
    }
    dialog.addEventListener('close', handleClose)
    dialog.open = true
  }

  _edit = (target) => {
    location.hash = Router.bang(`add-event?edit=${target}`)
  }

  isDisabled({ startDate, startTime }) {
    const start = new Date(`${startDate} ${startTime}`).getTime()
    if (start < new Date().getTime()) return true
    return false
  }

  didEnd({ endDate, endTime }) {
    const end = new Date(`${endDate} ${endTime}`).getTime()
    if (end < new Date().getTime()) return true
    return false
  }

  render() {
    return html`
      <main>
        <flex-container>
          ${this.events
            ? this.events.map(
                (item) => html`
                  <md-list-item action="edit" key=${item.key} ?disabled=${this.isDisabled(item)}>
                    <span slot="headline">${item.name}</span>
                    ${item.description ? html`<span slot="supporting-text">${item.description}</span>` : ''}
                    <flex-row slot="end" center>
                      ${this.didEnd(item)
                        ? html`<span class="label">ended</span>`
                        : this.isDisabled(item)
                        ? html`<span class="label">started</span>`
                        : ''}
                      ${!this.isDisabled(item)
                        ? html`
                            <md-icon-button action="delete" key=${item.key}>
                              <custom-icon icon="delete"></custom-icon>
                            </md-icon-button>
                          `
                        : ''}
                    </flex-row>
                  </md-list-item>
                `
              )
            : ''}
        </flex-container>
      </main>
      <md-fab action="add"><custom-icon slot="icon">add</custom-icon></md-fab>
    `
  }
}
