import { html, css, LiteElement } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'

@customElement('planning-view')
export class PlanningView extends LiteElement {
  static styles = [
    css`
      :host {
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `
  ]

  connectedCallback() {
    const selectMonth = this.shadowRoot.querySelector('#selectmonth') as HTMLSelectElement
    let i = new Date().getMonth()
    selectMonth[i].setAttribute('selected','')
    this.shadowRoot.addEventListener('change', ({ detail }: CustomEvent) => {
      this.renderCalendar()
    })
    this.renderCalendar()
  }

  renderCalendar() {
    const selectMonth = this.shadowRoot.querySelector('#selectmonth') as HTMLSelectElement
    const selectYear = this.shadowRoot.querySelector('#selectyear') as HTMLSelectElement
    let selectedYear = selectYear.selectedIndex
    let selectedMonth = selectMonth.selectedIndex
    let firstDay = (new Date(selectedYear, selectedMonth)).getDay()
    let amountDays = (new Date(selectedYear, selectedMonth + 1, 0)).getDate()
    const calendarBody: HTMLTableElement = this.shadowRoot.querySelector('#calendarbody')
    calendarBody.innerHTML=""
    let day = 1
    let value = ''
    for (let rowIterator = 0; rowIterator < 6; rowIterator++) {
      var row =  calendarBody.insertRow()
      for (let cellIterated = 0; cellIterated < 7 && day <= amountDays; cellIterated++) {
        var cell = row.insertCell()
        if (rowIterator !== 0 || cellIterated >= firstDay) {
          value = day.toString()
          day++
        }
        const cellText = document.createTextNode(value)
        cell.appendChild(cellText)
      }
    }
    calendarBody.appendChild(row)
  }

  render() {
    return html`
    <select id="selectmonth" placeholder="${new Date().getMonth()}">
      <option name="Januari" value="0">Januari</option>
      <option name="Februari" value="1">Februari</option>
      <option name="Maart" value="2">Maart</option>
      <option name="April" value="3">April</option>
      <option name="Mei" value="4">Mei</option>
      <option name="Juni" value="5">Juni</option>
      <option name="Juli" value="6">Juli</option>
      <option name="Augustus" value="7">Augustus</option>
      <option name="September" value="8">September</option>
      <option name="Oktober" value="9">Oktober</option>
      <option name="November" value="10">November</option>
      <option name="December" value="12">December</option>
    </select>
    <select id="selectyear" placeholder="${new Date().getFullYear()}">
      <option value="2024">2024</option>
      <option value="2025">2025</option>
    </select>
    <table id="calendar">
      <thead>
          <tr>
              <th>M</th>
              <th>D</th>
              <th>W</th>
              <th>D</th>
              <th>V</th>
              <th>Z</th>
              <th>Z</th>
          </tr>
      </thead>
      <tbody id="calendarbody"></tbody>
    </table>
    `
  }
}
