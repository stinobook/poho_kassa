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
  @property({ type: Object, provider: true })
  accessor categoriesEvents

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
    let eventPrices = Array.from(this.shadowRoot.querySelectorAll('.eventInput'))
    this.categoriesEvents = Object.entries(this.categories).map(([_key, _value]) => ({[_value]: Number(eventPrices[_key].value)}));
    console.log(this.categoriesEvents)
  }

  render() {
    return html`
      <flex-container>
      ${this.categories.map(
        (item) => html`
          <md-list-item>
            <span lot="headline"><label>${item}<input class="eventInput" type="text" eventValue="enable${item}"/></label></span>
          </md-list-item>
        `
      )}
      <md-filled-button @events-click=${(event) => this.eventMode(event)} events-tap="save" >Save</md-filled-button>
      <md-filled-button @events-click=${(event) => this.eventMode(event)} events-tap="reset" >Reset</md-filled-button>
      </flex-container>
    `
  }
}
