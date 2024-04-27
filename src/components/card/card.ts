import { LiteElement, customElement, html, property } from '@vandeurenglenn/lite'
import { StyleList, css } from '@vandeurenglenn/lite/element'

@customElement('card-element')
export class CardElement extends LiteElement {
  @property()
  accessor image

  @property()
  accessor avatar

  @property()
  accessor headline

  @property()
  accessor subline

  @property()
  accessor paydate

  onChange(propertyKey: string, value: any): void {
    if (propertyKey === 'avatar') {
      if (value) this.setAttribute('has-avatar', '')
      else this.removeAttribute('has-avatar')
    }
    if (propertyKey === 'paydate') {
      let expirationDate = new Date()
      expirationDate.setFullYear(expirationDate.getFullYear() -1)
      let oldDate = new Date(this.paydate)
      if (oldDate < expirationDate) this.shadowRoot.querySelector('span').classList.add('expired')
    }
  }

  static styles?: StyleList = [
    css`
      :host {
        width: 300px;
        min-height: 286px;
        display: block;
        border-radius: var(--md-sys-shape-corner-extra-large);

        position: relative;
        box-shadow: 0 15px 10px -10px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3),
          0 0 40px rgba(0, 0, 0, 0.1) inset;
        background: var(--md-sys-color-surface-variant);
        color: var(--md-sys-color-on-surface-variant);
      }
      .expired {
        background: var(--md-sys-color-on-error-container);
        color: var(--md-sys-color-error-container);
        border-radius: 0 0 var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large);
      }

      img {
        overflow: hidden;
        object-fit: cover;
        background: no-repeat;
      }

      .image {
        height: 100%;
        min-height: 150px;
        max-height: 150px;
        width: 100%;
        border-radius: var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) 0 0;
        background-size: cover;
      }

      .avatar {
        position: absolute;
        top: 86px;
        left: 16px;
        height: 100px;
        width: 100px;
        border-radius: 50%;
        border: 3px solid var(--md-sys-color-surface-variant);
        background-size: contain;
      }

      .content {
        display: flex;
        flex-direction: column;
        padding: 16px 24px 24px 24px;
        box-sizing: border-box;
      }

      :host([has-avatar]) .content {
        padding: 48px 24px 24px 24px;
      }

      custom-typography {
        display: flex;
      }
    `
  ]

  _renderImage() {
    if (!this.image) return ''
    return html` <img class="image" loading="lazy" src=${this.image} /> `
  }

  _renderAvatar() {
    if (!this.avatar) return ''
    return html` <img class="avatar" loading="lazy" src=${this.avatar} /> `
  }

  _renderHeadline() {
    if (!this.headline) return ''
    return html`<custom-typography type="title">${this.headline}</custom-typography>`
  }

  _renderSubline() {
    if (!this.subline) return ''
    return html`<custom-typography type="title" size="medium">${this.subline}</custom-typography>`
  }

  render() {
    return html`
      ${this._renderImage()} ${this._renderAvatar()}
      <span class="content">
        <flex-it></flex-it>
        ${this._renderHeadline()} ${this._renderSubline()}
        <slot></slot>
      </span>
    `
  }
}
