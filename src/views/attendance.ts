import { property, html, LiteElement, css } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/wrap-center.js'
import '@vandeurenglenn/flex-elements/column.js'
import { scrollbar } from '../mixins/styles.js'
import type { Member, Attendee, Attendance } from '../types.js'
import { getDatabase, ref, child, push, update } from 'firebase/database'

@customElement('attendance-view')
export class AttendanceView extends LiteElement {
  @property({ type: Array, consumer: true })
  accessor members: { [group: string]: Member[] }
  @property({ consumer: true })
  accessor attendance: {}
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
        pointer-events: auto;
        padding-right: 24px;
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
        pointer-events: none;
      }
      h3 {
        pointer-events: none;
      }
      custom-typography {
        text-transform: capitalize;
      }

    `
  ]
  async willChange(propertyKey: string, value: any): Promise<any> {
    if (propertyKey === 'members') {
      const members = {}
      for (const member of value) {
        if (!members[member.group]) members[member.group] = []
        members[member.group].push(member)
      }
      return members
    }
    return value
  }

  renderMembers() {
    return Object.entries(this.members).map(
      ([group, members]) =>
          html `
              <flex-row>
                <custom-typography><h4>${group}</h4></custom-typography>
              </flex-row>
              <flex-wrap-center>
                ${members.map(
                  (member) =>
                    html`
                      <div class="card" key=${member.key} action="toggle">
                          <img class="user-photo" src=${member.userphotoURL} />
                          <h3>${member.name + ' ' + member.lastname}</h3>
                      </div>
                    `
                  )
                }
              </flex-wrap-center>
            `
    )
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this.#clickHandler)
    this.colorAttendance()
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#clickHandler)
  }

  #clickHandler = (event) => {
    const key = event.target.getAttribute('key')
    const action = event.target.getAttribute('action')
    if (!action) return
    if (action === 'toggle') {
      this.toggleAttendance(key)
    }
  }

  async colorAttendance() {
    const today = new Date().toISOString().slice(0, 10)
    let attendance = await this.attendance
    let filteredKeys = Object.values(attendance).filter((filtered: Attendee) => filtered.attended.includes(today))
    for (const [key, value] of Object.entries(filteredKeys)) {
      const cardKey = value['key']
      const card = this.shadowRoot.querySelector('[key=' + cardKey + ']') as HTMLElement  
      card.style.setProperty("background", "var(--md-sys-color-primary)")
      card.style.setProperty("color", "var(--md-sys-color-on-primary)") 
    }

  }

  toggleAttendance(value) {
    const attendanceDB = ref(getDatabase(), 'attendance')
    const today = new Date().toISOString().slice(0, 10)
    let attendee = Object.values(this.attendance).filter((filtered: Attendee) => filtered.key === value)
    let card = this.shadowRoot.querySelector('[key=' + value + ']') as HTMLElement
    if (attendee.length === 0 || !attendee[0].attended) {
      let newAttendee: Attendee = {
        key: value,
        promo: true,
        attended: [today]
      }
      const updates = {}
      updates[value] = newAttendee
      update(attendanceDB, updates)
      card.style.setProperty("background", "var(--md-sys-color-primary)")
      card.style.setProperty("color", "var(--md-sys-color-on-primary)")
    } else {
      if (attendee[0].attended.includes(today)) {
          let i = attendee[0].attended.indexOf(today)
          attendee[0].attended.splice(i, 1)
          attendee[0].promo = false
          card.style.setProperty("background", "var(--md-sys-color-error-container)")
          card.style.setProperty("color", "var(--md-sys-color-on-error-container)")
      } else {
        attendee[0].attended.push(today)
        attendee[0].promo = true
        card.style.setProperty("background", "var(--md-sys-color-primary)")
        card.style.setProperty("color", "var(--md-sys-color-on-primary)")
      }
      const updates = {}
      updates[value] = attendee[0]
      update(attendanceDB, updates)
    }
  }

  render() {
    return html`
      <main>${this.members ? this.renderMembers() : ''}</main>
    `
  }
}
