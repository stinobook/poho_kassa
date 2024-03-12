import { property, html, LiteElement, css } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/wrap-center.js'
import '@vandeurenglenn/flex-elements/column.js'
import '@material/web/fab/fab.js'
import { scrollbar } from '../mixins/styles.js'
import Router from '../routing.js'

@customElement('members-view')
export class MembersView extends LiteElement {
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
      ${scrollbar}
      flex-wrap-center {
        width: 100%;
        gap: 24px;
      }
      flex-column {
        width: 100%;
      }

      .card {
        width: 300px;
        margin: 0 auto;
        position: relative;
        border-radius: var(--md-sys-shape-corner-extra-large);
        text-align: center;
        height: 100%;
        box-shadow: 0 15px 10px -10px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3),
          0 0 40px rgba(0, 0, 0, 0.1) inset;
        background: var(--md-sys-color-surface-variant);
        color: var(--md-sys-color-on-surface-variant);
      }


      .bkg-photo {
        position: relative;
        height: 150px;
        width: 100%;
        border-radius: var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) 0 0;
        background: no-repeat;
        background-size: cover;
        overflow: hidden;
        object-fit: cover;
      }

      .user-photo {
        position: relative;
        top: -60px;
        left: -75px;
        height: 120px;
        width: 120px;
        margin: 0 auto;
        border-radius: 50%;
        border: 5px solid var(--md-sys-color-surface-variant);
        background: no-repeat;
        background-size: contain;
        overflow: hidden;
        object-fit: cover;
      }

      .content {
        position: relative;
        top: -55px;
        margin: 0 auto;
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
    location.hash = Router.bang('add-member')
  }

  render() {
    return html`
      <main>
      <flex-row><custom-typography><h4>Bestuur</h4></custom-typography> </flex-row>
        <flex-wrap-center>
        <div class="card">
              <img class="bkg-photo" src="./img/users/user1_bg.jpg"/>
              <img class="user-photo" src="./img/users/user1.jpg"/>
              <div class="content">
                <h1>Joke De Swaef</h1>
                <h2>Bestuur</h2>
                <h3>Voorzitter</h3>
                <p>GSM: 0477/52.39.83</p>
              </div>
            </div>     
          </div>
        </div>
        <div class="card">
              <img class="bkg-photo" src="./img/users/user2_bg.jpg"/>
              <img class="user-photo" src="./img/users/user2.jpg"/>
              <div class="content">
                <h1>Lieve Boelaert</h1>
                <h2>Bestuur</h2>
                <h3>Secretaris</h3>
                <p>GSM: 0477/58.99.59</p>
              </div>
            </div>     
          </div>
        </div>
        </flex-wrap-center>
        <flex-column><custom-typography><h4>Instructeurs</h4></custom-typography> </flex-column>
        <flex-wrap-center>
        <div class="card">
              <img class="bkg-photo" src="./img/users/user3_bg.jpg"/>
              <img class="user-photo" src="./img/users/user3.jpg"/>
              <div class="content">
                <h1>Madeline De Kerpel</h1>
                <h2>Instructeurs</h2>
                <h3>Adjunct-hoofdinstructeur</h3>
                <p>GSM: 0486/29.53.39</p>
              </div>
            </div>     
          </div>
        </div>
        </flex-wrap-center>
        <flex-column><custom-typography><h4>Leden</h4></custom-typography> </flex-column>
        <flex-wrap-center>
        <div class="card">
              <img class="bkg-photo" src="./img/users/user4_bg.jpg"/>
              <img class="user-photo" src="./img/users/user4.jpg"/>
              <div class="content">
                <h1>Joleen ...</h1>
                <h2>Leden</h2>
                <h3>Lid</h3>
                <p>Teckel</p>
                <p>Cooper</p>
              </div>
            </div>     
          </div>
        </div>
        </flex-wrap-center>
        <md-fab action="add"><custom-icon slot="icon">add</custom-icon></md-fab>
      </main>
    `
  }
}
