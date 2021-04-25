import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerCtxData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isShuffling: boolean;
  isLooping: boolean;
  isPlaying: boolean;
  playList: (list: Episode[], index: number) => void;
  play: (episode: Episode) => void;
  toggleLoop: () => void;
  clearPlayerState: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  setPlayState: (state: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
};

export const PlayerCtx = createContext({} as PlayerCtxData);

type PlayerContextProviderProps = {
  children: ReactNode;
};

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    const locally: Episode = JSON.parse(localStorage.getItem('episode'));
    if (locally) {
      setEpisodeList([locally]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(false);
    }
  }, []);

  function play(episode: Episode) {
    localStorage.setItem('episode', JSON.stringify(episode));
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  function playList(list: Episode[], index: number) {
    localStorage.setItem('episode', JSON.stringify(list[index]));
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function setPlayState(state) {
    setIsPlaying(state);
  }
  function togglePlay() {
    setIsPlaying(!isPlaying);
  }
  function toggleLoop() {
    setIsLooping(!isLooping);
  }
  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || currentEpisodeIndex + 1 > episodeList.length;
  function playNext() {
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(randomIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function clearPlayerState() {
    localStorage.removeItem('episode');
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerCtx.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        playList,
        play,
        togglePlay,
        setPlayState,
        isPlaying,
        hasNext,
        playNext,
        hasPrevious,
        playPrevious,
        toggleLoop,
        isLooping,
        toggleShuffle,
        isShuffling,
        clearPlayerState,
      }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerCtx);
};
