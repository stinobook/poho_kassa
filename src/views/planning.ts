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

  async connectedCallback() {
    const value = await firebase.get('planning')
    console.log(value)
    if (!value) {
      this.planning = {
        [this.startYear]: [[], [], [], [], [], [], [], [], [], [], [], []],
        [this.startYear + 1]: [[], [], [], [], [], [], [], [], [], [], [], []]
      }
    }

    document.addEventListener('calendar-change', this.#calendarChange.bind(this))
    this.select.addEventListener('change', () => {
      this.selectedYear = Number(this.select.value)
    })
  }

  async #calendarChange({ detail }) {
    await firebase.set(`planning/${Number(detail.year)}/${Number(detail.month) - 1}`, detail.active)
  }

  async onChange(propertyKey: string) {
    if ((propertyKey === 'selectedYear' && this.planning) || (propertyKey === 'planning' && this.selectedYear)) {
      this.years = Object.keys(this.planning)

      if (!this.years.includes(String(this.startYear))) {
        this.planning[this.startYear] = [[], [], [], [], [], [], [], [], [], [], [], []]
      }

      if (!this.years.includes(String(this.startYear + 1))) {
        this.planning[this.startYear + 1] = [[], [], [], [], [], [], [], [], [], [], [], []]
      }

      const selectedYear = this.years.filter(year => Number(year) === Number(this.selectedYear))[0]
      const year = this.planning[selectedYear]

      if (year?.length < 12) {
        const mock = []
        for (let i = 0; i < 12; i++) {
          const month = year[i]
          mock[i] = month ? month : []
        }
        this.activeYear = { [selectedYear]: mock }
      } else {
        this.activeYear = { [selectedYear]: year }
      }
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
