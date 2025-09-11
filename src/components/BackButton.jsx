import { useNavigate } from 'react-router-dom';

/**
 * A reusable button component that navigates the user to the previous page in their browser history.
 * It uses the useNavigate hook from react-router-dom.
 */
const BackButton = () => {
  // Get the navigate function from the hook
  const navigate = useNavigate();

  // Define the click handler
  const handleGoBack = () => {
    // To go back, call navigate with -1
    navigate(-1);
  };

  return (
    <button
      onClick={handleGoBack}
      className="group text-center md:pl-4 md:pr-5  h-auto
      focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75
      inline-flex justify-center !py-2 px-6 text-sm font-medium rounded-md btn-secondary"
    >
        <p className="group-hover:btn-animation-l pl-1 dark:!text-purple-500"> ⬅ Back</p>
    </button>
  );
};

export default BackButton;