import React, {
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import Image from 'next/dist/client/image';
import { TrainerContext } from '../../context/trainer';
import { PokemonContext } from '../../context/pokemon';
import PokemonCard from '../PokemonCard';
import Pagination from '../Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { REQUIRED_MESSAGE } from '../../utility/required_message';
import { useRouter } from 'next/router';
import {
  fetchPokemonsFirstGeneration,
  fetchPokemonsDetails,
} from '../../services/pokemons';

const HomePage = () => {
  const router = useRouter();
  const { trainer, setTrainer } = useContext(TrainerContext);
  const { pokemons, setPokemons } = useContext(PokemonContext);
  const [pagination, setPagination] = useState({
    pageTotalCount: 0,
    pageCount: 0,
    pageRange: 20,
    pageCurrent: 1,
  });
  const [validationMessage, setValidationMessage] = useState({
    trainerSelectedPokemons: '',
  });
  const [search, setSearch] = useState('');

  const removeSelectedPokemon = (pokemon) => {
    const reducePokemon = trainer.selectedPokemons.filter(
      (item) => item.id !== pokemon.id
    );
    setTrainer((prevState) => ({
      ...prevState,
      selectedPokemons: reducePokemon,
    }));
  };

  const verifyPokemonAlreadySelected = useCallback(
    (pokemon) => {
      const result = trainer.selectedPokemons.filter(
        (item) => item.id === pokemon.id
      );
      return result.length ? true : false;
    },
    [trainer.selectedPokemons]
  );

  const editSelectedPokemonName = (name, id) => {
    setTrainer((prevState) => ({
      ...prevState,
      selectedPokemons: prevState.selectedPokemons.map((pokemon) => {
        if (pokemon.id === id) {
          return { ...pokemon, name: name };
        } else return pokemon;
      }),
    }));
  };

  const addSelectedPokemon = (pokemon) => {
    const isPokemonAlreadyExist = verifyPokemonAlreadySelected(pokemon);
    if (isPokemonAlreadyExist) {
      removeSelectedPokemon(pokemon);
      return;
    }
    if (trainer.selectedPokemons.length >= 6) return;
    setTrainer((prevState) => ({
      ...prevState,
      selectedPokemons: [...prevState.selectedPokemons, pokemon],
    }));
  };

  const selectedPokemons = useMemo(() => {
    return trainer.selectedPokemons;
  }, [trainer.selectedPokemons]);

  const goToTrainerProfile = () => {
    if (trainer.selectedPokemons.length !== 6) {
      setValidationMessage({
        trainerSelectedPokemons: REQUIRED_MESSAGE.TRAINER_POKEMONS,
      });
      return;
    }
    setValidationMessage({
      trainerSelectedPokemons: '',
    });

    localStorage.setItem('trainer', JSON.stringify(trainer));
    router.push('/profile');
  };

  const paginationChange = useCallback(
    (pageNumber) => {
      setPagination((prevState) => ({ ...prevState, pageCurrent: pageNumber }));
    },
    [setPagination]
  );

  const filteredPokemons = useMemo(() => {
    let pokemonsList = pokemons.firstGeneration;

    if (search !== '') {
      pokemonsList = pokemonsList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLocaleLowerCase())
      );
    }

    const start = (pagination.pageCurrent - 1) * pagination.pageRange;
    const end = start + pagination.pageRange;
    pagination.pageCount = Math.ceil(
      pokemonsList.length / pagination.pageRange
    );
    pagination.pageTotalCount = pokemonsList.length;

    return pokemonsList.slice(start, end);
  }, [pagination, pokemons.firstGeneration, search]);

  const fetchPokemons = useCallback(async () => {
    if (pokemons.firstGeneration.length === 0) {
      const { pokemon_species } = await fetchPokemonsFirstGeneration();
      const pokemonsWithDetails = await fetchPokemonsDetails(pokemon_species);
      setPokemons((prevState) => ({
        ...prevState,
        firstGeneration: pokemonsWithDetails,
      }));
    }
  }, [pokemons.firstGeneration.length, setPokemons]);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  useEffect(() => {
    setPagination((prevState) => ({ ...prevState, pageCurrent: 1 }));
  }, [search]);

  if (!trainer.isVerfied) return;

  return (
    <>
      {/* Pokemon Trainer */}
      <div className="flex flex-wrap justify-center">
        <div className="relative h-32 w-24">
          <Image
            src={trainer.trainerImage}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <h2 className="w-full pb-5 font-bold text-slate-500">
          {trainer.trainerName}
        </h2>
        <button
          onClick={() => goToTrainerProfile()}
          className="flex items-center gap-3 rounded-md border border-slate-500 py-2 px-3 text-sm text-slate-500 focus:outline-none dark:border-slate-600 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-600 dark:focus:border-slate-500 "
        >
          Trainer Profile
          <FontAwesomeIcon icon={faUser} className="text-sm text-slate-500 " />
        </button>
        <p className="w-full py-5 text-sm text-rose-400">
          {validationMessage.trainerSelectedPokemons}
        </p>
      </div>

      {/* Selected Pokemons */}
      <div className="py-20">
        <h2 className="w-full pb-5 text-left text-xl font-bold text-slate-500 dark:text-slate-400">
          Pokemons selected: {selectedPokemons.length}
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {selectedPokemons.length !== 0 &&
            selectedPokemons.map((pokemon, index) => (
              <PokemonCard
                pokemon={pokemon}
                key={index}
                changePokemonName={(pokemonName, id) =>
                  editSelectedPokemonName(pokemonName, id)
                }
                clickRemovePokemon={(pokemon) => removeSelectedPokemon(pokemon)}
                showTools={true}
                customClass={`${
                  verifyPokemonAlreadySelected(pokemon)
                    ? 'border-dashed border-slate-400 dark:border-slate-600'
                    : ''
                }`}
              ></PokemonCard>
            ))}
        </div>
      </div>

      {/* Pokemon Grid */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-5 pb-10">
          <h2 className="w-full text-left text-xl font-bold text-slate-500 dark:text-slate-400 md:w-fit">
            Choose your pokemons here
          </h2>
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Pokemon"
            className="w-full rounded-md border border-slate-500 px-3 py-2 text-sm text-slate-500 focus:outline-none dark:border-slate-600 dark:bg-transparent dark:text-slate-300 dark:focus:border-slate-500 md:w-52"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {filteredPokemons.length !== 0 ? (
            filteredPokemons.map((pokemon, index) => (
              <PokemonCard
                pokemon={pokemon}
                key={index}
                clickPokemonCard={(pokemon) => addSelectedPokemon(pokemon)}
                clickRemovePokemon={(pokemon) => removeSelectedPokemon(pokemon)}
                customClass={`${
                  verifyPokemonAlreadySelected(pokemon)
                    ? 'border-dashed border-slate-400 dark:border-slate-600'
                    : ''
                }`}
              />
            ))
          ) : (
            <p className="col-span-1 text-center font-bold text-slate-500 md:col-span-6">
              No Pokemons found.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-10 py-20 md:justify-between md:gap-0">
        {/* Pagination Range */}
        <div className="flex w-full items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 md:w-auto">
          <span>1 to</span>
          <select
            value={pagination.pageRange}
            onChange={(e) => {
              setPagination((prevState) => ({
                ...prevState,
                pageCurrent: 1,
                pageRange: parseInt(e.target.value),
              }));
            }}
            className="rounded-md border border-slate-500 bg-white py-2 px-3 focus:outline-none dark:border-slate-600 dark:bg-dark-400 dark:text-slate-300 dark:focus:border-slate-500"
          >
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
          </select>
          <span>of {pagination.pageTotalCount} pokemons</span>
        </div>

        {/* Pagination */}
        <Pagination
          pageCount={pagination.pageCount}
          pageCurrent={pagination.pageCurrent}
          clickHandler={(pageNumber) => paginationChange(pageNumber)}
        />
      </div>
    </>
  );
};

export default HomePage;
