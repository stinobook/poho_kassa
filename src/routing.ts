import { PoHoShell } from './shell.js'

export default class Router {
  host: PoHoShell

  #isReady: any

  constructor(host: PoHoShell) {
    this.host = host
    globalThis.onhashchange = this.#onhashchange
    this.#init()
  }

  ready = new Promise(resolve => (this.#isReady = resolve))

  async #init() {
    await firebase.userReady
    this.#onhashchange()
    this.#isReady(true)
  }

  static bang(route: string) {
    return `#!/${route}`
  }

  static debang(route: string) {
    return route.split('#!/')[1]
  }

  static parseHash(hash) {
    const afterBang = Router.debang(hash)
    const splitted = afterBang.split('?')
    const routes = splitted[0].split('/')
    const route = routes[0]
    const subRoutes = routes.slice(1, -1)
    const params = {}

    if (splitted[1]) {
      for (const item of splitted[1].split('&')) {
        const [key, value] = item.split('=')
        params[key] = value
      }
    }

    return { route, routes, subRoutes, params }
  }

  #onhashchange = async () => {
    const { route, params } = Router.parseHash(location.hash)
    this.host.select(route)
    if (!customElements.get(`./${route}-view`)) await import(`./${route}.js`)
    const selected = this.host.pages.querySelector('.custom-selected')
    this.host.selected = selected
    if (Object.keys(params).length > 0) selected.params = params
  }
}
