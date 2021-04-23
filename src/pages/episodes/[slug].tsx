import Head from 'next/head';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from '../../styles/episode.module.scss';
import axios from 'axios';
import { usePlayer } from '../../context/PlayerContext';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();
  return (
    <div className={styles.episode}>
      <Head>
        <title> Podcastr | {episode.title} </title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button>
          <img
            src="/play.svg"
            alt="Tocar episódio"
            onClick={() => play(episode)}
          />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: episode.description,
        }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await axios.get(
    'https://raw.githubusercontent.com/Rawallon/podcastr/main/server.json',
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
  const chosenEpisode: any = Object.values(data.episodes).filter(
    (ep: any) => ep.id === slug,
  )[0];

  const episode = {
    id: chosenEpisode.id,
    title: chosenEpisode.title,
    thumbnail: chosenEpisode.thumbnail,
    members: chosenEpisode.members,
    publishedAt: format(parseISO(chosenEpisode.published_at), 'd MMM yy', {
      locale: ptBR,
    }),
    duration: Number(chosenEpisode.file.duration),
    durationAsString: convertDurationToTimeString(
      Number(chosenEpisode.file.duration),
    ),
    description: chosenEpisode.description,
    url: chosenEpisode.file.url,
  };

  return {
    props: {
      episode,
    },
  };
};
