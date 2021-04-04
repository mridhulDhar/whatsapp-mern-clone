import React ,{ useEffect, useState }from 'react';
import Chat from '../chat/chat.component';
import SideBar from '../sidebar/sidebar.component';
import './whatsapp.styles.css';
const Whatsapp = ({currentUser}) => {

    return (
        <div className='whatsapp'>
            <SideBar currentUser={currentUser} dname={currentUser.displayName}></SideBar>
            <Chat currentUser={currentUser}></Chat>
        </div>
    );
}

export default Whatsapp;