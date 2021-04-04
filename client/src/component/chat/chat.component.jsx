import React, { useState, useEffect } from 'react';
import './chat.styles.css';
import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined } from "@material-ui/icons";
import ChatMessage from '../chat-message/chat-message.component';
import MicIcon from '@material-ui/icons/Mic';
import axios from '../../axios/axios';
import { useParams } from 'react-router';
import db from '../../firebase';
import Pusher from 'pusher-js';
import { useSelector } from "react-redux";
import { selectUser } from '../features/userSlice';
import { selectChatId, selectChatName } from '../features/chatSlice';
import { ReactMic } from "react-mic";

const pusher = new Pusher('1ee53ccd0ce9295fc668', {
    cluster: 'us2'
});

const Chat = ({ currentUser }) => {

    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    const [record, setRecord] = useState(false);
    const [filePath, setFilePath] = useState("");

    const [theme, setTheme] = useState("");


    const chatId = useSelector(selectChatId);
    const chatName = useSelector(selectChatName);
    const [messages, setMessages] = useState([]);






    const getConversation = async (chatId) => {

        if (chatId) {
            await axios.get(`/get/conversation?id=${chatId}&sid=${currentUser.uid}`).then((res) => {
                setMessages(res.data)
            });
        }
    }


    useEffect(() => {

        pusher.unsubscribe('messages');
        getConversation(chatId);

        const channel = pusher.subscribe('messages');
        channel.bind('newMessage', (data) => {
            getConversation(chatId);
        });

    }, [chatId]);


    useEffect(() => {
        let e = false;
        let type = "file";
        
        if(filePath){
            sendMessage(e, filePath, type, theme);
        }
        


    }, [filePath]);


    const sendMessage = async (e, filePath, type, theme) => {
        if (e) {
            e.preventDefault();
        }


       
        let arrSender = currentUser.uid.split("");
        let arrReceiver = chatId ? chatId.split("") : '';


        let mixedId = '';
        for (let i = 0; i < arrReceiver.length; i++) {
            arrSender.push(arrReceiver[i]);
        }

        arrSender.sort(function (a, b) {
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        });

        for (let i = 0; i < arrSender.length; i++) {
            mixedId = mixedId + arrSender[i];
        }

        //console.log(mixedId);

        await axios.post(`/new/message/sender?id=${currentUser.uid}`, {
            message: input,
            filePath: filePath,
            type: type,
            theme: theme,
            timestamp: Date.now(),
            user: {
                displayName: currentUser.displayName,
                email: currentUser.email,
                uid: mixedId
            }
        });

        await axios.post(`/new/message/receiver?id=${chatId}`, {
            message: input,
            filePath: filePath,
            type: type,
            theme: theme,
            timestamp: Date.now(),
            user: {
                displayName: currentUser.displayName,
                email: currentUser.email,
                uid: mixedId
            }
        });

        setInput("");
    };


    const startRecording = () => {
        setRecord(true);
    };

    const stopRecording = () => {
        setRecord(false);
    };

    const onData = (recordedBlob) => {
        // console.log(recordedBlob);
    };


    const onStop = async (recordedBlob) => {


        let filePath = await audioFileUpload(recordedBlob);
        console.log(filePath);
        setTheme("audio");
        setFilePath(filePath.data);


    }





    const audioFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("track", file.blob);
        console.log('inside audioFileUpload room id', chatId);
        let response = await axios.post('/new/upload-voice', formData);
        return response;
    };



    const onFileChange = async (e) => {
        let filePath = await imageMsgFileUpload(e.target.files[0]);
        //console.log(filePath);
        setTheme('image');
        setFilePath(filePath.data);
    }

    const imageMsgFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('imageMsg', file, file.name);
        const response = axios.post('/new/upload-image', formData);
        return response;
    }





    return (
        <div className='chat'>
            <div className='chatHeader'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}></Avatar>
                <div className='chatHeaderInfo'>
                    <h3>{chatName}</h3>
                    <p>{currentUser.uid === chatId ? 'Online' : ''}</p>
                </div>
                <div className='chatHeaderRight'>
                    <IconButton>
                        <SearchOutlined></SearchOutlined>
                    </IconButton>


                    <div className='file-share'>
                        <input type="file" onChange={(e) => onFileChange(e)}></input>
                        <IconButton>
                            <AttachFile></AttachFile>
                        </IconButton>

                    </div>



                    <IconButton>
                        <MoreVert></MoreVert>
                    </IconButton>
                </div>

            </div>


            <div className='chatBody'>

                {
                    messages.map(({ user, _id, message, timestamp, filePath, type, theme }) => (
                        <ChatMessage currentUser={currentUser} id={_id} sender={user} message={message} timestamp={timestamp} filePath={filePath} type={type} theme={theme} ></ChatMessage>
                    ))
                }




            </div>


            <div className='chatFooter'>
                <InsertEmoticon></InsertEmoticon>

                <form>
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder='type a message' type='text'></input>
                    <button onClick={sendMessage} type='submit'>Send a message</button>
                </form>
                <ReactMic record={record} onStop={onStop} onData={onData} visualSetting="frequencyBars" className="sound-wave" strokeColor="#999" backgroundColor="#ffffff" echoCancellation="true" channelCount="2" />
                {record ? (<MicIcon onClick={stopRecording} className='icon-block active'></MicIcon>) : (<MicIcon className='icon-block' onClick={startRecording} ></MicIcon>)}

            </div>
        </div>
    );
}

export default Chat;