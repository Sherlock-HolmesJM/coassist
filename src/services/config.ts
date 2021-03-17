// export const config = {
//   apiKey: 'AIzaSyBS1llIrkLST2KKAVe_dyC7_SxyKQBg4sI',
//   authDomain: 'real-estate-esy.firebaseapp.com',
//   databaseURL: 'https://real-estate-esy-default-rtdb.firebaseio.com',
//   projectId: 'real-estate-esy',
//   storageBucket: 'real-estate-esy.appspot.com',
//   messagingSenderId: '240404895420',
//   appId: '1:240404895420:web:1ee14cc423cb8b633ce2b9',
// };
export const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_DATABASEURL,
  databaseURL: process.env.REACT_APP_PROJECTID,
  projectId: process.env.REACT_APP_AUTHDOMAIN,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};

export default config;
