import Image from 'next/dist/client/image';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquareXmark,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

const PokemonCard = ({
  pokemon,
  clickPokemonCard = (e) => {},
  changePokemonName = (e, id) => {},
  clickRemovePokemon = (e) => {},
  customClass = '',
  showTools = false,
}) => {
  const [isDisabledInput, setIsDisabledInput] = useState(true);
  const [defaultPokemonName, setDefaultPokemonName] = useState(pokemon.name);
  const [pokemonName, setPokemonName] = useState(pokemon.name);

  const checkPokemonName = () => {
    if (isDisabledInput === true) {
      setIsDisabledInput(false);
      return;
    }
    if (pokemonName === '') {
      setPokemonName(defaultPokemonName);
    } else if (pokemonName !== defaultPokemonName) {
      changePokemonName(pokemonName, pokemon.id);
    }
    setIsDisabledInput(true);
  };

  const PokemonTypes = ({ types }) => {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {types
          ? types.map((item, index) => {
              return (
                <span
                  key={index}
                  className="rounded-md bg-slate-500 px-2 py-1 text-xs text-white dark:bg-slate-700"
                >
                  {item.type.name}
                </span>
              );
            })
          : ''}
      </div>
    );
  };

  useEffect(() => {
    setPokemonName(pokemon.name);
  }, [pokemon.name]);

  return (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-md border border-transparent p-2 text-slate-500 hover:border-slate-400 dark:text-slate-300 dark:hover:border-slate-600 ${customClass}`}
      onClick={() => clickPokemonCard(pokemon)}
    >
      <div className="flex items-center gap-2">
        <div className="relative h-20 w-20">
          <Image
            src={pokemon.sprites.front_default}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          {!isDisabledInput ? (
            <input
              type="text"
              value={pokemonName}
              onChange={(e) => setPokemonName(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  checkPokemonName();
                }
              }}
              className={`w-full rounded-md border-slate-400  focus:outline-none dark:border-slate-600 dark:bg-transparent  dark:focus:border-slate-500
              ${!isDisabledInput ? 'border py-2 px-3' : 'dark:border-none'}
              `}
            />
          ) : (
            <div className="overflow-hidden text-ellipsis text-left">
              {pokemonName}
            </div>
          )}
          <PokemonTypes types={pokemon.types} />
        </div>
      </div>
      <div
        className={`grid grid-cols-1 gap-2 px-2 ${!showTools ? 'hidden' : ''}`}
      >
        <button onClick={() => checkPokemonName()}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="text-xl text-slate-500 hover:text-slate-600"
          />
        </button>
        <button onClick={() => clickRemovePokemon(pokemon)}>
          <FontAwesomeIcon
            icon={faSquareXmark}
            className="text-xl text-slate-500 hover:text-slate-600"
          />
        </button>
      </div>
    </div>
  );
};

export default PokemonCard;
