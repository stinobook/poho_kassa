import { PoHoShell } from './shell.js'

export default class Router {
  host: PoHoShell

  constructor(host: PoHoShell) {
    this.host = host

    globalThis.onhashchange = this.#onhashchange
    if (!location.hash) {
      location.hash = Router.bang('sales')
    } else this.#onhashchange()
  }

  static bang(route: string) {
    return `#!/${route}`
  }

  static debang(route: string) {
    return route.split('#!/')[1]
  }

  #onhashchange = async () => {
    const afterBang = Router.debang(location.hash)
    this.host.selector.select(afterBang)

    if (!customElements.get(`./${afterBang}.js`)) await import(`./${afterBang}.js`)
    this.host.pages.select(afterBang)
  }
}
