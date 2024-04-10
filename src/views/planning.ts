import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import { scrollbar } from '../mixins/styles.js'

import './../components/calendar/calendar-year.js'

@customElement('planning-view')
export class PlanningView extends LiteElement {
  date: Date = new Date()
  startYear = this.date.getFullYear()
  startMonth = this.date.getMonth()

  @property({type: Number}) accessor selectedYear: number = this.startYear

  @property({ type: Object, consumes: true }) accessor planning

  static styles = [
    css`
      :host {
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        display: flex;
      }
    `
  ]

  connectedCallback() {
    document.addEventListener('calendar-change', this.#calendarChange.bind(this))
  }

  async #calendarChange({detail}) {
    await firebase.set(`planning/${detail.year}/${detail.month}`, detail.active)
  }
 
  async willChange(propertyKey: string, value: any): Promise<any> {
    
    if (propertyKey === 'selectedYear' && this.planning && this._lite_planning !== undefined && value) {
      
      
      const selectedYear = Object.keys(value).filter(year => Number(year) === value)[0]
      const year = this._lite_planning[selectedYear]
      const planning = {}
      planning[selectedYear] = year
      this.planning = planning[selectedYear] = year
     
    } else if (propertyKey === 'planning' && this.selectedYear) {
      const selectedYear = Object.keys(value).filter(year => Number(year) === this.selectedYear)[0]
      const year = value[selectedYear]
      value = {}
      value[selectedYear] = year
    }
    return value
  }

  render() {
    
    return html`
    ${this.planning ? Object.entries(this.planning).map(([year, months]) => html`
      <calendar-year .year=${year} .months=${months}></calendar-year>
    `): ''}
    
    
    

    `
  }
}
