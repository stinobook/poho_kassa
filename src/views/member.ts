import { property, html, LiteElement, css, customElement } from '@vandeurenglenn/lite'
import '@vandeurenglenn/flex-elements/wrap-center.js'
import '@vandeurenglenn/flex-elements/column.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lite-elements/typography.js'
import '@vandeurenglenn/flex-elements/it.js'
import '@material/web/fab/fab.js'
import './../components/card/card.js'
import { scrollbar } from '../mixins/styles.js'
import Router from '../routing.js'

@customElement('member-view')
export class MemberView extends LiteElement {
  static styles = [
    css`
      * {
        pointer-events: none;
      }
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      :host(.custom-selected) {
        position: fixed !important;
      }

      flex-container {
        margin-top: 64px;
        max-width: 100%;
        align-items: center;
        overflow-y: auto;
      }
      md-fab {
        position: absolute;
        right: 24px;
        bottom: 24px;
      }
      .card,
      flex-container,
      md-icon-button,
      md-fab,
      md-list-item,
      md-outlined-button {
        pointer-events: auto;
      }

      ${scrollbar}

      flex-wrap-center {
        width: 100%;
        gap: 16px;
        margin-bottom: 16px;
        margin-top: 16px;
      }
      flex-column {
        width: 100%;
      }

      .card {
        cursor: pointer;
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
      <flex-container>
        <custom-typography>Bestuur</custom-typography>
        <flex-wrap-center>
          <card-element center>
            <img slot="image" src="./img/users/user1_bg.jpg" />
            <img slot="avatar" src="./img/users/user1.jpg" />
            <flex-it></flex-it>
            <div class="content">
              <h1>Joke De Swaef</h1>
              <h2>Bestuur</h2>
              <h3>Voorzitter</h3>
              <p>GSM: 0477/52.39.83</p>
            </div>
          </card-element>
          <card-element center>
            <img slot="image" src="./img/users/user2_bg.jpg" />
            <img slot="avatar" src="./img/users/user2.jpg" />
            <flex-it></flex-it>
            <div class="content">
              <h1>Lieve Boelaert</h1>
              <h2>Bestuur</h2>
              <h3>Secretaris</h3>
              <p>GSM: 0477/58.99.59</p>
            </div>
          </card-element>
        </flex-wrap-center>
        <custom-typography>Instructeurs</custom-typography>
        <flex-wrap-center>
          <card-element center>
            <img slot="image" src="./img/users/user3_bg.jpg" />
            <img slot="avatar" src="./img/users/user3.jpg" />
            <flex-it></flex-it>
            <div class="content">
              <h1>Madeline De Kerpel</h1>
              <h2>Instructeurs</h2>
              <h3>Adjunct-hoofdinstructeur</h3>
              <p>GSM: 0486/29.53.39</p>
            </div>
          </card-element>
        </flex-wrap-center>
        <custom-typography>Leden</custom-typography>
        <flex-wrap-center>
          <card-element center>
            <img slot="image" src="./img/users/user4_bg.jpg" />
            <img slot="avatar" src="./img/users/user4.jpg" />
            <div class="content">
              <h1>Joleen ...</h1>
              <h2>Leden</h2>
              <h3>Lid</h3>
              <p>Teckel</p>
              <p>Cooper</p>
            </div>
          </card-element>
        </flex-wrap-center>
      </flex-container>
      <md-fab action="add"><custom-icon slot="icon">add</custom-icon></md-fab>
    `
  }
}
