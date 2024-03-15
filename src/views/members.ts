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
import type { Member } from '../types.js'

@customElement('members-view')
export class MembersView extends LiteElement {
  @property({ consumer: true })
  accessor members: Member[]

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
      card-element {
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
  _edit = (target) => {
    location.hash = Router.bang(`add-member?edit=${target}`)
  }

  renderMembers(input) {
    return this.members.map((member) => { 
      if (member.group === input) {
        let card = html `
                  <card-element
                    action="edit" 
                    key=${member.key}
                    center
                    image=${member.userphotobgURL}
                    avatar=${member.userphotoURL}
                    headline=${member.name + ' ' + member.lastname}
                    subline=${member.title}
                  >
                    <flex-it></flex-it>
                    <div class="content">
                      <h3></h3>
                      <p>extra info to be coded</p>
                    </div>
                  </card-element>
                `
        return [card]
      }
    })
  }

  render() {
    return html`
      <flex-container>
        <custom-typography>Bestuur</custom-typography>
        ${this.members ? this.renderMembers('Bestuur') : ''}
        </flex-wrap-center>
        <custom-typography>Instructeurs</custom-typography>
        ${this.members ? this.renderMembers('Instructeurs') : ''}
        </flex-wrap-center>
        <custom-typography>Leden</custom-typography>
        <flex-wrap-center>
        ${this.members ? this.renderMembers('Leden') : ''}
        </flex-wrap-center>
      </flex-container>
      <md-fab action="add"><custom-icon slot="icon">add</custom-icon></md-fab>
    `
  }
}
