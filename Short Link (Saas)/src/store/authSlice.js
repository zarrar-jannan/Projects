import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userInfo: null,
}

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        login(state,action){
            state.status = true;
            state.userInfo = action.payload
        },

        logout(state){
             state.status = false;
             state.userInfo = null
        },

        updateUser(state,action){
            state.status = true,
            state.userInfo = action.payload
        }
    }
})

export const {login,logout,updateUser} = authSlice.actions

