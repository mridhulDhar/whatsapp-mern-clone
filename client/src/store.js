import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './component/features/chatSlice';
import userReducer from './component/features/userSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
    },
});