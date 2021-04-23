import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { useEffect, useRef, useState } from 'react';

import { usePlayer } from '../../context/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './styles.module.scss';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isLooping,
    togglePlay,
    isPlaying,
    setPlayState,
    playNext,
    hasNext,
    playPrevious,
    hasPrevious,
    toggleLoop,
    toggleShuffle,
    isShuffling,
    clearPlayerState,
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleEpisodeEnd() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  function handleSeek(amount) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }
  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ backgroundColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>
            {episode
              ? convertDurationToTimeString(episode.duration)
              : '00:00:00'}
          </span>
        </div>
        {episode && (
          <audio
            src={episode.url}
            autoPlay
            loop={isLooping}
            ref={audioRef}
            onEnded={handleEpisodeEnd}
            onPlay={() => setPlayState(true)}
            onPause={() => setPlayState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type="button"
            disabled={!episode}
            className={styles.playButton}
            onClick={togglePlay}>
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar próximo" />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
