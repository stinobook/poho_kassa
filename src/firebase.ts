// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, signOut, sendSignInLinkToEmail as _sendSignInLinkToEmail } from 'firebase/auth'
import {
  get as _get,
  push as _push,
  set as _set,
  remove as _remove,
  update as _update,
  getDatabase,
  ref,
  onChildAdded as _onChildAdded,
  onChildRemoved as _onChildRemoved,
  onChildChanged as _onChildChanged
} from 'firebase/database'
import Router from './routing.js'
import { getStorage, ref as fileref, uploadBytes as _uploadBytes, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyASfmIWBP0bBdwd3uIWT9cxkaTV6DsncZE',
  authDomain: 'poho-app-8dce1.firebaseapp.com',
  projectId: 'poho-app',
  storageBucket: 'poho-app.appspot.com',
  messagingSenderId: '878719433981',
  appId: '1:878719433981:web:8bbc0d0bb355da551b9294',
  measurementId: 'G-7C3T5W3P3D',
  databaseURL: 'https://poho-app-default-rtdb.europe-west1.firebasedatabase.app/'
}

export type FirebaseDatabaseFormat = object | any[] | number | string | boolean

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const database = getDatabase()
const storage = getStorage()

const uploadBytes = (path, data) => _uploadBytes(fileref(storage, path), data)

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

const update = async (path: string, value: any): Promise<void> => _update(ref(database, path), value)

const login = async () => {}

const logout = async () => {}

let userRoles

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
} else {
  if (!userRoles) userRoles = await get('users/' + auth.currentUser.uid + '/roles')
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

const actionCodeSettings = {
  url: 'http://localhost:8080/index.html',
  handleCodeInApp: true 
}

const sendSignInLinkToEmail = (email) => 
  _sendSignInLinkToEmail(auth, email, actionCodeSettings)

const _firebase = {
  get,
  push,
  set,
  userRoles,
  remove,
  update,
  auth,
  login,
  logout,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  uploadBytes,
  getDownloadURL,
  sendSignInLinkToEmail,
  signOut: () => signOut(auth)
}

globalThis.firebase = _firebase
declare global {
  var firebase: typeof _firebase
}
