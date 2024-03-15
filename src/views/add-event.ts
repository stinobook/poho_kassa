import { LiteElement, css, customElement, html, property, queryAll } from '@vandeurenglenn/lite'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/lite-elements/typography.js'
import '@material/web/fab/fab.js'
import '@material/web/textfield/outlined-text-field.js'
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'

const formatDate = () => {
  const date = new Date().toLocaleDateString('fr-CA').split('-')
  if (date[1].length === 1) date[1] = `0${date[1]}`
  if (date[2].length === 1) date[2] = `0${date[2]}`
  return date.join('-')
}

@customElement('add-event-view')
export class AddEventView extends LiteElement {
  @queryAll('[label]')
  accessor labels

  @property({ consumer: true })
  accessor categories: string[] = []

  @property()
  accessor current

  @property()
  accessor params
  editing

  back = () => {
    history.back()
    this.reset()
  }

  async updateView(value) {
    const event = await firebase.get(`events/${value.edit}`)

    for (const [key, value] of Object.entries(event)) {
      const field = this.shadowRoot.querySelector(`[label=${key}]`) as MdFilledTextField
      if (!field && key !== 'adjustments') alert(`property declared but no field found for: ${key}`)
      if (field) field.value = value as string
    }
    this.current = event
    this.requestRender()
  }

  async onChange(propertyKey, value) {
    if (propertyKey === 'params') {
      if (value?.edit) {
        this.editing = true
        if (this.rendered) {
          await this.updateView(value)
        }
      }
    }
  }

  save = async () => {
    const event = {
      adjustments: {}
    }
    const fields = Array.from(
      this.shadowRoot.querySelectorAll('md-outlined-text-field:not(.adjustment)')
    ) as MdOutlinedTextField[]
    let invalid = false
    for (const field of fields) {
      if (field.validity.valueMissing) {
        invalid = true
        field.errorText = `${field.label} needs to be set`
        field.error = true
      }
      if (field.value) event[field.label] = field.value
    }
    let startDateCheck = new Date(event['startDate'])
    let endDateCheck = new Date(event['endDate'])
    const endTimeField = this.shadowRoot.querySelector('[label="endDate"]') as MdOutlinedTextField
    if (startDateCheck > endDateCheck) {
      invalid = true
      endTimeField.errorText = 'End date cannot be before start date'
      endTimeField.error = true
    } else {
      endTimeField.error = false
      let startTimeCheck = new Date(event['startDate'] + ' ' + event['startTime'])
      let endTimeCheck = new Date(event['endDate'] + ' ' + event['endTime'])
      if (startTimeCheck > endTimeCheck) {
        invalid = true
        const endTimeField = this.shadowRoot.querySelector('[label="endTime"]') as MdOutlinedTextField
        endTimeField.errorText = 'End time cannot be before start time'
        endTimeField.error = true
      }
    }

    const adjustmentFields = Array.from(
      this.shadowRoot.querySelectorAll('md-outlined-text-field.adjustment')
    ) as MdOutlinedTextField[]
    for (const field of adjustmentFields) {
      if (field.validity.valueMissing) {
        field.value = field.placeholder
      }
      if (field.value) event.adjustments[field.label] = field.value
    }
    if (invalid) return
    if (this.editing) {
      await firebase.set(`events/${this.params.edit}`, event)

      this.params = undefined
      this.current = undefined
      this.editing = false
      this.back()
    } else {
      firebase.push(`events`, event)

      this.back()
    }
  }

  reset() {
    this.params = undefined
    this.current = undefined
    for (const label of this.labels.filter((item) => item.label !== 'category')) {
      label.reset()
      if (label.placeholder) {
        label.value = label.placeholder
      }
    }
    this.requestRender()
  }

  #onclick = ({ target }) => {
    if (target.classList.contains('save')) this.save()
    if (target.classList.contains('back')) this.back()
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this.#onclick)
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#onclick)
  }

  static styles = [
    css`
      :host {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      flex-container {
        overflow-y: auto;
      }

      md-outlined-text-field,
      md-outlined-select,
      label {
        margin-top: 16px;
        width: 100%;
      }
      md-fab {
        position: absolute;

        bottom: 24px;
      }
      md-checkbox {
        margin-right: 12px;
      }

      .back {
        left: 24px;
      }

      .save {
        right: 24px;
      }
    `
  ]

  render() {
    return html`
      <flex-container>
        <md-outlined-text-field label="name" required></md-outlined-text-field>
        <md-outlined-text-field label="startDate" type="date" value=${formatDate()} required></md-outlined-text-field>
        <md-outlined-text-field label="endDate" type="date" value=${formatDate()} required></md-outlined-text-field>
        <md-outlined-text-field label="startTime" type="time" value="17:00" required></md-outlined-text-field>
        <md-outlined-text-field label="endTime" type="time" value="03:00" required></md-outlined-text-field>

        <custom-typography><h4>adjustments</h4></custom-icon></custom-typography>

        ${this.categories.map(
          (category) =>
            html`
              <md-outlined-text-field
                class="adjustment"
                label=${category}
                value=${this.current?.adjustments[category]}
                type="number"
                placeholder="0"
                required
              ></md-outlined-text-field>
            `
        )}
      </flex-container>
      <md-fab class="back"><custom-icon slot="icon" icon="arrow_back"></custom-icon></md-fab>
      <md-fab class="save"><custom-icon slot="icon">save</custom-icon></md-fab>
    `
  }
}
