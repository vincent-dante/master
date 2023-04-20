import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import PokemonModal from '../components/PokemonModal';
import { TrainerContext } from '../context/trainer';
import { PokemonContext } from '../context/pokemon';
import { ModalContext } from '../context/modal';

import 'styles/globals.css';
// import Font Awesome CSS
import '@fortawesome/fontawesome-svg-core/styles.css';

import { config } from '@fortawesome/fontawesome-svg-core';
// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;

import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  const [trainer, setTrainer] = useState({
    trainerName: '',
    trainerImage: '',
    selectedPokemons: [],
    isVerfied: false,
  });
  const [pokemons, setPokemons] = useState({
    firstGeneration: [],
  });
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const trainerLocalStorage = JSON.parse(localStorage.getItem('trainer'));
    if (trainerLocalStorage !== null) {
      if (trainerLocalStorage.isVerfied) {
        setTrainer(trainerLocalStorage);
        setModal(false);
        return;
      }
    }
    setModal(true);
  }, []);

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      <TrainerContext.Provider value={{ trainer, setTrainer }}>
        <PokemonContext.Provider value={{ pokemons, setPokemons }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <PokemonModal />
        </PokemonContext.Provider>
      </TrainerContext.Provider>
    </ModalContext.Provider>
  );
}
