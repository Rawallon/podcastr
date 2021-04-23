import Head from 'next/head';
import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../styles/home.module.scss';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import { usePlayer } from '../context/PlayerContext';
import axios from 'axios';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  file: string;
  url: string;
  duration: number;
  durationAsString: string;
};

type HomeProps = {
  allEpisodes: Episode[];
  latestEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];
  return (
    <div className={styles.homepage}>
      <Head>
        <title>Podcastr | Pagina inicial </title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`} passHref>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button onClick={() => playList(episodeList, index)}>
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`} passHref>
                    <a href={`/episodes/${episode.id}`}>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      playList(episodeList, index + latestEpisodes.length)
                    }>
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await axios.get(
    'https://raw.githubusercontent.com/Rawallon/podcastr/main/server.json',
    {
      params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc',
      },
      headers: { 'Content-Type': 'application/json' },
    },
  );

  const episodes = Object.values(data.episodes).map((episode: any) => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM y', {
        locale: ptBR,
      }),
      thumbnail: episode.thumbnail,
      file: episode.file,
      url: episode.file.url,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration),
      ),
    };
  });
  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
  };
};
