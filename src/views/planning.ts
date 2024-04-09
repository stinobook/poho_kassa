import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import { scrollbar } from '../mixins/styles.js'

@customElement('planning-view')
export class PlanningView extends LiteElement {

  @property({ type: Object, consumer: true })
  accessor planning = {}

  static styles = [
    css`
      :host {
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        display: flex;
      }

      ${scrollbar}

      flex-container {
        gap: 24px;
        overflow-y: auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        grid-auto-rows: min-content;
        height: 100%;
        min-width: 100%;
      }
      div {
        background-color: var(--md-sys-color-surface-container-high);
        color: var(--md-sys-color-on-surface-container-high);
        border-radius: var(--md-sys-shape-corner-extra-large);
        padding: 20px;
        align-self: stretch;
        display: flex;
        flex-direction: column;
      }
      div span {
        display:flex;
        justify-content: center;
        align-items:center;
        margin-bottom:20px;
        font-size: 1.4em;
        text-transform: capitalize;
      }
      div table {
        text-align: center;
        border-spacing: 10px;
      }

      div table tbody tr td {
        cursor:pointer;
        outline:0;
        border:0;
        justify-self:center;
        align-self:center;
        border-radius:50px;
        transition-duration:.2s;
        padding: 5px;
        
        &.today {
          box-shadow:inset 0px 0px 0px 2px var(--md-sys-color-secondary);
        }
        &.active {
          color: var(--md-sys-color-on-primary);
          background: var(--md-sys-color-secondary);
        }
      }
    `
  ]

  connectedCallback() {
    this.renderCalendar()
    this.shadowRoot.addEventListener('click', this.#clickHandler)
  }

  #clickHandler = (event) => {
    if (event.target.getAttribute('date')) {
      let splitted = event.target.getAttribute('date').split('-')
      this.handlePlanning(splitted[0], splitted[1], splitted[2])
    }
  }

  handlePlanning(year, month, day) {
    let date = this.shadowRoot.querySelector('[date="' + year + '-' + month + '-' + day + '"]')
    if (!(this.planning).hasOwnProperty(year) || !(this.planning[year]).hasOwnProperty(month)) {
      this.planning[year] = {
        ...this.planning[year],
        [month]:[day]
      }
      date.classList.add('active')
    } else {
      let i = this.planning[year][month].indexOf(day)
      if (i > -1) {
        this.planning[year][month].splice(i, 1)
        date.classList.remove('active')
      } else {
        this.planning[year][month].push(day)
        date.classList.add('active')
      }
    }
    firebase.set('planning/' + [year] + '/' + [month], this.planning[year][month])
    console.log(this.planning)
  }

  renderCalendar() {
    for (let year = 0; year < 6; year++) {
      var calendar: HTMLDivElement
      calendar = document.createElement('div')
      var table: HTMLTableElement
      table = document.createElement('table')
      var tHead = table.createTHead()
      tHead.insertAdjacentHTML('beforeend','<tr><th>M</th><th>D</th><th>W</th><th>D</th><th>V</th><th>Z</th><th>Z</th></tr>')
      var tBody = table.createTBody()
      let today = new Date()
      let date = new Date()
      date = new Date(date.setMonth(today.getMonth()+year))
      let selectedYear = date.getFullYear()
      let selectedMonth = date.getMonth()
      calendar.insertAdjacentHTML('beforeend','<span>' + 
                                  date.toLocaleString('nl-BE', { month: 'long' }) + 
                                  ' ' + 
                                  selectedYear +
                                  '</span>'
                                  )
      let firstDay = (new Date(selectedYear, selectedMonth)).getDay() - 1
      if (firstDay === -1 ) firstDay = 6
      let amountDays = (new Date(selectedYear, selectedMonth + 1, 0)).getDate()
      let day = 1
      let value = ''
      for (let rowIterator = 0; rowIterator < 6; rowIterator++) {
        var row =  tBody.insertRow()
        for (let cellIterated = 0; cellIterated < 7 && day <= amountDays; cellIterated++) {
          var cell = row.insertCell()
          if (rowIterator !== 0 || cellIterated >= firstDay) {
            if (day === today.getDate() && selectedMonth === today.getMonth()) cell.classList.add('today')
            value = day.toString()
            cell.setAttribute('date', selectedYear + '-' + (selectedMonth + 1) + '-' + day)
            day++
          }
          const cellText = document.createTextNode(value)
          cell.appendChild(cellText)
        }
      }
      tBody.appendChild(row)
      calendar.appendChild(table)
      this.shadowRoot.querySelector('#calslot').appendChild(calendar)
    }
    for (const [year, value] of Object.entries(this.planning)) {
      for (const [month, days] of Object.entries(value)) {
        for (const day of days) {
          let date = this.shadowRoot.querySelector('[date="' + year + '-' + month + '-' + day + '"]')
          date.classList.add('active')
        }
      }
    }
  }

  render() {
    return html`
    <flex-container id='calslot'></flex-container>
    `
  }
}
