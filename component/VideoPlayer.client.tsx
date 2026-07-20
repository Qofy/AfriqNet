"use client";
import React, { useEffect, useRef, useCallback, useMemo, FC } from "react";
import { Play, Pause } from "lucide-react";
import {
setPlaying, setShowOverlay,setCurrentTime,setDuration,setLastSaved,setResumeNotice,
clearResumeNotice, setIsFullscreen,setErrorMessage,clearErrorMessage,setNowTick,
setLoading,setError
} from '@/features/videoPlayerSlice'
import { useDispatch, useSelector } from "react-redux";

interface VideoPlayerProps {
  src: string;
  autoplay?: boolean;
  className?: string;
  contentId?: string | null;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ src, autoplay = false, className = "w-full h-auto", contentId = null }) => {

  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    playing,showOverlay,currentTime,duration,lastSaved, resumeNotice,
    isFullscreen,errorMessage,nowTick
  } = useSelector((store) => store.videoplayer)

  //seting overlay for autoplay
useEffect(()=>{
  dispatch(setShowOverlay(!autoplay));
},[autoplay, dispatch]);

useEffect(()=>{
  if(!lastSaved)return;
  const init = setTimeout(()=>dispatch(setNowTick(Date.now())), 0);
  const t = setInterval(()=> dispatch(setNowTick(Date.now())), 1000)
  return ()=>{
    clearInterval(t);
    clearTimeout(init);
  }
}, [lastSaved, dispatch]);

//helper for sender progress
const postProgress = useCallback(async(position, dur)=>{
  if (!contentId) return;

  dispatch(setLoading(true));
  try{
    await saveProgress(contentId, position,dur);
    dispatch(setLastSaved(Date.now()));
  }catch(error){
    dispatch(setError(error.message));
  }finally{
    dispatch(setLoading(false));
  }
}, [contentId, dispatch]);

//Video event Listeners
useEffect(()=>{
  const video = videoRef.current;
  if(!video) return;

  const onPlay= ()=>{
    dispatch(setPlaying(true))
    dispatch(clearErrorMessage());
  };
  const onPause =()=>{
    dispatch(setPlaying(false));
  } ;
  const onError = ()=>{
    dispatch(setErrorMessage('Playing failed: media resource unavailable or not playable.'));
    console.error("Video element error", video.error);
  };
  const onTime = ()=>{
    dispatch(setCurrentTime(video.currentTime || 0));
    dispatch(setDuration(video.duration || 0))
  };

  video.addEventListener("play", onPlay);
  video.addEventListener('pause', onPause);
  video.addEventListener('error', onError);
  video.addEventListener('timeupdate', onTime);

  return()=>{
    video.removeEventListener('play', onPlay);
    video.removeEventListener('pause', onPause);
    video.removeEventListener('timeupdate', onTime);
    video.removeEventListener('error', onError);
  }
},[dispatch]);

// Fullscreen Tracking changes
useEffect(()=>{
  function onFullChange(){
    dispatch(setIsFullscreen(!!document.fullscreenElement));
  };
  document.addEventListener('fullscreenchange', onFullChange)
  return ()=> document.removeEventListener('fullscreenchange', onFullChange);
},[dispatch])

//fetching last known progress
useEffect(()=>{
  const video = videoRef.current;
  if(!video || !contentId) return;
  let cancelled = false;
  async function loadProgress() {
    dispatch(setLoading(true));
    try{
      const data = await fetchProgress(contentId);
      if(data && !cancelled && data.position > 0){
        const onLoaded =()=>{
          try{
            video.currentTime = Math.min(data.position, video.duration || data.position);
            dispatch(setResumeNotice(data.position));
            setTimeout(()=>dispatch(clearResumeNotice()), 3000);
          }catch{}
          video.removeEventListener('loadedmetadata', onLoaded);
        };
        if(video.readyState >= 1){
          try{ video.currentTime = Math.min(data.position, video.duration || data.position); }catch{}
        } else {
          video.addEventListener('loadedmetadata', onLoaded);
        }
      }
    }catch(err){
      dispatch(setError(err.message));
    }finally{
      dispatch(setLoading(false));
    }
  }
  loadProgress();
  return ()=>{cancelled = true};
},[contentId,dispatch])

//Autoplay and progress reporting
useEffect(()=>{
  const video = videoRef.current;
  if(!video)return;
  if(autoplay){
    const p = video.play();
    if(p && typeof p.then === 'function'){
      p.catch(()=>{
        dispatch(setShowOverlay(true))
      })
    }
  }

  if (contentId){
    progressIntervalRef.current = setInterval(()=>{
      const v = videoRef.current;
      if (!v)return
      postProgress(v.currentTime || 0, v.duration || null);
    }, 5000);
    const handlePause =()=>{
      const v = videoRef.current
      if(!v) return;
      postProgress(v.currentTime || 0, v.duration || null);
    }

    window.addEventListener('pagehide', handlePause);
    window.addEventListener('beforeunload', handlePause);
    video.addEventListener('pause', handlePause);

    return ()=>{
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      window.removeEventListener('pagehide', handlePause)
      window.removeEventListener('beforeunload', handlePause)
      try{
        video.removeEventListener('pause', handlePause);}catch{}
    };
  }
},[autoplay,contentId, postProgress,dispatch]);

function togglePlay(e){
  e?.preventDefault();
  const video=videoRef.current;
  if(!video)return;
  if(video.paused){
    const p = video.play();
    if(p && typeof p.then === 'function'){
      p.catch((err)=>{
        console.error('Play Failed', err);
        dispatch(setErrorMessage('Unable to start playback. Tap play to try again.'));
      });
    }
  }else{
    video.pause();
  }
}
  function formatTime(s) {
    if (!s || isNaN(s) || !isFinite(s)) return "0:00";
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    const min = Math.floor(s / 60);
    return `${min}:${sec}`;
  }

  const lastSavedLabel = useMemo(() => {
    if (!lastSaved) return null;
    if (!nowTick) return 'just now';
    const diff = Math.floor((nowTick - lastSaved) / 1000);
    if (diff < 5) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    const m = Math.floor(diff / 60);
    return `${m}m ago`;
  }, [lastSaved, nowTick]);

  function onSeekChange(e) {
    const val = Number(e.target.value);
    const video = videoRef.current;
    if (!video || isNaN(val)) return;
    dispatch(setCurrentTime(val));
    video.currentTime = val;
  }

  function onSeekPointerDown() {
    dispatch(setShowOverlay(true));
  }

  function onSeekPointerUp() {
    const video = videoRef.current;
    if (!video) return;
    postProgress(video.currentTime || 0, video.duration || null);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        const el = containerRef.current || videoRef.current;
        if (el && el.requestFullscreen) {
          await el.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
      }
    } catch {}
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={src}
        playsInline
        className="w-full h-full object-contain bg-black"
      />

      {/* Center overlay play/pause button (shown when overlay enabled) */}
      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="bg-black/60 hover:bg-black/70 text-white p-4 rounded-full flex items-center justify-center pointer-events-auto"
          >
            {playing ? <Pause size={28} /> : <Play size={28} />}
          </button>
        </div>
      )}

      {/* Top-right time / saved badge */}
      <div className="absolute right-2 top-2 sm:right-4 sm:top-4 bg-black/50 text-white px-2 py-1 rounded-md text-xs sm:text-sm backdrop-blur-sm flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3">
        <div className="font-medium">{formatTime(currentTime)} / {formatTime(duration)}</div>
        <div className="text-2xs sm:text-xs text-white/80">{lastSavedLabel ? `Saved ${lastSavedLabel}` : ''}</div>
      </div>

      {/* Resume notice */}
      {resumeNotice !== null && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-6 bg-black/70 text-white px-4 py-2 rounded-md text-sm">
          Resumed to {formatTime(resumeNotice)}
        </div>
      )}
        {/* Playback error banner */}
        {errorMessage && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-16 bg-red-700/80 text-white px-4 py-2 rounded-md text-sm">
            {errorMessage}
          </div>
        )}
      {/* Progress / seek bar */}
      <div className="absolute left-0 right-0 bottom-20 sm:bottom-16 px-4 sm:px-6">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={onSeekChange}
          onPointerDown={onSeekPointerDown}
          onPointerUp={onSeekPointerUp}
          className={`w-full h-1 appearance-none rounded-lg ${playing ? 'bg-red-500/30 accent-red-400' : 'bg-white/30 accent-white'}`}
        />
      </div>

      {/* Mobile-friendly bottom control row: centered on small screens, left/right on larger */}
      <div className="absolute left-0 right-0 bottom-4 flex items-center justify-center sm:justify-start gap-4 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
            className={`${playing ? 'bg-red-600 hover:bg-red-700' : 'bg-black/60 hover:bg-black/70'} text-white p-3 sm:p-2 rounded-full flex items-center justify-center shadow-md`}
          >
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="bg-black/60 hover:bg-black/70 text-white p-3 sm:p-2 rounded-full flex items-center justify-center shadow-md"
          >
            {!isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9V3h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 15v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 3h-6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 21v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3H3v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 21h5v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 8V3h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 16v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
