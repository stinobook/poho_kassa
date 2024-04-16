import { html, css, LiteElement, property, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lite-elements/tabs.js'
import '@vandeurenglenn/lite-elements/selector.js'
import { Member } from '../types.js'
import type { CustomSelector } from '.././component-types.js'

@customElement('calendar-view')
export class CalendarView extends LiteElement {
  @property({ type: Object, consumer: true })
  accessor planning = {}
  @property({ type: Array, consumer: true })
  accessor members: { [group: string]: Member[] }

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
        (Number(month) === (new Date().getMonth() +1)) ?
          html`<custom-tab class="custom-selected" plandate=${year + '-' + month}>${new Date(Number(year), Number(month)-1).toLocaleString('nl-BE', { month: 'long' })}</custom-tab>`
          : html`<custom-tab plandate=${year + '-' + month}>${new Date(Number(year), Number(month)-1).toLocaleString('nl-BE', { month: 'long' })}</custom-tab>`
      )
    )
  }

  renderPlanning() {
    return Object.entries(this.planning).map(([year, months]) => 
      (this.year === year) ? 
        Object.entries(months).map(([month, days]) =>
          (this.month === month) ?
            days.map((day) =>
            html `<div calyear=${year} calmonth=${month} calday=${day}>${day}</div>`
            )
          : ''
        )
      : ''
    
  )
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
