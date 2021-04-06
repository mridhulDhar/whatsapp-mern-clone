require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const Messages=require('./dbMessages');
const Pusher= require('pusher');
const cors=require('cors');
const path=require('path');

const { audioUpload, imageMsgFileUpload } = require('./helper');

const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
    appId: "1174730",
    key: "1ee53ccd0ce9295fc668",
    secret: "e71806d06dd51de070b2",
    cluster: "us2",
    useTLS: true
});





app.use(express.json());
app.use(cors());
app.use(express.static('uploads'));


const connectionURL ='mongodb+srv://admin:oT1OrtYcZ4bHUVhw@cluster0.j14st.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});



if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'client/build')));

    app.get('*',function(req,res){
        res.sendFile(path.join(__dirname,'client/build','index.html'))
    });
}



const db = mongoose.connection;
db.once("open", () => {
    console.log("DB CONNECTED...");
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {

        if (change.operationType === "insert") {

            pusher.trigger("chats", "newChat", {
                'change': change
            });
        }
        else if (change.operationType === 'update') {
            pusher.trigger('messages', 'newMessage', {
                'change': change
            });
        }
        else if (change.operationType === 'delete') {
            pusher.trigger('chats', 'deleteChat', {
                'change': change
            });
        }
        else {
            console.log('error triggering pusher..');
        }


    });
});






app.get('/', (req, res) => res.status(200).send('my first server response.....'));


app.delete('/remove/conversation', (req, res) => {
    Messages.deleteOne({ _id: req.query.id }).then((response) => res.status(201).json(response)).catch((error) => res.status(400).json("cannot remove"));
});




// new user signed up api------------------------------------------------------------------

app.post('/new/conversation', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data);
        }
    });
});

//------------------------------------------------------------------------------





// send message to both sender and receiver---------------------------------------------------------------------------

app.post('/new/message/sender', (req, res) => {
    Messages.updateMany(
        { _id: req.query.id },
        { $push: { conversation: req.body } },
        (err, data) => {
            if (err) {
                console.log('error saving the message...');
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.status(201).send(data);
            }
        }
    )
});



app.post('/new/message/receiver', (req, res) => {
    Messages.updateMany(
        { _id: req.query.id },
        { $push: { conversation: req.body } },
        (err, data) => {
            if (err) {
                console.log('error saving the message...');
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.status(201).send(data);
            }
        }
    )
});
//----------------------------------------------------------------------------------------------------------------------


// fetch all conatcts---------------------------------------------------------------------------------

app.get('/get/conversationList', (req, res) => {
    const id = req.query.id;
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            data.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });
            let conversations = [];

            data.map((conversationData) => {
                if (conversationData._id !== id) {
                    const conversationInfo = {
                        id: conversationData._id,
                        name: conversationData.chatName,
                        timestamp: conversationData.conversation.length > 0 ? conversationData.conversation[0].timestamp : ''
                    }
                    conversations.push(conversationInfo);
                }

            });
            res.status(200).send(conversations);
        }
    });
});
//-------------------------------------------------------------------------------------------------------------------------


// fetch particular 1 to 1 chats --------------------------------------------------------------------------------------

app.get('/get/conversation', (req, res) => {
    const id = req.query.id;
    const sId = req.query.sid;



    let arrSender = id ? id.split("") : "";
    let arrReceiver = sId ? sId.split("") : "";
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


    Messages.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            let allMessages = data.length > 0 ? data[0].conversation : [];
            let personalMessages = [];

            for (let i = 0; i < allMessages.length; i++) {
                if (allMessages[i].user.uid === mixedId) {
                    personalMessages.push(allMessages[i]);
                }
            }
            res.status(200).send(personalMessages);
        }
    });
});
//----------------------------------------------------------------------------------------------------------------------------------


// fetch last message api------------------------------------------------------------------------------------

app.get('/get/lastMessage', (req, res) => {
    const id = req.query.id;
    const sId = req.query.sid;


    let arrSender = id ? id.split("") : "";
    let arrReceiver = sId ? sId.split("") : "";
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



    Messages.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {


            let allMessages = data.length > 0 ? data[0].conversation : [];
            let personalMessages = [];

            for (let i = 0; i < allMessages.length; i++) {
                if (allMessages[i].user.uid === mixedId) {
                    personalMessages.push(allMessages[i]);
                }
            }




            let convData = personalMessages.length > 0 ? personalMessages : [];
            convData.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });
            res.status(200).send(convData[0]);
        }
    });
});

//------------------------------------------------------------------------------------------------------------------


// file and voice uploads api----------------------------------------------
app.post('/new/upload-voice', audioUpload, (req, res) => {

    try {
        let filePath = '';
        if (req.file.filename) {
            filePath = `${process.env.BASE_PATH}:${port}/${process.env.AUDIO_PATH}/${req.file.filename}`;
        }
        res.status(200).send(filePath);
    } catch (error) {
        res.status(400).send(error.message);
    }

});



app.post('/new/upload-image', imageMsgFileUpload, (req, res) => {
    try {
        let filePath = '';
        if (req.file.filename) {
            filePath = `${process.env.BASE_PATH}:${port}/${process.env.IMAGE_MSG_PATH}/${req.file.filename}`;
        }
        res.status(200).send(filePath);
    } catch (error) {
        res.status(400).send(error.message);
    }
});






app.listen(port, () => console.log(`listening on localhost:${port}`));