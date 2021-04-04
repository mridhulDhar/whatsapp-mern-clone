import { Button } from '@material-ui/core';
import React from 'react';
import './login.styles.css';
import { signInWithGoogle } from '../../firebase';
import { useStateValue } from '../state-provider/state-provider.component';
import { actionTypes } from '../../reducer';
import SignIn from '../signin/signin.component';
import SignUp from '../signup/signup.component';

const Login = () => {

    return (
        <div className="login">
            
            <div className='loginContainer'>
                <img src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' alt=''></img>
                <div className='sign-in-and-sign-up'>
                    <SignIn></SignIn>
                    <SignUp></SignUp>
                </div>


            </div>
        </div>
    );

}

export default Login;