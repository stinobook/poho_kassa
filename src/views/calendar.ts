import { html, css, LiteElement, property, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lite-elements/tabs.js'
import '@vandeurenglenn/lite-elements/selector.js'
import { Member } from '../types.js'
import './../components/presence/presence.js'

@customElement('calendar-view')
export class CalendarView extends LiteElement {
  @property({ type: Object, consumer: true })
  accessor planning
  @property({ type: Array, consumer: true })
  accessor members
  @property() accessor user
  @property() accessor userGroup
  @property() accessor selected
  @property() accessor year
  @property() accessor month

  static styles = [
    css`
      :host {
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      presence-element {
        background-color: var(--md-sys-color-surface-container-high);
        color: var(--md-sys-color-on-surface-container-high);
        width: 100%;
      }
      .attendance {
        display: flex;
        flex-direction: column;
        min-width: 100%;
        gap: 12px;
      }
    `
  ]
  
  async select(selected) {
    let split = selected.detail.split('-')
    this.year = split[0]
    this.month = split[1]
    this.requestRender()
  }

  renderTabs() {
    return Object.entries(this.planning).map(([year, months]) =>
      Object.entries(months).map(([month, days]) =>
        (Number(month) === (new Date().getMonth())) ?
          html`<custom-tab class="custom-selected" plandate=${year + '-' + month}>${new Date(Number(year), Number(month)).toLocaleString('nl-BE', { month: 'long' })}</custom-tab>`
          : html`<custom-tab plandate=${year + '-' + month}>${new Date(Number(year), Number(month)).toLocaleString('nl-BE', { month: 'long' })}</custom-tab>`
      )
    )
  }

  renderPlanning() {
    return Object.entries(this.planning).map(([year, months]) => 
      (this.year === year) ? 
        Object.entries(months).map(([month, days]) =>
          (this.month === month) ?
            days.sort(function (a, b) {  return a - b;  }).map((day) =>
            html `
              <presence-element
                .date=${year + '-' + (Number(month) + 1) + '-' + ((day <= 9) ? day = '0' + day.toString() : day)}
                .group=${this.userGroup}
              ></presence-element>
            `
            )
          : ''
        )
      : ''
    
  )
  }
  async onChange(propertyKey: any, value: any) {
    console.log(propertyKey, value)
    if ((propertyKey === 'members' || propertyKey === 'user') && this.user) {
      this.userGroup = Object.values(this.members).filter((member) => member.key === this.user.member)[0].group
    }
  }

  async connectedCallback(): Promise<void> {
    this.user = await firebase.get('users/' + firebase.auth.currentUser.uid)
   
    document.addEventListener('presence-change', this.#presenceChange.bind(this))
  }

  async #presenceChange({detail}) {
    await firebase.set(`planning/${Number(detail.year)}/${Number(detail.month) - 1}/${Number(detail.day)}/${this.user.member}`,detail.presence)
  }

  render() {
    return html`
    <flex-container>
      <custom-tabs attr-for-selected="plandate" 
        @selected=${this.select.bind(this)}>
          ${this.planning ? this.renderTabs() : ''}
      </custom-tabs>
      <div class="attendance">
        ${(this.year && this.month) ? this.renderPlanning() : ''}
      </div>
    </flex-container>
    `
  }
}
