/* eslint-disable react/prop-types */
import { signOut } from "@junobuild/core";

export const Logout = () => {
  return (
    <div className="mt-24">
      <button
        type="button"
        onClick={signOut}
        className="dark:text-white flex items-center gap-2 hover:text-blue-500 active:text-blue-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          viewBox="0 -960 960 960"
          width="16"
          fill="currentColor"
        >
          <title>Logout</title>
          <path d="M120-120v-720h360v80H200v560h280v80H120Zm520-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
        </svg>
        <span>
          <small>Logout</small>
        </span>
      </button>
    </div>
  );
};
