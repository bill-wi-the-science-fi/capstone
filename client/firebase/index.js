import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDysw5ohqF2A9_j8c732kpniZMhsenJigQ',
  authDomain: 'pay-eth-foward.firebaseapp.com',
  projectId: 'pay-eth-foward',
  storageBucket: 'pay-eth-foward.appspot.com',
  messagingSenderId: '817961753101',
  appId: '1:817961753101:web:9c951a0919813ca72fd344',
  measurementId: 'G-G3PJNEE59G'
}
firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export {storage, firebase as default}
