import { html, css, LiteElement, property, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'

import './../components/calendar/calendar-year.js'

@customElement('planning-view')
export class PlanningView extends LiteElement {
  date: Date = new Date()
  startYear = this.date.getFullYear()
  startMonth = this.date.getMonth()

  @property({ type: Array }) accessor years

  @property({ type: Object }) accessor activeYear

  @property({ type: Number }) accessor selectedYear: number = this.startYear

  @property({ type: Object, consumes: true, renders: false }) accessor planning

  @query('select') accessor select

  static styles = [
    css`
      :host {
        align-items: center;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }

      select {
        border: none;
        outline: none;
        padding: 12px 24px;
        border-radius: 12px;
        font-size: 24px;
        color: var(--md-sys-color-on-background);
        background: transparent;
      }

      @media (min-width: 874px) {
        .selector {
          max-width: 874px;
        }
      }

      @media (min-width: 1640px) {
        .selector {
          max-width: 1640px;
        }
      }
    `
  ]

  connectedCallback() {
    document.addEventListener('calendar-change', this.#calendarChange.bind(this))
    this.select.addEventListener('change', () => {
      console.log(this.select.value)

      this.selectedYear = Number(this.select.value)
    })
  }

  async #calendarChange({ detail }) {
    await firebase.set(`planning/${detail.year}/${detail.month}`, detail.active)
  }

  onChange(propertyKey: string, value: any): void {
    if ((propertyKey === 'selectedYear' && this.planning) || (propertyKey === 'planning' && this.selectedYear)) {
      this.years = Object.keys(this.planning)

      const selectedYear = this.years.filter(year => Number(year) === this.selectedYear)[0]
      const year = this.planning[selectedYear]

      this.activeYear = { [selectedYear]: year }
    }
  }

  render() {
    return html`
      <flex-container class="selector">
        <select>
          ${this.years ? this.years.map(year => html`<option>${year}</option>`) : ''}
        </select>

        ${this.activeYear
          ? Object.entries(this.activeYear).map(
              ([year, months]) => html`
                <calendar-year
                  .year=${year}
                  .months=${months}></calendar-year>
              `
            )
          : ''}
      </flex-container>
    `
  }
}
