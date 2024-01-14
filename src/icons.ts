import { html } from 'lit'
/**
 * Inlined icons as svg vs fetching the iconfont
 * Icons are inlined using the rollup-plugin-material-symbols [see](./config/rollup.config.js)
 *
 * Adding an icon
 * go to https://fonts.google.com/icons
 * find the name of the desired icon
 *
 * add to iconset like
 * <span name="icon_name">@"symbol"-icon_name></span>
 *
 * use in app
 * <custom-icon icon="icon_name"></custom-icon>
 * <custom-icon-button icon="icon_name"></custom-icon-button>
 */
export default html`
  <custom-icon-set>
    <template>
      <span name="menu">@symbol-menu></span>
      <span name="menu_open">@symbol-menu_open></span>
    </template>
  </custom-icon-set>
`
