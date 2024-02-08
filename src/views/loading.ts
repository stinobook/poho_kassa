import { html, css, LiteElement } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'

@customElement('loading-view')
export class LoadingView extends LiteElement {
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
      /* HTML: <div class="loader"></div> */
      .loader {
        width: 55px;
        aspect-ratio: 1;
        --g1: conic-gradient(from 90deg at 3px 3px, #0000 90deg, #fff 0);
        --g2: conic-gradient(from -90deg at 22px 22px, #0000 90deg, #fff 0);
        background: var(--g1), var(--g1), var(--g1), var(--g2), var(--g2), var(--g2);
        background-size: 25px 25px;
        background-repeat: no-repeat;
        animation: l7 1.5s infinite;
      }
      @keyframes l7 {
        0% {
          background-position: 0 0, 0 100%, 100% 100%;
        }
        25% {
          background-position: 100% 0, 0 100%, 100% 100%;
        }
        50% {
          background-position: 100% 0, 0 0, 100% 100%;
        }
        75% {
          background-position: 100% 0, 0 0, 0 100%;
        }
        100% {
          background-position: 100% 100%, 0 0, 0 100%;
        }
      }
    `
  ]

  render() {
    return html`
      <h1>Loading...</h1>
      <h3>hang in there!</h3>
      <div class="loader"></div>
    `
  }
}
