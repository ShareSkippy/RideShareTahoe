// Region: Type Definitions
/**
 * @typedef {Object} PaginationControlsProps
 * @property {number} currentPage - The currently active page number.
 * @property {number} totalPages - The total number of pages available.
 * @property {boolean} hasMore - True if there is a next page of data.
 * @property {(newPage: number) => void} onPageChange - Callback function to handle page navigation.
 */
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (newPage: number) => void;
}
// EndRegion: Type Definitions

/**
 * @component PaginationControls
 * @description Renders the previous/next buttons and current page indicator.
 * @param {PaginationControlsProps} props - The properties for the component.
 * @returns {JSX.Element | null} The rendered pagination controls, or null if only one page exists.
 */
export function PaginationControls({
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
}: Readonly<PaginationControlsProps>) {
  if (totalPages <= 1) {
    return null;
  }

  /**
   * @function handlePreviousPage
   * @description Navigates to the previous page if possible.
   * @returns {void}
   */
  const handlePreviousPage = (): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  /**
   * @function handleNextPage
   * @description Navigates to the next page if more data is available.
   * @returns {void}
   */
  const handleNextPage = (): void => {
    if (hasMore) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4 pt-6">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ← Previous
      </button>
      <span className="text-sm text-gray-600 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={!hasMore}
        className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
}
