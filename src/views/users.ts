import { property, html, LiteElement, css } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lit-elements/icon-button.js'
import '@material/web/textfield/outlined-text-field.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/fab/fab.js'
import '@material/web/dialog/dialog.js'
import '@material/web/button/outlined-button.js'
import { scrollbar } from '../mixins/styles.js'

@customElement('users-view')
export class UsersView extends LiteElement {
    static styles = [
    css`
      :host {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
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

      md-outlined-text-field {
        margin-top: 4px;
        --_container-shape-start-start: 24px;
        --_container-shape-end-end: 24px;
        --_container-shape-start-end: 24px;
        --_container-shape-end-start: 24px;
        --_top-space: 4px;
        --_bottom-space: 4px;
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
    `
  ]

  render() {
    return html`
      <main>
        <flex-container>
        Users
        </flex-container>
      </main>
    `
  }
}
