import { LiteElement, property, html, customElement } from "@vandeurenglenn/lite";
import './calendar-month.js'
import { StyleList, css } from "@vandeurenglenn/lite/element";
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
      ${Object.entries(this.months).map(([month, active]) => 
        html`<calendar-month .year=${this.year} .month=${month} .active=${active}></calendar-month>`)
      }
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
      }

      flex-wrap-between {
        gap: 24px;
      }    
      

      @media(min-width: 860px) {
        calendar-month {
          max-width: calc((100% / 2) - 12px)
        }

        flex-container {
          max-width: 860px;
        }
      }

      @media(min-width: 1300px) {
        calendar-month {
          max-width: calc((100% / 3) - 16px)
        }

        flex-container {
          max-width: 1300px;
        }
      }

      @media(min-width: 2200px) {
        calendar-month {
          max-width: calc((100% / 4) - 20px)
        }

        flex-container {
          max-width: 2200px;
        }
      }

      ${scrollbar}
    `
  ]


  render() {
    return html`${this.year && this.months ? this.renderMonths() : '' }`
  }
}