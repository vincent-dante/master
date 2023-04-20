import Head from 'next/head';
import { useEffect } from 'react';
import ProfilePage from '../components/ProfilePage';
import { useRouter } from 'next/router';

export default function Profile() {
  const router = useRouter();

  useEffect(() => {
    const trainerLocalStorage = JSON.parse(localStorage.getItem('trainer'));
    let isProfileAccessible = true;

    if (trainerLocalStorage !== null) {
      if (
        !trainerLocalStorage.isVerfied ||
        trainerLocalStorage.selectedPokemons.length < 6
      ) {
        isProfileAccessible = false;
      }
    } else {
      isProfileAccessible = false;
    }

    if (!isProfileAccessible) router.push('/');
  }, [router]);

  return (
    <>
      <Head>
        <title>Pokemon Trainer | Profile</title>
        <meta name="description" content="Pokemon Trainer Profile Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProfilePage />
    </>
  );
}
