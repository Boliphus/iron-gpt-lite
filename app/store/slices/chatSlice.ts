import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { chatCompletion } from '../../services/openai';

export interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
}

interface ChatState {
  messages: ChatMsg[];
  sending: boolean;
  error?: string;
}

const initialState: ChatState = {
  messages: [],
  sending: false,
};

export const sendMessage = createAsyncThunk<
  string,              // return value
  string,              // user text
  { rejectValue: string }
>('chat/sendMessage', async (userText, { rejectWithValue }) => {
  try {
    return await chatCompletion(userText);
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'OpenAI error');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        id: Date.now().toString(),
        role: 'user',
        text: action.payload,
        ts: Date.now(),
      });
    },
    resetChat() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = undefined;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.messages.push({
          id: Date.now().toString() + '-bot',
          role: 'assistant',
          text: action.payload,
          ts: Date.now(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { addUserMessage, resetChat } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
