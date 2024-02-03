import React, { useState, useEffect } from 'react';
import './App.css';

const Playlist = ({ playlist, playTrack }) => {
  return (
    <div className="playlist">
      <h2>Playlist</h2>
      <ul>
        {playlist.map((track, index) => (
          <li className='list' key={index} onClick={() => playTrack(index)}>
            {track.name || `Track ${index + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

const NowPlaying = ({ trackName }) => {
  return (
    <div className="now-playing">
      <h2>Now Playing</h2>
      <p className='list'>{trackName}</p>
    </div>
  );
};

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [audioRef, setAudioRef] = useState(null);

  useEffect(() => {
    // Load last playing track and playlist from localStorage on component mount
    const storedTrackIndex = localStorage.getItem('lastTrackIndex');
    const storedTrackTime = localStorage.getItem('lastTrackTime');
    const storedPlaylist = localStorage.getItem('playlist');

    if (storedTrackIndex !== null && !isNaN(storedTrackIndex)) {
      setCurrentTrackIndex(parseInt(storedTrackIndex));
    }

    if (audioRef && storedTrackTime !== null && !isNaN(storedTrackTime)) {
      audioRef.currentTime = parseFloat(storedTrackTime);
      audioRef.play();
    }

    if (storedPlaylist !== null) {
      setPlaylist(JSON.parse(storedPlaylist)); // Update playlist state with stored playlist
    }
  }, [audioRef]);

  useEffect(() => {
    // Save current track index and time to localStorage
    if (currentTrackIndex !== null) {
      localStorage.setItem('lastTrackIndex', currentTrackIndex.toString());
      localStorage.setItem('lastTrackTime', audioRef.currentTime.toString());
      localStorage.setItem('playlist', JSON.stringify(playlist)); // Store playlist in localStorage
    }
  }, [currentTrackIndex, audioRef, playlist]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setPlaylist(prevPlaylist => [...prevPlaylist, ...newFiles]); // Merge new files with existing playlist
    if (currentTrackIndex === null) {
      setCurrentTrackIndex(0); // Start playing the first track if no track is currently playing
    }
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    audioRef.src = URL.createObjectURL(playlist[index]);
    audioRef.play();
  };

  const skipTrack = () => {
    const nextIndex = currentTrackIndex + 1;
    if (nextIndex < playlist.length) {
      playTrack(nextIndex);
    } else {
      // Logic to handle end of playlist
      setCurrentTrackIndex(null);
    }
  };

  return (
    <div className='music'>
      <div className="m2">
        <input className='input_file' type="file" accept="audio/*" onChange={handleFileChange} multiple />
        <audio ref={(element) => setAudioRef(element)} onEnded={skipTrack} controls />
        <Playlist playlist={playlist} playTrack={playTrack} />
        {currentTrackIndex !== null && (
          <NowPlaying trackName={playlist[currentTrackIndex]?.name || 'No track playing'} />
        )}
      </div>
    </div>
  );
};

export default App;
