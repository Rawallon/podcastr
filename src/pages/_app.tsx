import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import Header from '../components/Header';
import Player from '../components/Player';
import { PlayerCtx } from '../context/PlayerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
  }
  function togglePlay() {
    setIsPlaying(!isPlaying);
  }
  function setPlayState(state) {
    setIsPlaying(state);
  }
  return (
    <PlayerCtx.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        togglePlay,
        isPlaying,
        setPlayState,
      }}>
      <div className={styles.appWrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerCtx.Provider>
  );
}

export default MyApp;
