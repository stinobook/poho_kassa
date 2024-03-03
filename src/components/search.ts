import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'

export default customElements.define(
  'search-input',
  class searchInput extends MdOutlinedTextField {
    constructor() {
      super()

      this.hasTrailingIcon = true
      this.innerHTML = `<md-icon slot="trailingicon">search</md-icon>`
      this.label = 'search'
      this.type = 'search'
      this.style.setProperty('--_container-shape-start-start', '24px')
      this.style.setProperty('--_container-shape-end-end', '24px')
      this.style.setProperty('--_container-shape-start-end', '24px')
      this.style.setProperty('--_container-shape-end-start', '24px')
      this.style.setProperty('--_top-space', '8px')
      this.style.setProperty('--_bottom-space', '8px')
    }
    timeout
    #input = () => {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        document.dispatchEvent(new CustomEvent('search', { detail: this.shadowRoot.querySelector('input').value }))
      }, 100)
    }
    async connectedCallback() {
      super.connectedCallback()

      const elemStyleSheets = this.shadowRoot.adoptedStyleSheets

      const sheet = new CSSStyleSheet()
      sheet.replaceSync(`
      :host {
        max-width: 320px;
        width: 100%;
      }
      ::slotted([slot="trailingicon"]) {
        cursor: pointer;
      }
    `)

      this.shadowRoot.adoptedStyleSheets = [...elemStyleSheets, sheet]
      await this.updateComplete
      this.shadowRoot.querySelector('input').addEventListener('input', this.#input)
    }
  }
)
