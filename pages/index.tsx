import Head from 'next/head';
import HomePage from '../components/HomePage';

export default function Home() {
  return (
    <>
      <Head>
        <title>Pokemon Trainer</title>
        <meta name="description" content="Pokemon Trainer Home Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
    </>
  );
}
