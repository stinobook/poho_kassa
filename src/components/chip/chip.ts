import { LiteElement, customElement, html, property } from '@vandeurenglenn/lite'
import { StyleList, css } from '@vandeurenglenn/lite/element'

@customElement('chip-element')
export class ChipElement extends LiteElement {
  @property()
  accessor name

  @property()
  accessor avatar

  onChange(propertyKey: string, value: any): void {
    if (propertyKey === 'avatar') {
      if (value) this.setAttribute('has-avatar', '')
      else this.removeAttribute('has-avatar')
    }
  }

  static styles?: StyleList = [
    css`
      :host {
        display: inline-flex;
        align-items: center;
        height: 74px;
        border-radius: 50px var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) 50px;
        box-shadow: 0 15px 10px -10px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3),
          0 0 40px rgba(0, 0, 0, 0.1) inset;
        min-width: max-content;
        pointer-events: auto !important;
        cursor: pointer;
        align-items: center;
        box-sizing: border-box;
        padding: 8px 12px 8px 6px;
      }

      img {
        overflow: hidden;
        object-fit: cover;
        background: no-repeat;
        background-size: contain;
      }

      .avatar {
        height: 98%;
        border-radius: 50%;

        margin-right: 12px;
        pointer-events: none;
      }

      custom-typography {
        display: flex;
      }
    `
  ]

  _renderAvatar() {
    if (!this.avatar) return ''
    return html`
      <img
        class="avatar"
        loading="lazy"
        src=${this.avatar} />
    `
  }

  render() {
    return html` ${this._renderAvatar()} ${this.name} `
  }
}
