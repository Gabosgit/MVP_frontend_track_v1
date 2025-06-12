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
      className="text-center p-4 md:pl-4 md:pr-5 py-2 btn-primary rounded-lg h-auto
      focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
    >
        ⬅ Back
    </button>
  );
};

export default BackButton;