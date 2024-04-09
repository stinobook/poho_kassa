import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import { Member } from '../types.js'

@customElement('calendar-view')
export class CalendarView extends LiteElement {
  @property({ type: Object, consumer: true })
  accessor planning = {}
  @property({ type: Array, consumer: true })
  accessor members: { [group: string]: Member[] }

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

  selectUser() {
    return Object.entries(this.members).map(
      ([group, members]) =>
      members?.length > 0
        ? html`
          <select id="selectuser">
            ${members.map(
              (member) =>
                html`
                  <option value=${member.key}> ${member.name} ${member.lastname}</option>
                `
            )}
          </select>
        `
        : ''
    )
  }

  render() {
    return html`
    <flex-container>
    ${this.members ? this.selectUser() : ''}
    </flex-container>
    `
  }
}
