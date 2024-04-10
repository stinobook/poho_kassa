import { LiteElement, property, html, customElement } from "@vandeurenglenn/lite";
import './calendar-month.js'
import { StyleList, css } from "@vandeurenglenn/lite/element";
import { scrollbar } from './../../mixins/styles.js'

@customElement('calendar-year')
export class CalendarYear extends LiteElement {

  @property() accessor year
  @property() accessor months
  @property() accessor active

  renderMonths() {
    console.log(this.year, this.months);
    
    return html`
      <h2>${this.year}</h2>
      <flex-container>
      ${Object.entries(this.months).map(([month, active]) => 
        html`<calendar-month .year=${this.year} .month=${month} .active=${active}></calendar-month>`)
      }
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
      }

      h2 {
        text-align: center;
      }

      flex-container {
        gap: 24px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 470px));
        grid-auto-rows: min-content;
        height: 100%;
        min-width: 100%;
        justify-content: center;
      }
      
      ${scrollbar}
    `
  ]


  render() {
    return html`${this.year && this.months ? this.renderMonths() : '' }`
  }
}