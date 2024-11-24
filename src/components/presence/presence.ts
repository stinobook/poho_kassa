import { LiteElement, customElement, html, property } from '@vandeurenglenn/lite'
import { StyleList, css } from '@vandeurenglenn/lite/element'
import '@vandeurenglenn/lite-elements/icon.js'
import { Member } from '../../types.js'

@customElement('presence-element')
export class PresenceElement extends LiteElement {
  @property() accessor ownkey
  @property() accessor group
  @property() accessor date
  @property() accessor presence
  @property({type: Boolean}) accessor presenceCheck = false
  @property({ type: Object, consumes: true })
  accessor calendar
  @property({ type: Array, consumes: true })
  accessor members
  @property({ type: Object, consumes: true })
  accessor planning
  

  static styles?: StyleList = [
    css`
      :host {
        display: flex;
        border-radius: var(--md-sys-shape-corner-extra-large);
        pointer-events: auto !important;
        cursor: pointer;
        align-items: center;
        box-sizing: border-box;
        padding: 12px;
        gap: 12px;
        flex: 1;
        flex-wrap: wrap;
        height: auto;
      }
      custom-icon {
        pointer-events: none;
      }
      .date {
        width: 30%;
        flex-grow: 1;
      }
      .presence-toggle {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        flex-grow: 1;
      }
      .presence-toggle {
        background-color: var(--md-sys-color-surface-container-highest);
      }
      .presence-toggle label {
        color: var(--md-sys-color-primary);
        display: flex;
        flex-grow:1;
        min-width:1px;
        height: 40px;
        align-items: center;
        justify-content: center;
        --custom-icon-color: var(--md-sys-color-on-surface-variant);
      }
      .presence-toggle label:has(input:checked):where(:has(+ label input:checked)) {
        background-color: lightgreen;
      }
      .presence-toggle label.no:has(input[type=checkbox]:checked) {
        background-color: var(--md-sys-color-on-surface-variant);
      }
      .presence-toggle label.no:has(input[type=checkbox]:checked) custom-icon {
        --custom-icon-color: var(--md-sys-color-surface-variant);
      }
      .presence-toggle label:first-child:has(input:checked), 
      .presence-toggle label:has(input:not(:checked)) + label:has(input:checked) {
        background: lightgreen;
        border-top-left-radius: 25px;
        border-bottom-left-radius: 25px;
      }
      .presence-toggle label:last-child:has(input:checked),
      .presence-toggle label:has(input:checked):not(:has(+ label input:checked)) {
        background: lightgreen;
        border-top-right-radius: 25px;
        border-bottom-right-radius: 25px;
      }

      .presence-toggle input {
        display: none;
      }
      .presence-toggle {
        border-radius: 25px;
      }
      .attending {
        gap: 12px;
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .chips {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        grid-auto-rows: min-content;
        gap: 12px;
        height: auto;
        width: 100%;
        margin-top: 6px;
      }
      .attendees .title {
        width: 100%;
        font-size: 1.1em;
      }
      .attendees {
        background-color: var(--md-sys-color-surface-container-highest);
        border-radius: var(--md-sys-shape-corner-extra-large);
        padding: 12px;
        display: flex;
        flex-wrap: wrap;
      }
      .alert {
        color:var(--md-sys-color-on-error-container);
        background-color:var(--md-sys-color-error-container);
      }
    `
  ]

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this.#clickHandler)
    if (this.presenceCompleted()) {
      this.presenceCheck = true
    }
  }
  
  #clickHandler = event => {
    if (event.target.hasAttribute('id')) {
      const [year, month, day] = this.date.split('-')
      let presence:any = Array.from(this.shadowRoot.querySelectorAll('input[type=checkbox]:checked'))
      if (presence.length === 0) (this.shadowRoot.getElementById('no') as HTMLInputElement).checked = true
      if (event.target.getAttribute('id') === 'no') {
        presence?.forEach((checkbox) => {
          (checkbox.id !== 'no') ? checkbox.checked = false : ''
        }
        )
      } else {
        presence?.forEach((checkbox) => {
          (checkbox.id === 'no') ? checkbox.checked = false : ''
        }
        )
      }
      const detail = {
        day,
        year,
        month,
        presence: Array.from(this.shadowRoot.querySelectorAll('input[type=checkbox]:checked')).map(checked => checked.id)
      }
      document.dispatchEvent(
        new CustomEvent('presence-change', {
          detail
        })
      )
    }
  }

  async onChange(propertyKey) {
    if (propertyKey === 'presence' && this.presence !== '') {
      this.presence.forEach(i => (this.shadowRoot.getElementById(i) as HTMLInputElement).checked = true)
      if (this.presenceCompleted()) {
        this.presenceCheck = true
      }
    }
  }

  renderPresence() {
    const [year, month, day] = this.date.split('-')
    let no = Object.entries(this.calendar?.[Number(year)]?.[(Number(month))]?.[Number(day)])
      .filter(([key, attendance]) => (attendance as Array<string>).includes('no'))
        .map(([key, attendance]) => html`
          <span class='chip'>
            ${Object.values(this.members as Member[]).filter((member) => member.key === key)[0].name 
              + ' '
              + Object.values(this.members as Member[]).filter((member) => member.key === key)[0].lastname.split(" ").map((n)=>n[0]).join(".")
            }
          </span>
        `
      )
    let yes = Object.entries(this.calendar?.[Number(year)]?.[(Number(month))]?.[Number(day)])
    .filter(([key, attendance]) => (attendance as Array<string>).includes('yes'))
      .map(([key, attendance]) => html`
        <span class='chip'>
          ${Object.values(this.members as Member[]).filter((member) => member.key === key)[0].name 
            + ' '
            + Object.values(this.members as Member[]).filter((member) => member.key === key)[0].lastname.split(" ").map((n)=>n[0]).join(".")
          }
        </span>
      `
    )
    let open = Object.entries(this.calendar?.[Number(year)]?.[(Number(month))]?.[Number(day)])
      .filter(([key, attendance]) => (attendance as Array<string>).includes('open'))
        .map(([key, attendance]) => html`
          <span class='chip'>
            ${Object.values(this.members as Member[]).filter((member) => member.key === key)[0].name 
              + ' '
              + Object.values(this.members as Member[]).filter((member) => member.key === key)[0].lastname.split(" ").map((n)=>n[0]).join(".")
            }
          </span>
        `
      )
    let close = Object.entries(this.calendar?.[Number(year)]?.[(Number(month))]?.[Number(day)])
    .filter(([key, attendance]) => (attendance as Array<string>).includes('close'))
      .map(([key, attendance]) => html`
        <span class='chip'>
          ${Object.values(this.members as Member[]).filter((member) => member.key === key)[0].name 
            + ' '
            + Object.values(this.members as Member[]).filter((member) => member.key === key)[0].lastname.split(" ").map((n)=>n[0]).join(".")
          }
        </span>
      `
    )
    let reply = Object.values(this.members)
    .filter((member:Member) => !(Object.keys(this.calendar?.[Number(year)]?.[(Number(month))]?.[Number(day)]).includes(member.key)))
      .map((member:Member) => 
        (member.group !== 'leden' ) ? html`
        <span class='chip'>
          ${member.name 
            + ' '
            + member.lastname.split(" ").map((n)=>n[0]).join(".")
          }
        </span>
      ` : ''
    )
      return [html`
      <span class='attending'>
        ${yes ? html`
          <span class='attendees'>
            <span class='title'>Aanwezig</span>
            <span class='chips'>${yes}</span>
          </span>
        ` : ''}
        ${open.length > 0 ? html`
          <span class='attendees'>
            <span class='title'>Opening</span>
            <span class='chips'>${open}</span>
          </span>
        ` : html`
        <span class='attendees alert'>
            <span class='title alert'>Niemand voor opening!</span>
          </span>
        `}
        ${close.length > 0 ? html`
          <span class='attendees'>
            <span class='title'>Sluiting</span>
            <span class='chips'>${close}</span>
          </span>
        ` : html`
        <span class='attendees alert'>
            <span class='title alert'>Niemand voor sluiting!</span>
          </span>
        `}
        ${no.length > 0 ? html`
          <span class='attendees'>
            <span class='title'>Afwezig</span>
            <span class='chips'>${no}</span>
          </span>
        ` : ''}
        ${reply.length > 0 ? html`
          <span class='attendees'>
            <span class='title'>Nog niet geantwoord</span>
            <span class='chips'>${reply}</span>
          </span>
        ` : ''}
      </span>`
      ]
  }

  presenceCompleted() {
    let [year, month, day] = this.date.split('-')
    let check: Boolean = true
    if (this.calendar?.[Number(year)][Number(month)]) {
      for (const day of Object.values(this.planning?.[Number(year)]?.[(Number(month)-1)])) {
        if (!(Object.keys(this.calendar?.[Number(year)]?.[Number(month)][day.toString()] || [])).includes(this.ownkey)) check=false
      }
    } else {
      check = false
    }
    return check
  }

  render() {
    return html`
    <span class='date'>${new Date(this.date).toLocaleString('nl-BE', { weekday: 'long', day: 'numeric' })}</span>
    <div class="presence-toggle">
      <label class="no">
        <custom-icon icon="location_off"></custom-icon>
        <input type="checkbox" name="presence" id="no" />
      </label>
      ${(this.group === 'bestuur') ? 
      html`<label>
        <custom-icon icon="lock_open"></custom-icon>
        <input type="checkbox" name="presence" id="open" />
      </label>` : '' }
      <label>
        <custom-icon icon="location_on"></custom-icon>
        <input type="checkbox" name="presence" id="yes" />
      </label>
      ${(this.group === 'bestuur') ? 
      html`<label>
        <custom-icon icon="lock"></custom-icon>
        <input type="checkbox" name="presence" id="close" />
      </label>` : '' }
    </div>
    ${this.presenceCheck ? this.renderPresence() : ''}    `
  }
}