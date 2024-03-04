// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, signOut } from 'firebase/auth'
import {
  get as _get,
  push as _push,
  set as _set,
  remove as _remove,
  getDatabase,
  ref,
  onChildAdded as _onChildAdded,
  onChildRemoved as _onChildRemoved,
  onChildChanged as _onChildChanged
} from 'firebase/database'
import Router from './routing.js'

const firebaseConfig = {
  apiKey: 'AIzaSyCaKlJXmek0TtPBocP0FXWRuUxItL1yZx0',
  authDomain: 'kassa-systems.firebaseapp.com',
  projectId: 'kassa-systems',
  storageBucket: 'kassa-systems.appspot.com',
  messagingSenderId: '1006430419680',
  appId: '1:1006430419680:web:03bd1a5b3266e264d76e85',
  measurementId: 'G-0FF6DRPT6D',
  databaseURL: 'https://kassa-systems-default-rtdb.europe-west1.firebasedatabase.app/'
}

export type FirebaseDatabaseFormat = object | any[] | number | string | boolean

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const database = getDatabase()
const get = async (path: string): Promise<FirebaseDatabaseFormat> => {
  const snap = await _get(ref(database, path))
  return snap.val()
}

const push = async (path: string, value: FirebaseDatabaseFormat): Promise<string> => {
  const snap = await _push(ref(database, path), value)
  return snap.key
}
const set = async (path: string, value: FirebaseDatabaseFormat) => _set(ref(database, path), value)

const remove = async (path: string): Promise<void> => _remove(ref(database, path))

const login = async () => {}

const logout = async () => {}

const auth = await getAuth(app)
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    if (!customElements.get('login-view')) {
      await import('./views/login.js')
    }
    location.hash = Router.bang('login')
  } else if (!location.hash || location.hash === '#!/login') {
    location.hash = Router.bang('sales')
  }
})
await auth.authStateReady()
if (!auth.currentUser) {
  location.hash = Router.bang('login')
}
const onChildAdded = (target, cb) => {
  _onChildAdded(ref(database, target), cb)
}
const onChildRemoved = (target, cb) => {
  _onChildRemoved(ref(database, target), cb)
}

const onChildChanged = (target, cb) => {
  _onChildChanged(ref(database, target), cb)
}
const _firebase = {
  get,
  push,
  set,
  remove,
  auth,
  login,
  logout,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  signOut: () => signOut(auth)
}

globalThis.firebase = _firebase
declare global {
  var firebase: typeof _firebase
}
