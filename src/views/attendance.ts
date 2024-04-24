import { property, html, LiteElement, css, customElement, queryAll } from '@vandeurenglenn/lite'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lite-elements/selector.js'
import { scrollbar } from '../mixins/styles.js'
import type { Member } from '../types.js'
import './../components/chip/chip.js'

@customElement('attendance-view')
export class AttendanceView extends LiteElement {
  @property({ consumer: true, renders: false })
  accessor attendance

  @property({ type: Array, consumer: true })
  accessor members: { [group: string]: Member[] }

  @property({ consumer: true, renders: false })
  accessor promo: { [key: string]: Boolean } = {}

  @queryAll('.custom-selected')
  accessor currentAttendance

  @queryAll('custom-selector')
  accessor selectors

  attendanceDate = new Date().toISOString().slice(0, 10)

  static styles = [
    css`
      * {
        pointer-events: none;
        user-select: none;
      }
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
        display: flex;
        flex-direction: column;
        align-items: center;
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

      chip-element {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
        min-width: 220px;
      }

      chip-element.custom-selected {
        background: lightgreen;
        color: var(--md-sys-color-on-primary);
      }
      custom-typography {
        text-transform: capitalize;
      }
      flex-container {
        min-width: 100%;
      }
      custom-selector {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        grid-auto-rows: min-content;
        gap: 12px;
        height: auto;
        padding-bottom: 12px;
      }

      custom-selector :not(.custom-selected):not([non-interactive]):hover {
        background: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
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
    if (propertyKey === 'attendance') {
      const attendance = value[this.attendanceDate]
      return attendance
    }
    return value
  }

  onChange(propertyKey: string, value: any): void {
    console.log( {propertyKey})
    console.log( {value} )

    if (propertyKey === 'attendance' && Object.keys(this.members)?.length > 0 && Object.keys(value).length === 1) {
      this.selectors.forEach(element => {
        element.select(value)
      })
    } else if (propertyKey === 'members' && this.attendance && Object.keys(this.attendance)?.includes(this.attendanceDate)) {
      this.selectors.forEach(element => {
        element.select(this.attendance[this.attendanceDate])
      })
    }
  }

  async _onSelected() {
    if (this.attendanceDate !== new Date().toISOString().slice(0, 10)) {
      alert(`client session expired, needs reload first`)
      location.reload()
      return
    }
    await firebase.set(
      `attendance/${this.attendanceDate}`,
      this.currentAttendance.map(el => el.getAttribute('key'))
    )
    let attendanceKeys = this.currentAttendance.map(el => el.getAttribute('key'))

    for (const key of attendanceKeys) {
      if (!Object.keys(this.promo).includes(key)) this.promo[key] = true
    }
    for (const [key, value] of Object.entries(this.promo)) {
      if (value && !attendanceKeys.includes(key)) delete this.promo[key]
    }
    await firebase.set('promo', this.promo)
  }

  renderMembers() {
    return Object.entries(this.members).map(([group, members]) =>
      members?.length > 0
        ? html`
            <custom-typography><h4>${group}</h4></custom-typography>
            <custom-selector
              multi
              attr-for-selected="key"
              default-selected="[]"
              @selected=${this._onSelected.bind(this)}>
              ${members.map(
                member =>
                  html`
                    <chip-element
                      key=${member.key}
                      .avatar=${member.userphotoURL}
                      .name=${member.name + ' ' + member.lastname}>
                    </chip-element>
                  `
              )}
            </custom-selector>
          `
        : ''
    )
  }

  render() {
    return html` <main><flex-container>${this.members ? this.renderMembers() : ''}</flex-container></main> `
  }
}
