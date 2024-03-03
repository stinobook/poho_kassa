import { css } from '@vandeurenglenn/lite'

export const scrollbar = css`
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
`
