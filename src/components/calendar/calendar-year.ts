import { LiteElement, property, html, customElement } from '@vandeurenglenn/lite'
import './calendar-month.js'
import { StyleList, css } from '@vandeurenglenn/lite/element'
import { scrollbar } from './../../mixins/styles.js'
import '@vandeurenglenn/flex-elements/wrap-between.js'

@customElement('calendar-year')
export class CalendarYear extends LiteElement {
  @property() accessor year
  @property() accessor months
  @property() accessor active

  renderMonths() {
    return html`
      <flex-container>
        <flex-wrap-between>
          ${this.months
            ? this.months.map(
                (active, i) =>
                  html`<calendar-month
                    .year=${this.year}
                    .month=${i < 9 ? `0${i + 1}` : i + 1}
                    .active=${active}></calendar-month>`
              )
            : ''}
        </flex-wrap-between>
      </flex-container>
    `
  }

  static styles?: StyleList = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-bottom: 24px;
        box-sizing: border-box;
        align-items: center;
      }

      h2 {
        text-align: center;
      }

      flex-container {
        height: 100%;
        --flex-display-max-width: 100%;
      }

      flex-wrap-between {
        gap: 24px;
      }

      @media (min-width: 870px) {
        calendar-month {
          max-width: 400px;
        }
      }

      ${scrollbar}
    `
  ]

  // async onChange(propertyKey: string, value: any): void {
  //   if (propertyKey === 'months') {
  //     const lastMonth = this.shadowRoot.querySelector(`[month="12"]`)
  //     await lastMonth.rendered
  //     const date = new Date().getMonth()
  //     const month = this.shadowRoot.querySelector(`[month="${date < 9 ? `0${date + 1}` : date + 1}"]`)
  //     month?.scrollIntoView(true)
  //     console.log(month)
  //   }
  // }

  render() {
    return html`${this.year && this.months ? this.renderMonths() : ''}`
  }
}
