import { property, html, LiteElement, css } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@material/web/button/filled-button.js'
import '@material/web/checkbox/checkbox.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'


@customElement('events-view')
export class EventsView extends LiteElement {
  @property({ type: Array, consumer: true })
  accessor categories: string[]

  static styles = [
    css`
      :host {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
    `
  ]
  async connectedCallback() {
    this.shadowRoot.addEventListener('click', ({ target }: CustomEvent) => {
      // @ts-ignore
      let event = new CustomEvent('eventsTap', { detail: target.getAttribute('events-tap')})
      this.eventMode(event)
    })
  }

  eventMode({ detail }: CustomEvent) {
    let checkedEvents = Array.from(this.shadowRoot.querySelectorAll('md-checkbox'))
    console.log(this.categories[1])
    console.log(checkedEvents[1].checked)
  }

  render() {
    return html`
      <flex-container>
      <span><label>Extra kost (in &euro;)<input class="eventInput" type="text"/></label></span>
      ${this.categories.map(
        (item) => html`
          <md-list-item>
            <span slot="headline">${item}</span>
            <span slot="end"><md-checkbox eventCheckbox="enable${item}"></md-checkbox></span>
          </md-list-item>
        `
      )}
      <md-filled-button @events-click=${(event) => this.eventMode(event)} events-tap="save" >Save</md-filled-button>
      <md-filled-button @events-click=${(event) => this.eventMode(event)} events-tap="reset" >Reset</md-filled-button>
      </flex-container>
    `
  }
}
