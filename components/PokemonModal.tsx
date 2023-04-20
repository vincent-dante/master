import Image from 'next/image';
import { useState, useContext, useEffect } from 'react';
import { TrainerContext } from '../context/trainer';
import { PokemonContext } from '../context/pokemon';
import { ModalContext } from '../context/modal';
import {
  fetchPokemonsFirstGeneration,
  fetchPokemonsDetails,
} from '../services/pokemons';
import { REQUIRED_MESSAGE } from '../utility/required_message';

export default function PokemonModal() {
  const { trainer, setTrainer } = useContext(TrainerContext);
  const { pokemons, setPokemons } = useContext(PokemonContext);
  const { modal, setModal } = useContext(ModalContext);
  const [trainerName, setTrainerName] = useState('');
  const [trainerImage, setTrainerImage] = useState('');
  const [validationMessage, setValidationMessage] = useState({
    trainerImage: '',
    trainerName: '',
  });
  const characterImg = [
    '/img/character1.png',
    '/img/character2.png',
    '/img/character3.png',
  ];

  const onSubmit = async () => {
    if (trainerImage === '' || trainerName === '') {
      setValidationMessage({
        trainerImage: trainerImage === '' ? REQUIRED_MESSAGE.TRAINER_IMAGE : '',
        trainerName: trainerName === '' ? REQUIRED_MESSAGE.TRAINER_NAME : '',
      });
      return;
    }

    if (pokemons.firstGeneration.length === 0) {
      const { pokemon_species } = await fetchPokemonsFirstGeneration();
      const pokemonsWithDetails = await fetchPokemonsDetails(pokemon_species);

      setPokemons((prevState) => ({
        ...prevState,
        firstGeneration: pokemonsWithDetails,
      }));
    }

    setTrainer((prevState) => ({
      ...prevState,
      trainerName: trainerName,
      trainerImage: trainerImage,
      isVerfied: true,
    }));

    localStorage.setItem(
      'trainer',
      JSON.stringify({
        trainerName: trainerName,
        trainerImage: trainerImage,
        selectedPokemons: [],
        isVerfied: true,
      })
    );

    setModal(false);
  };

  useEffect(() => {
    setTrainerName(trainer.trainerName.length ? trainer.trainerName : '');
    setTrainerImage(trainer.trainerImage.length ? trainer.trainerImage : '');
  }, [trainer]);

  return (
    <>
      {modal && (
        <div className="fixed inset-0 z-40 w-full overflow-hidden  bg-stone-500 text-sm dark:bg-neutral-800">
          <div className="z-50 mx-auto my-16 max-w-md overflow-hidden rounded-md border border-slate-600 bg-white text-slate-500 dark:bg-dark-400 dark:text-slate-500">
            <div className="p-5">
              <h1 className="text-2xl font-bold">Create Pokemon Trainer</h1>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 justify-items-center pb-5">
                {characterImg
                  ? characterImg.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setTrainerImage(img)}
                        className={`cursor-pointer rounded-md border border-transparent p-2 hover:border-slate-400 dark:hover:border-slate-700 ${
                          trainerImage === img &&
                          'border-dashed border-slate-400 dark:border-slate-600'
                        }`}
                      >
                        <div className="relative h-32 w-24">
                          <Image
                            src={img}
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ))
                  : ''}
              </div>
              <p className="pb-5 text-rose-400">
                {validationMessage.trainerImage}
              </p>
              <input
                type="text"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                placeholder="Enter trainer name"
                className="w-full rounded-md border py-2 px-3 text-slate-500 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-transparent dark:text-slate-300"
              />
              <p className="py-5 text-rose-400">
                {validationMessage.trainerName}
              </p>
            </div>

            <div className="p-5 text-right">
              <input
                type="submit"
                value="Submit"
                onClick={() => onSubmit()}
                className="ml-5 cursor-pointer rounded-md bg-slate-600 py-2 px-3 text-white dark:text-slate-300 dark:hover:bg-slate-500"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
