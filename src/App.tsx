import React from 'react';
import './App.css';
import { HomePage } from './components/HomePage';
import {Routes,Route,BrowserRouter} from 'react-router-dom';
import * as firebase from 'firebase/app';
import { useAuthState} from 'react-firebase-hooks/auth';
import { getAuth ,signInWithPopup,GoogleAuthProvider} from 'firebase/auth';
import { Layout } from './components/Layout/Layout';
import { Button,Box} from '@chakra-ui/react';
const app= firebase.initializeApp({ 
  //Config here 
  apiKey: "AIzaSyCYuWITQe7ZPTqqliLgH8wWcDghidLO7F0",
  authDomain: "chat-app-460e1.firebaseapp.com",
  projectId: "chat-app-460e1",
  storageBucket: "chat-app-460e1.appspot.com",
  messagingSenderId: "890075504842",
  appId: "1:890075504842:web:0dfe207471c7eb7bff5433",
  measurementId: "G-R65R0RZ2BV"
})
const auth = getAuth(app) ;
function App() {
  const [user,loading,error]=useAuthState(auth);
  return (
    <>
    <Layout>
      <Box>
        {user ? <HomePage/> : <SignIn/>}
      </Box>
    </Layout>
    </>
  );
}

function SignIn() { 
    const signInWithGoogle = () => {
      signInWithPopup(auth, new GoogleAuthProvider());
    }
  return (
    <>
      <Button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</Button>
    </>
  )
}
export default App;
