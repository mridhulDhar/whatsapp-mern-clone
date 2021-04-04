import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import './sidebarChat.styles.css';
import { Avatar } from "@material-ui/core";
import axios from '../../axios/axios';
import db from '../../firebase';
import { Link } from 'react-router-dom'
import { useStateValue } from '../state-provider/state-provider.component';
import Pusher from 'pusher-js';
import { selectUser } from '../features/userSlice';
import { setChat } from '../features/chatSlice';
import { useDispatch } from "react-redux";

const pusher = new Pusher('1ee53ccd0ce9295fc668', {
    cluster: 'us2'
});


const SidebarChat = ({ id, name, addnewChat,currentUser }) => {
    const dispatch = useDispatch();

    const [seed, setSeed] = useState("");

    const [lastMsg, setLastMsg] = useState("");
    const [lastTimestamp, setLastTimestamp] = useState("");




    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);


    useEffect(() => {
        getSidebarElement();

        const channel = pusher.subscribe('messages');
        channel.bind('newMessage', (data) => {
            getSidebarElement()
        });
    }, [id]);


    const getSidebarElement = () => {
        axios.get(`/get/lastMessage?id=${id}&sid=${currentUser.uid}`).then((res) => {
            setLastMsg(res.data.message)
            setLastTimestamp(res.data.timestamp)
        });
    }





    const addChat = () => {

        const chatName = prompt('please enter a chat name');
        

        if (chatName) {
            let chatId = '';
            axios.post('/new/conversation', {
                chatName: chatName
            });
        }
    }

    return !addnewChat ? (


        <div onClick={() => dispatch(
            setChat({
                chatId: id,
                chatName: name,
            })
        )} className='sidebarChat'>

            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}></Avatar>
            <div className='sidebarChatInfo'>
                <h2>{name}</h2>
                <p>{lastMsg}</p>
                <small>
                    {lastTimestamp ? new Date(parseInt(lastTimestamp)).toUTCString() : ''}
                </small>
            </div>

        </div>


    ) : (<div onClick={addChat} className='sidebarChat'>
       
    </div>);
}

export default SidebarChat;