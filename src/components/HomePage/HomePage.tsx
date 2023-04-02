import React  from "react";
import { Button ,Box, WrapItem,Wrap} from "@chakra-ui/react";
import {Routes,Route,useNavigate} from "react-router-dom";
import { Layout } from "../Layout/Layout";
import * as firebase from 'firebase/app';
import { useAuthState} from 'react-firebase-hooks/auth';
import { getAuth ,signInWithPopup,GoogleAuthProvider} from 'firebase/auth';

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
export  const HomePage = () => { 
        const [user,loading,error]=useAuthState(auth);
    const navigate =useNavigate() ;
        const navigateToCall= ()=> { 
        navigate('/call') ;
    }
    const navigateToRecieve= ()=> { 
        navigate('/recieve') ;
    }
    const HomePage = <>
        <div id="banner">
            <h1>Moice v2</h1>
            <p>The revolution messenging app , powered by peerjs</p>
        </div>
        <Wrap spacing='30px' justify='center'>
            <WrapItem>
                <Button onClick={navigateToCall}>Connect to your peer</Button>
            </WrapItem>
            <WrapItem>
                <Button onClick={navigateToRecieve}>Wait for connection</Button>
            </WrapItem>
        </Wrap>
    </>;

    return (
        <Layout>
            {
                user ? HomePage : <SignIn />
            }
        </Layout>
    )
}
function SignIn() { 
    const signInWithGoogle = () => {
      signInWithPopup(auth, new GoogleAuthProvider());
    }
  return (
      <Button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</Button>
  )
}
function waitForConnection(){ 
    // TODO: Init peerjs and wait for connection 
    return ( 
        <>
        </>
    )
}