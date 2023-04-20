import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

export default function Pagination({ pageCount, pageCurrent, clickHandler }) {
  const prevPage = () => {
    if (pageCurrent <= 1) return;
    clickHandler(pageCurrent - 1);
  };

  const nextPage = () => {
    if (pageCurrent >= pageCount) return;
    clickHandler(pageCurrent + 1);
  };

  const pages = useMemo(() => {
    if (pageCurrent < 4 && pageCount > 4) {
      return Array.from({ length: 4 }, (v, k) => k + 1);
    }
    if (pageCurrent === pageCount && pageCount > 4)
      return [pageCurrent - 3, pageCurrent - 2, pageCurrent - 1, pageCurrent];
    if (pageCurrent === pageCount - 1 && pageCount > 4)
      return [pageCurrent - 2, pageCurrent - 1, pageCurrent, pageCurrent + 1];
    if (pageCurrent >= 4 && pageCount > 4)
      return [pageCurrent - 1, pageCurrent, pageCurrent + 1];
    return Array.from({ length: pageCount }, (v, k) => k + 1);
  }, [pageCount, pageCurrent]);

  return (
    <>
      <div className="flex w-full items-center justify-center gap-2 text-sm text-gray-500 md:w-auto">
        <button
          className={`p-2 px-4 ${
            pageCurrent == 1 || pageCount == 0
              ? 'cursor-default text-gray-400'
              : ''
          }`}
          onClick={() => prevPage()}
        >
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="text-xl text-slate-500 hover:text-slate-600"
          />
        </button>
        {pageCurrent >= 4 && pageCount > 4 ? (
          <button v-if="" className="p-2 px-4" onClick={() => clickHandler(1)}>
            1
          </button>
        ) : (
          ''
        )}
        {pageCurrent >= 4 && pageCount > 4 ? <span>...</span> : ''}
        {pages.length !== 0 &&
          pages.map((pageNumber, index) => (
            <button
              className={`p-2 px-4 ${
                pageCurrent === pageNumber
                  ? 'rounded-md bg-slate-500 text-white dark:bg-slate-600 dark:text-slate-200'
                  : ''
              }`}
              onClick={() => clickHandler(pageNumber)}
              key={index}
            >
              {pageNumber}
            </button>
          ))}
        {pageCurrent <= pageCount - 3 && pageCount > 4 ? <span>...</span> : ''}
        {pageCurrent <= pageCount - 2 && pageCount > 4 ? (
          <button onClick={() => clickHandler(pageCount)} className="p-2 px-4">
            {pageCount}
          </button>
        ) : (
          ''
        )}
        <button
          className={`p-2 px-4 ${
            pageCurrent == pageCount || pageCount == 0
              ? 'cursor-default text-gray-400'
              : ''
          }`}
          onClick={() => nextPage()}
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            className="text-xl text-slate-500 hover:text-slate-600"
          />
        </button>
      </div>
    </>
  );
}
