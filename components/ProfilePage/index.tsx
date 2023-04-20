import React, { useContext } from 'react';
import Image from 'next/dist/client/image';
import { TrainerContext } from '../../context/trainer';
import { ModalContext } from '../../context/modal';
import PokemonCard from '../PokemonCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const router = useRouter();
  const { trainer, setTrainer } = useContext(TrainerContext);
  const { setModal } = useContext(ModalContext);

  const deleteTrainerProfile = () => {
    setTrainer({
      trainerName: '',
      trainerImage: '',
      selectedPokemons: [],
      isVerfied: false,
    });
    localStorage.removeItem('trainer');
    setModal(true);
    router.push('/');
  };

  return (
    <>
      {/* Pokemon Trainer Profile */}
      <div className="flex justify-between text-sm">
        <button
          onClick={() => router.back()}
          className="flex w-fit cursor-pointer items-center gap-2 p-2 text-left text-slate-500 dark:text-slate-400"
        >
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="text-xl text-slate-500 dark:text-slate-400"
          />
          Back
        </button>
        <button
          onClick={() => deleteTrainerProfile()}
          className="flex w-fit cursor-pointer items-center gap-2 p-2 text-left text-slate-500 dark:text-slate-400"
        >
          <FontAwesomeIcon
            icon={faTrash}
            className="text-xl text-slate-500 dark:text-slate-400"
          />
          Delete Profile
        </button>
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="relative h-32 w-24">
          {trainer.trainerImage.length !== 0 && (
            <Image
              src={trainer.trainerImage}
              alt=""
              fill
              className="object-contain"
            />
          )}
        </div>
        <h2 className="w-full pb-5 font-bold text-slate-500">
          {trainer.trainerName}
        </h2>
      </div>

      {/* Selected Pokemons */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {trainer.selectedPokemons.length !== 0 &&
          trainer.selectedPokemons.map((pokemon, index) => (
            <PokemonCard
              pokemon={pokemon}
              key={index}
              customClass={
                'border-dashed border-slate-400 dark:border-slate-600'
              }
            ></PokemonCard>
          ))}
      </div>
    </>
  );
}
