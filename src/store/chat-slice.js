import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  messages: [],
  totalQuantity: 0,
};

const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    setId(state, action) {
      state.id = action.payload.id;
    },
    addMessage(state, action) {
      state.messages.push({
        id: action.payload.id,
        content: action.payload.content,
        author: action.payload.author
      });
      state.totalQuantity++;
    },
    populateMessages(state, action) {
      state.messages = action.payload.messages;
      state.totalQuantity = action.payload.total;
    },
    resetChat(state) {
      state.id = '';
      state.messages = [];
      state.totalQuantity = 0;
    }
  },
});

export const chatActions = chatSlice.actions;
export default chatSlice;