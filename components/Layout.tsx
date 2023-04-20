import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('');

  const toggleTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setTheme('dark');
      return;
    }
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
    setTheme('light');
  };

  const changeTheme = () => {
    if (localStorage.theme === 'dark') toggleTheme('light');
    else toggleTheme('dark');
  };

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      toggleTheme('dark');
    } else {
      toggleTheme('light');
    }
  }, []);

  return (
    <main>
      <div className="flex justify-end pt-10">
        <button
          onClick={() => changeTheme()}
          className="rounded-md px-5 py-3 text-right transition ease-in-out hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          <FontAwesomeIcon
            icon={theme === 'dark' ? faMoon : faSun}
            className="text-lg text-slate-500"
          />
        </button>
      </div>

      <h1 className="py-10 text-3xl font-bold text-slate-600 dark:text-slate-400">
        Pokemon Trainer
      </h1>

      {children}
    </main>
  );
}
