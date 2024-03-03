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
      <span name="add">@symbol-add</span>
      <span name="arrow_back">@symbol-arrow_back</span>
      <span name="menu">@symbol-menu</span>
      <span name="menu_open">@symbol-menu_open</span>
      <span name="edit">@symbol-edit</span>
      <span name="save">@symbol-save</span>
      <span name="search">@symbol-search</span>
      <span name="delete">@symbol-delete</span>
      <span name="voting_chip">@symbol-voting_chip</span>
      <span name="check">@symbol-check</span>+
      <span name="shopping_cart_checkout">@symbol-shopping_cart_checkout</span>
    </template>
  </custom-icon-set>
`
