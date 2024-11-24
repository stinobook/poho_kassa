import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lite-elements/tabs.js'
import '@vandeurenglenn/lite-elements/selector.js'
import './../components/presence/presence.js'
import { scrollbar } from '../mixins/styles.js'

@customElement('calendar-view')
export class CalendarView extends LiteElement {
  @property({ type: Object, consumes: true })
  accessor planning
  @property({ type: Object, consumes: true })
  accessor calendar
  @property({ type: Array, consumes: true })
  accessor members
  @property() accessor selected
  @property() accessor year
  @property() accessor month

  static styles = [
    css`
      :host {
        align-items: center;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      flex-container {
        overflow-y: auto;
        max-width: 100%;
        min-width: 100%;
        width: 100%;
      }

      ${scrollbar}
      
      presence-element {
        background-color: var(--md-sys-color-surface-container-high);
        color: var(--md-sys-color-on-surface-container-high);
      }
      .attendance {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
      }

      custom-tab.custom-selected {
        background: var(--md-sys-color-tertiary);
        border: none;
      }
      custom-tab.custom-selected {
        color: var(--md-sys-color-on-tertiary);
      }

      custom-tab {
        height: 45px;
        padding: 6px 12px;
        box-sizing: border-box;
        width: auto;
        border-radius: 25px;
        min-width: 100px;
        transform:rotateX(180deg);
      }
      custom-tabs {
        gap: 8px;
        overflow-x: auto;
        width: 100%;
        margin-bottom: 12px;
        transform:rotateX(180deg);
        padding-bottom: 6px;
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
        (Number(year) === (new Date().getFullYear()) && Number(month) >= (new Date().getMonth()) && days.length !== 0) ?
          html`<custom-tab plandate=${year + '-' + month}>${new Date(Number(year), Number(month)).toLocaleString('nl-BE', { month: 'long' })}</custom-tab>`
          : 
            (Number(year) > (new Date().getFullYear()) && days.length !== 0) ?
            html`<custom-tab plandate=${year + '-' + month}>${new Date(Number(year), Number(month)).toLocaleString('nl-BE', { month: 'long' })}</custom-tab>`
            : ''          
      )
    )
  }

  renderPlanning() {
    return Object.entries(this.planning).map(([year, months]) => 
      (this.year === year) ? 
        Object.entries(months).map(([month, days]) =>
          (this.month === month) ?
            days.sort(function (a, b) {  return a - b;  }).map((day) =>
              (Number(month) === (new Date().getMonth()) && day < (new Date().getDate())) ? '' :            
                html `
                  <presence-element
                    .date=${year + '-' + (((Number(month) +1) <= 9) ? '0' + (Number(month) +1).toString() : (Number(month) +1)) + '-' + ((day <= 9) ? day = '0' + day.toString() : day)}
                    .group=${firebase.userDetails.group}
                    .presence=${(this.calendar?.[Number(year)]?.[(Number(month) + 1)]?.[Number(day)]) 
                      ? Object.keys(this.calendar?.[Number(year)]?.[(Number(month) + 1)]?.[Number(day)]).includes(firebase.userDetails.member) 
                        ? this.calendar?.[Number(year)]?.[(Number(month) + 1)]?.[Number(day)][firebase.userDetails.member] 
                        : '' 
                      : ''}
                    .ownkey=${firebase.userDetails.member}
                  ></presence-element>
                `
                )
          : ''
        )
      : ''
    
  )
  }
  

  async connectedCallback(): Promise<void> {
    document.addEventListener('presence-change', this.#presenceChange.bind(this))
    let date = new Date()
    this.year = date.getFullYear().toString()
    this.month = date.getMonth().toString()
  }

  async #presenceChange({detail}) {
    await firebase.set(`calendar/${Number(detail.year)}/${Number(detail.month)}/${Number(detail.day)}/${firebase.userDetails.member}`,detail.presence)
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
