import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import './sidebar.styles.css';
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from '../sidebar-chat/sidebarChat.component';
import db, { auth } from '../../firebase';
import axios from "../../axios/axios";
import { useStateValue } from '../state-provider/state-provider.component';
import Pusher from 'pusher-js';
import { selectUser } from '../features/userSlice';


const pusher = new Pusher('1ee53ccd0ce9295fc668', {
    cluster: 'us2'
});



const SideBar = ({ currentUser, dname }) => {

    const [chats, setChats] = useState([]);
    const [seed, setSeed] = useState("");

    const getChats = () => {
        axios.get(`/get/conversationList?id=${currentUser.uid}`).then((res) => {
            setChats(res.data);
            console.log(res.data);
        });
    };

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    useEffect(() => {
        getChats();
        
        const channel = pusher.subscribe('chats');
        channel.bind('newChat', function (data) {
            getChats()
        });

    }, []);

    console.log("Chats: ",chats)
    console.log("Chats: ",chats[0])

    return (
        <div className='sidebar'>
            <div className='header'>
                <div className='headerLeft'>
                    <Avatar src={currentUser.photoURL}></Avatar>
                    <span className='displayName'>{dname}</span>

                </div>

                <div className='headerRight'>
                    <IconButton>
                        <DonutLargeIcon></DonutLargeIcon>
                    </IconButton>

                    <IconButton>
                        <ChatIcon></ChatIcon>
                    </IconButton>

                    <div className='signout'>
                        <span onClick={()=> auth.signOut()}>Sign Out</span>
                    </div>
                </div>
            </div>



            <div className='search'>
                <div className='searchContainer'>
                    <SearchOutlined></SearchOutlined>
                    <input placeholder='search or start new chat' type='text'></input>
                </div>
            </div>




            <div className='sidebarChats'>
                
                <SidebarChat currentUser={currentUser} addnewChat></SidebarChat>
                {
                    chats.map(({ id, name, timestamp }) => (
                        <SidebarChat key={id} id={id} name={name} currentUser={currentUser}></SidebarChat>
                    ))
                }


            </div>

        </div>
    );
}

export default SideBar;