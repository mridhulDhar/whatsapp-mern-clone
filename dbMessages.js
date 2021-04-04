const mongoose=require('mongoose');
const whatsappSchema = mongoose.Schema({
    _id: String,
    chatName: String,
    conversation: [
        {
            message: String,
            filePath: String,
            type: String,
            theme: String,
            timestamp: String,
            user: {
                displayName: String,
                email: String,
                uid: String
            }
        }
    ]

},{ typeKey: '$type' });




module.exports=mongoose.model('messagecontents', whatsappSchema);