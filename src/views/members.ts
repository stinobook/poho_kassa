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

@customElement('members-view')
export class MembersView extends LiteElement {
  @property({ type: Array })
  accessor members = [
    {
      image: './img/users/user1_bg.jpg',
      avatar: './img/users/user1.jpg',
      section: 'Bestuur',
      title: 'Voorzitter',
      name: 'Joke De Swaef'
    }
  ]
  static styles = [
    css`
      * {
        pointer-events: none;
      }
      :host {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      flex-container {
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
          <card-element
            center
            image="./img/users/user1_bg.jpg"
            avatar="./img/users/user1.jpg"
            headline="Joke De Swaef"
            subline="Voorzitter"
          >
            <flex-it></flex-it>
            <div class="content">
              <h3></h3>
              <p>GSM: 0477/52.39.83</p>
            </div>
          </card-element>
          <card-element
            center
            image="./img/users/user2_bg.jpg"
            avatar="./img/users/user2.jpg"
            headline="Lieve Boelaert"
            subline="Secretaris"
          >
            <flex-it></flex-it>
            <div class="content">
              <p>GSM: 0477/58.99.59</p>
            </div>
          </card-element>
        </flex-wrap-center>
        <custom-typography>Instructeurs</custom-typography>
        <flex-wrap-center>
          <card-element
            center
            image="./img/users/user3_bg.jpg"
            avatar="./img/users/user3.jpg"
            headline="Madeline De Kerpel"
            subline="Adjunct-hoofdinstructeur"
          >
            <flex-it></flex-it>
            <span>GSM: 0486/29.53.39</span>
          </card-element>
        </flex-wrap-center>
        <custom-typography>Leden</custom-typography>
        <flex-wrap-center>
          <card-element center image="./img/users/user4_bg.jpg" avatar="./img/users/user4.jpg" headline="Joleen ...">
          </card-element>
        </flex-wrap-center>
      </flex-container>
      <md-fab action="add"><custom-icon slot="icon">add</custom-icon></md-fab>
    `
  }
}
