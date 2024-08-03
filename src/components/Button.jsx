import PropTypes from "prop-types";

export const Button = ({ children, onClick, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
        disabled
          ? "opacity-25"
          : "hover:bg-blue-600 dark:hover:bg-blue-300 dark:hover:text-black active:bg-blue-400 dark:active:bg-blue-500 active:shadow-none active:translate-x-[5px] active:translate-y-[5px]"
      }`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
