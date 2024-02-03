import { html, LiteElement, query } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import '@vandeurenglenn/lit-elements/icon-set.js'
import '@vandeurenglenn/lit-elements/theme.js'
import '@vandeurenglenn/lit-elements/drawer-layout.js'
import '@vandeurenglenn/lit-elements/selector.js'
import '@vandeurenglenn/lit-elements/pages.js'
import icons from './icons.js'
import Router from './routing.js'
// import default page
import './views/login.js'
import { CustomSelector } from '@vandeurenglenn/lit-elements/selector.js'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCaKlJXmek0TtPBocP0FXWRuUxItL1yZx0',
  authDomain: 'kassa-systems.firebaseapp.com',
  projectId: 'kassa-systems',
  storageBucket: 'kassa-systems.appspot.com',
  messagingSenderId: '1006430419680',
  appId: '1:1006430419680:web:03bd1a5b3266e264d76e85',
  measurementId: 'G-0FF6DRPT6D'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
console.log(app)

@customElement('po-ho-shell')
export class PoHoShell extends LiteElement {
  router: Router

  selectorSelected({ detail }: CustomEvent) {
    location.href = Router.bang(detail)
  }

  @query('custom-selector')
  selector: CustomSelector

  @query('custom-pages')
  pages

  select(selected) {
    console.log({ selected })

    this.selector.select(selected)
  }

  async connectedCallback() {
    const auth = await getAuth(app)
    await auth.authStateReady()
    if (!auth.currentUser) {
      location.hash = Router.bang('login')
    }
    console.log(auth)
    this.router = new Router(this)
  }

  render() {
    return html`
      <style>
        custom-pages {
          width: 100%;
          height: 100%;
          display: block;
        }
      </style>
      <!-- theme handler, see rollup config in .config dir, can add own theme instead... -->
      <custom-theme load-icons="false" load-font="false"></custom-theme>
      <!-- just cleaner -->
      ${icons}

      <!-- see https://vandeurenglenn.github.io/custom-elements/ -->
      <custom-drawer-layout appBarType="small" keep-closed>
        <span slot="top-app-bar-title">Poho</span>
        <span slot="drawer-headline"> menu </span>
        <custom-selector
          attr-for-selected="route"
          default-selected="sales"
          slot="drawer-content"
          @selected=${this.selectorSelected}
        >
          <custom-drawer-item route="sales"> Verkoop </custom-drawer-item>
          <custom-drawer-item route="checkout"> Afsluit </custom-drawer-item>
          <custom-drawer-item route="attendance"> Aanwezigheidslijst </custom-drawer-item>
          <custom-drawer-item route="prices"> Prijslijst </custom-drawer-item>
        </custom-selector>

        <custom-pages attr-for-selected="route" default-selected="sales">
          <login-view route="login"> </login-view>
          <sales-view route="sales"> </sales-view>
          <attendance-view route="attendance"> </attendance-view>
          <checkout-view route="checkout"> </checkout-view>
          <prices-view route="prices"> </prices-view>
        </custom-pages>
      </custom-drawer-layout>
    `
  }
}
