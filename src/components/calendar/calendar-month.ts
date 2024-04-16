import { LiteElement, property, html, customElement, query } from '@vandeurenglenn/lite'
import { StyleList, css } from '@vandeurenglenn/lite/element'

@customElement('calendar-month')
export class CalendarMonth extends LiteElement {
  today = new Date()
  days = ['m', 'd', 'w', 'd', 'v', 'z', 'z']

  @query('tbody') accessor tbody

  @property() accessor active
  @property() accessor year
  @property() accessor month
  @property() accessor longMonth
  @property() accessor dates

  date: Date

  async onChange(propertyKey): Promise<any> {
    if ((this.month && propertyKey === 'year') || (this.year && propertyKey === 'month')) {
      this.date = new Date(`${this.year}-${this.month}-1`)
      this.longMonth = this.date.toLocaleString('nl-BE', { month: 'long' })

      if (Number(this.today.getMonth()) === Number(this.month)) this.scrollIntoView()
      const days = []

      let firstDay = new Date(this.year, this.month - 1).getDay() - 1
      if (firstDay === -1) firstDay = 6
      let amountDays = new Date(this.year, this.month, 0).getDate()
      let day = 1
      let value = ''
      for (let rowIterator = 0; rowIterator < 6; rowIterator++) {
        const cells = []
        for (let cellIterated = 0; cellIterated < 7 && day <= amountDays; cellIterated++) {
          if (rowIterator !== 0 || cellIterated >= firstDay) {
            value = day.toString()
            day++
          }
          cells.push(value)
        }
        days.push(cells)
      }
      this.dates = days
    }
  }
  static styles?: StyleList = [
    css`
      * {
        pointer-events: none;
        user-select: none;
      }
      :host {
        background-color: var(--md-sys-color-surface-container-high);
        color: var(--md-sys-color-on-surface-container-high);
        border-radius: var(--md-sys-shape-corner-extra-large);
        padding: 20px;
        box-sizing: border-box;
        align-self: stretch;
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        font-size: 1.4em;
        text-transform: capitalize;
      }

      table {
        text-align: center;
      }

      thead tr th {
        text-transform: capitalize;
      }

      table tbody tr td {
        cursor: pointer;
        outline: 0;
        justify-self: center;
        align-self: center;
        border-radius: 50px;
        transition-duration: 0.2s;
        pointer-events: auto;
        cursor: pointer;
        border: 4px solid var(--md-sys-color-surface-container-high);
      }

      .selection-wrapper {
        border-radius: 50px;
        padding: 4px;
        margin: 4px;
        min-width: 24px;
        max-height: 24px;
        display: block;
      }

      [today] {
        gap: 2px;

        border: 4px solid var(--md-sys-color-inverse-primary);
      }

      [active] .selection-wrapper,
      [active]:not([today]) {
        color: var(--md-sys-color-on-secondary);
        background: var(--md-sys-color-secondary);
      }
    `
  ]

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this.#clickHandler)
  }

  #clickHandler = event => {
    const [day, month, year] = event.target.getAttribute('date').split('-')

    if (event.target.hasAttribute('active')) {
      this.active.splice(this.active.indexOf(day), 1)
    } else {
      this.active.push(day)
    }

    const detail = {
      day,
      year,
      month,
      active: this.active
    }
    console.log(detail)

    document.dispatchEvent(
      new CustomEvent('calendar-change', {
        detail
      })
    )
  }

  dayToDate(day) {
    return `${day}-${this.month}-${this.year}`
  }
  render() {
    return html`${this.date && this.month
      ? html`
          <header>${this.longMonth}</header>

          <table>
            <thead>
              <tr>
                ${this.days.map(day => html`<th>${day}</th>`)}
              </tr>
            </thead>
            <tbody>
              ${this.dates
                ? this.dates.map(
                    row => html`
                      <tr>
                        ${row.map(
                          day => html`
                            <td
                              date=${this.dayToDate(day)}
                              ?today=${this.today.toLocaleDateString('be-nl') === this.dayToDate(day)}
                              ?active=${this.active?.includes(day)}>
                              <span class="selection-wrapper">${day}</span>
                            </td>
                          `
                        )}
                      </tr>
                    `
                  )
                : ''}
            </tbody>
          </table>
        `
      : ''}`
  }
}
