import './App.css';
import SideBar from './component/sidebar/sidebar.component';
import Chat from './component/chat/chat.component';
import React, { useEffect, useState } from 'react';
import Pusher from "pusher-js";
import axios from './axios/axios';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './component/login/login.component';
import { auth, createUserProfileDocument } from './firebase'
import Whatsapp from './component/whatsapp-page/whatsapp';

class App extends React.Component {



  constructor() {
    super();

    this.state = {
      currentUser: null
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {

      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot(snapshot => {
          this.setState({
            currentUser: {
              ...snapshot.data()
            }
          });
        });
      }
      this.setState({ currentUser: userAuth });
      //this.setState({ currentUser: user });
      //console.log(user);
    });

  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div className="app">
        <div className='app__body'>
          {this.state.currentUser ? <Whatsapp currentUser={this.state.currentUser}></Whatsapp> : <Login></Login>}

        </div>

      </div>
    );
  }



}

export default App;
