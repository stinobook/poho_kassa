import { property, html, LiteElement, css } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/wrap-center.js'
import '@vandeurenglenn/flex-elements/column.js'
import { scrollbar } from '../mixins/styles.js'

@customElement('attendance-view')
export class AttendanceView extends LiteElement {
  static styles = [
    css`
      :host {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      main {
        width: 100%;
        overflow-y: auto;
        padding: 12px;
      }

      ${scrollbar}

      flex-wrap-center {
        width: 100%;
        gap: 24px;
      }
      flex-column {
        width: 100%;
      }

      .card {
        position: relative;
        display: inline-flex;
        align-items: center;
        height: 75px;
        flex: 1;
        border-radius: 50px var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) 50px;
        box-shadow: 0 15px 10px -10px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3),
          0 0 40px rgba(0, 0, 0, 0.1) inset;
        background: var(--md-sys-color-error-container);
        color: var(--md-sys-color-on-error-container);
        min-width: max-content;
      }

      .user-photo {
        position: relative;
        height: 65px;
        width: 65px;
        border-radius: 50%;
        border: 5px solid rgba(0,0,0,0);
        background: no-repeat;
        background-size: contain;
        overflow: hidden;
        object-fit: cover;
        flex-shrink: 0;
        margin-right: 12px;
      }

    `
  ]

  render() {
    return html`
      <main>
      <flex-row><custom-typography><h4>Bestuur</h4></custom-typography> </flex-row>
        <flex-wrap-center>
        <div class="card">
            <img class="user-photo" src="./img/users/user1.jpg"/>
            <h3>Joke De Swaef</h3>
        </div>
        <div class="card" style="background: var(--md-sys-color-primary-container);color: var(--md-sys-color-on-primary-container);">
            <img class="user-photo" src="./img/users/user2.jpg"/>
            <h3>Lieve Boelaert</h3>
          </div>
        </div>
        </flex-wrap-center>
        <flex-column><custom-typography><h4>Instructeurs</h4></custom-typography> </flex-column>
        <flex-wrap-center>
        <div class="card">
            <img class="user-photo" src="./img/users/user3.jpg"/>
            <h3>Madeline De Kerpel</h3>
        </div>
        </flex-wrap-center>
      </main>
    `
  }
}
