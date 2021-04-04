import { useStateValue } from '../state-provider/state-provider.component';
import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import './chat-message.styles.css';
import { selectUser } from '../features/userSlice';



const ChatMessage = forwardRef((
    { id,currentUser, sender, message, timestamp,filePath,type,theme },
    ref
) => {
    
    const renderMsg=(message,filePath,type,theme)=>{
        if (type === "file") {
            if (theme === "audio") {
              return <audio src={filePath} controls />;
            } else if (theme === "image") {
              return <img style={{ width: "30vh" }} src={filePath} />;
            }
          }
          return message;
    }


    return (
        <p className={`chatMessage ${currentUser.email === sender.email && 'chatReceiver'}`}>
            <span className='chatName'>{sender.displayName}</span>
            {renderMsg(message,filePath,type,theme)}
            <span className='chatTimeStamp'>{new Date(parseInt(timestamp)).toDateString()}</span>
        </p>
    );
});


export default ChatMessage;