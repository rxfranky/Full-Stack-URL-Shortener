import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'authSlice',
    initialState: { isLoggedIn: false, userData: '' },
    reducers: {
        changeAuthState(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn
            state.userData = action.payload.user
        }
    }
})

export default authSlice;

export const authActions = authSlice.actions;
