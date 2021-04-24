import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import Header from '../components/Header';
import Player from '../components/Player';
import { PlayerContextProvider } from '../context/PlayerContext';
import { ThemeContextProvider } from '../context/ThemeContext';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeContextProvider>
      <PlayerContextProvider>
        <div className={styles.appWrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </PlayerContextProvider>
    </ThemeContextProvider>
  );
}

export default MyApp;
