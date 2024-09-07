import { css } from '@vandeurenglenn/lite'

export default css`
  * {
    user-select: none;
  }
  ::-webkit-scrollbar {
    width: 8px;
    border-radius: var(--md-sys-shape-corner-extra-large);
    background-color: var(--md-sys-color-surface-container-highest);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--md-sys-color-on-surface-container-highest);
    border-radius: var(--md-sys-shape-corner-extra-large);
    box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.5) inset;
  }
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    border-radius: var(--md-sys-shape-corner-extra-large);
    overflow-y: auto;
  }

  label {
    margin-right: 12px;
  }
  #card-main {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    background-color: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface-container-high);
    border-radius: var(--md-sys-shape-corner-extra-large);
    gap: 12px;
    box-sizing: border-box;
    padding: 12px;
    margin-top: 12px;
  }
  #card-main .date {
    width: 100%;
    margin: 12px;
    font-size: 1.2em;
    font-weight: bold;
  }
  #card-sub {
    font-size: 1em;
    font-weight: normal;
    background-color: var(--md-sys-color-surface-container-highest);
    border-radius: var(--md-sys-shape-corner-extra-large);
    color: var(--md-sys-color-on-primary-container);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 12px 24px;
    gap: 12px;
  }
  #card-sub-wide {
    font-size: 1em;
    font-weight: normal;
    background-color: var(--md-sys-color-surface-container-highest);
    border-radius: var(--md-sys-shape-corner-extra-large);
    color: var(--md-sys-color-on-primary-container);
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    width: 100%;
    padding: 12px;
    gap: 12px;
  }
  #card-sub-sub {
    font-size: 0.8em;
    font-weight: normal;
    position: relative;
  }
  #card-sub-sub span {
    float: left;
    clear: both;
  }
  #card-sub-details {
    font-weight: normal;
    display: inline-flex;
    flex-direction: column;
    gap: 12px;
  }
  md-list {
    background: unset;
    padding: 0;
  }
  details {
    background-color: var(--md-sys-color-surface-container-high);
    border-radius: var(--md-sys-shape-corner-extra-large);
    color: var(--md-sys-color-on-surface-container-high);
    padding: 12px;
  }

  details[open] summary ~ * {
    animation: open 0.3s ease-in-out;
  }

  @keyframes open {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  details summary::-webkit-details-marker {
    display: none;
  }

  details summary {
    position: relative;
    cursor: pointer;
    list-style: none;
  }

  details summary:after {
    content: '+';
    height: 0px;
    position: absolute;
    font-size: 1.75rem;
    line-height: 0;
    top: 8px;
    right: 0;
    font-weight: 200;
    transform-origin: center;
    transition: 200ms linear;
  }
  details[open] summary:after {
    transform: rotate(45deg);
    font-size: 2rem;
  }
  details summary {
    outline: 0;
  }
  .card-input {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    background-color: var(--md-sys-color-surface-container-high);
    border-radius: var(--md-sys-shape-corner-extra-large);
    color: var(--md-sys-color-on-surface-container-high);
    box-sizing: border-box;
    padding: 12px;
  }
  .card-input input {
    padding: 10px 15px;
    font-size: 1rem;
    color: var(--md-sys-color-on-primary);
    background: var(--md-sys-color-secondary);
    border: 0;
    border-radius: var(--md-sys-shape-corner-full);
    outline: 0;
  }

  #card-sub-wide:not(:has(details)),
  #card-sub-wide:not(:has(md-list)) {
    display: none;
  }
  .wide {
    flex-wrap: nowrap;
    width: 100%;
  }

  custom-tab.custom-selected {
    background: var(--md-sys-color-tertiary);
    border: none;
  }
  custom-tab.custom-selected {
    color: var(--md-sys-color-on-tertiary);
  }

  custom-tab {
    height: 45px;
    padding: 6px 12px;
    box-sizing: border-box;
    width: auto;
    border-radius: 25px;
    min-width: 100px;
  }
  custom-tabs {
    gap: 8px;
  }

  .books,
  .cash {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    transform: translateY(0%);
    z-index: 0;
    opacity: 1;
    position: relative;
  }
  .toggle {
    transform: translateY(1000%);
    z-index: 1;
    opacity: 0;
    position: absolute;
  }
  .cash #card-sub {
    width: 100%
  }
  .cash input {
    padding: 10px 10px 10px 15px;
    font-size: 1rem;
    color: var(--md-sys-color-on-secondary);
    background: var(--md-sys-color-secondary);
    border: 0;
    border-radius: 3px;
    outline: 0;
    margin-left: 24px;
    box-sizing: border-box;
    float:right;
    width: 70%;
  }
  .readonly {
    color: var(--md-sys-color-background) !important;
    background: var(--md-sys-color-on-background) !important;
  }

  .cash label {
    float: left;
    width: 100%;
    padding: 4px 12px;
    margin-right: 12px;
    font-size: 1rem;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
`
