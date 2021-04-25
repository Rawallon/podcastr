import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import styles from './styles.module.scss';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const currentDate = format(new Date(), 'EEEEEE, d, MMM', {
    locale: ptBR,
  });
  return (
    <div className={styles.headerContainer}>
      <Link href="/">
        <a>
          {isDarkMode ? <img src="/logo-white.svg" /> : <img src="/logo.svg" />}
        </a>
      </Link>
      <p>O melhor para você ouvir,sempre</p>
      <span onClick={toggleDarkMode}>
        <div className={styles.button}>
          {isDarkMode ? (
            <img src="/sun.svg" loading="eager" />
          ) : (
            <img src="/moon.svg" loading="eager" />
          )}
        </div>
      </span>
    </div>
  );
}
