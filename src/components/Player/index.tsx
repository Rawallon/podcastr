import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { useEffect, useRef, useState } from 'react';

import { usePlayer } from '../../context/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './styles.module.scss';

export default function Player() {
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

  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [audioVolume, setAudioVolume] = useState(50);
  const [muteAudioVolume, setMuteAudioVolume] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageVolume = localStorage.getItem('audioVolume');
      if (storageVolume) {
        setAudioVolume(Number(storageVolume));
      }
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
          if (audioRef.current.paused) {
            audioRef.current.play();
          } else {
            audioRef.current.pause();
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = Number(audioVolume) / 100;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioVolume, episodeList]);

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

  function handleChangeVolume(amount) {
    localStorage.setItem('audioVolume', amount);
    audioRef.current.volume = amount / 100;
    setAudioVolume(amount);
  }
  function handleMute() {
    if (!muteAudioVolume) {
      setMuteAudioVolume(audioVolume);
      audioRef.current.volume = 0;
      setAudioVolume(0);
      return;
    }
    setMuteAudioVolume(0);
    handleChangeVolume(muteAudioVolume);
  }
  return (
    <div className={styles.playerWrapper}>
      <div
        className={styles.showPlayerButton}
        onClick={() => setIsVisible(!isVisible)}>
        {audioVolume >= 70 ? (
          <img src="/high-volume.svg" alt="Volume" loading="eager" />
        ) : (
          ''
        )}
        {audioVolume < 70 && audioVolume >= 25 ? (
          <img src="/medium-volume.svg" alt="Volume" loading="eager" />
        ) : (
          ''
        )}
        {audioVolume < 25 ? (
          <img src="/low-volume.svg" alt="Volume" loading="eager" />
        ) : (
          ''
        )}
      </div>
      <div
        className={`${styles.playerContainer} ${
          isVisible ? styles.isVisible : ''
        }`}>
        <div
          className={`${styles.showPlayerButton} ${styles.showPlayerButtonOpen}`}
          onClick={() => setIsVisible(!isVisible)}>
          {audioVolume >= 70 ? (
            <img src="/high-volume.svg" alt="Volume" loading="eager" />
          ) : (
            ''
          )}
          {audioVolume < 70 && audioVolume >= 25 ? (
            <img src="/medium-volume.svg" alt="Volume" loading="eager" />
          ) : (
            ''
          )}
          {audioVolume < 25 ? (
            <img src="/low-volume.svg" alt="Volume" loading="eager" />
          ) : (
            ''
          )}
        </div>

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

            <div
              className={styles.volume}
              onMouseEnter={() => setIsVolumeOpen(true)}
              onMouseLeave={() => setIsVolumeOpen(false)}>
              <Slider
                vertical
                className={`${styles.seek} ${
                  !isVolumeOpen ? styles.hidden : styles.visible
                }`}
                max={100}
                value={audioVolume}
                onChange={handleChangeVolume}
                trackStyle={{
                  backgroundColor: '#04d361',
                  width: '20%',
                  left: '50%',
                }}
                railStyle={{
                  backgroundColor: '#9f75ff',
                  width: '20%',
                  left: '50%',
                }}
                handleStyle={{
                  backgroundColor: '#04d361',
                  borderWidth: 4,
                  left: '50%',
                }}
              />
              <button
                type="button"
                disabled={!episode}
                onClick={() => handleMute()}>
                {audioVolume >= 70 ? (
                  <img src="/high-volume.svg" alt="Volume" loading="eager" />
                ) : (
                  ''
                )}
                {audioVolume < 70 && audioVolume >= 25 ? (
                  <img src="/medium-volume.svg" alt="Volume" loading="eager" />
                ) : (
                  ''
                )}
                {audioVolume < 25 ? (
                  <img src="/low-volume.svg" alt="Volume" loading="eager" />
                ) : (
                  ''
                )}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
