import { createSlice } from "@reduxjs/toolkit";
// import { setError } from "./accountSlice";
// import { error } from "console";
// import { act } from "react";

const initialState ={
    playing:false,
    showOverlay:true,
    currentTime: 0,
    duration:0,
    lastSaved:null,
    resumeNotice:null,
    isFullscreen:false,
    errorMessage:null,
    nowTick:0,
    isLoading:false,
    error:null
}

const videoPlayerSlice = createSlice({
    name:"videoplayer",
    initialState, 
    reducers:{
        setPlaying(state, action){
            state.playing=action.payload;
            state.showOverlay= !action.payload;
            if(action.payload){
                state.errorMessage = null;
            }
        },
        setShowOverlay(state,action){
            state.showOverlay=action.payload;
        },
        setCurrentTime(state, action){
            state.currentTime=action.payload;
        },
        setDuration(state,action){
            state.duration=action.payload;
        },
        setLastSaved(state,action){
            state.lastSaved=action.payload;
        },
        setResumeNotice(state,action){
            state.resumeNotice=action.payload;
        },
        clearResumeNotice(state){
            state.resumeNotice =null;
        },
        setIsFullscreen(state,action){
            state.isFullscreen=action.payload
        },
        setErrorMessage(state,action){
            state.errorMessage = action.payload;
            state.playing=false;
            state.showOverlay=true
        },
        clearErrorMessage(state){
            state.errorMessage=null;
        },
        setNowTick(state,action){
            state.nowTick=action.payload;
        },
        setLoading(state,action){
            state.isLoading=action.payload;
        },
        setError(state,action){
            state.error=action.payload;
        },
        clearError(state){
            state.error=null;
        },
        resetPlayer(state){
            state.playing=false;
            state.showOverlay=true;
            state.currentTime=0;
            state.duration=0;
            state.resumeNotice=null;
            state.errorMessage=null;
        }
    }
})

export const {
  setPlaying,
  setShowOverlay,
  setCurrentTime,
  setDuration,
  setLastSaved,
  setResumeNotice,
  clearResumeNotice,
  setIsFullscreen,
  setErrorMessage,
  clearErrorMessage,
  setNowTick,
  setLoading,
  setError,
  clearError,
  resetPlayer
} = videoPlayerSlice.actions;

export async function fetchProgress(contentId){
    const res = await fetch(`/api/progress?contentId=${encodeURIComponent(contentId)}`);
    const json = await res.json();
    if(json?.success && json.data){
        return{
            position:Number(json.data.position || 0),
            duration:Number(json.data.duration || 0)
        };
    }
    return null;
}

export async function saveProgress(contentId, position, duration) {
    const payload = JSON.stringify({ contentId, position, duration });
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon("/api/progress", payload);
        return { success: true };
    }
    const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
    });
    if (!res.ok) {
        throw new Error("Failed to save progress");
    }
    return { success: true };
}
export default videoPlayerSlice.reducer