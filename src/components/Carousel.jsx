import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

// Main App component containing the carousel
function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // State to hold the actual number of slides, defaults to 3
  const [numSlides, setNumSlides] = useState(3); 
  const carouselTrackRef = useRef(null);
  // Initialize slidesRef.current with a default size (e.g., 3 nulls)
  const slidesRef = useRef(Array(3).fill(null)); 
  const dotsRef = useRef([]);
  let autoSlideInterval = useRef(null);

  // Function to update the carousel's position and active dot
  const updateCarousel = () => {
    if (carouselTrackRef.current && slidesRef.current.length > 0) {
      // Move the carousel track to show the current slide
      carouselTrackRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update active state for pagination dots
      dotsRef.current.forEach((dot, index) => {
        if (dot) { // Ensure dot element exists
          if (index === currentIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        }
      });
    }
  };

  // Function to show the next slide
  const showNextSlide = () => {
    // Use numSlides for modulo calculation
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numSlides); 
  };

  // Function to show the previous slide
  const showPrevSlide = () => {
    // Use numSlides for modulo calculation
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numSlides) % numSlides); 
  };

  // Start auto-slide functionality
  const startAutoSlide = () => {
    autoSlideInterval.current = setInterval(showNextSlide, 5000); // Change slide every 5 seconds
  };

  // Reset auto-slide timer
  const resetAutoSlide = () => {
    clearInterval(autoSlideInterval.current); // Clear existing interval
    startAutoSlide(); // Start a new interval
  };

  // useEffect for initial setup and updates when currentIndex changes
  useEffect(() => {
    updateCarousel();
  }, [currentIndex, numSlides]); // Re-run when currentIndex or numSlides changes

  // useEffect for dynamically determining the number of slides
  useEffect(() => {
    // Filter out nulls to get only the actual slide elements
    const actualSlides = slidesRef.current.filter(slide => slide !== null);
    if (actualSlides.length > 0 && actualSlides.length !== numSlides) {
      // Update numSlides if it doesn't match the actual count
      setNumSlides(actualSlides.length);
    }
  }, []); // Run once after initial render to count slides

  // useEffect for auto-slide and cleanup
  useEffect(() => {
    startAutoSlide();

    // Cleanup interval on component unmount
    return () => clearInterval(autoSlideInterval.current);
  }, [numSlides]); // Re-run if numSlides changes (e.g., carousel content updates)


  // --- Function for smooth scrolling ---
  const handleLearnMoreClick = (e) => {
    e.preventDefault(); // Prevent the default jump behavior
    const targetElement = document.getElementById('more');
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth', // Smooth scroll animation
        block: 'start' // Aligns the top of the element with the top of the viewport
      });
    }
  };
  // --- END NEW ---

  return (
    <section className="mt-14 relative w-full min-h-screen overflow-hidden py-16 sm:py-20">
      <div className="carousel-container relative w-full">
        {/* Carousel Track: Holds all slides, moves horizontally */}
        <div ref={carouselTrackRef} className="carousel-track flex my-14 transition-transform duration-500 ease-in-out">
          
          {/* Slide 1 */}
          <div ref={(el) => (slidesRef.current[0] = el)} className="carousel-slide flex-shrink-0 w-full p-8 sm:p-12 flex items-center justify-center text-center">
            <div className="animate-slideInUp" style={{ animationDelay: '0.4s' }}>
              <div className='max-w-2xl'>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold mb-6 text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end">
                Professional Creative Platform
                </h1>
                <p className="text-lg sm:text-xl lg:text-[1.3rem] mb-8 font-normal text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
                  Connect with top creatives, manage projects seamlessly, and grow your creative business with our comprehensive platform designed for professionals.
                </p>
              </div>
              
            </div>
          </div>
          

          {/* Slide 2 */}
          <div ref={(el) => (slidesRef.current[1] = el)} className="carousel-slide flex-shrink-0 w-full p-8 sm:p-12 flex items-center justify-center text-center">
            <div className="max-w-3xl mx-auto animate-slideInUp">
              <div className='max-w-2xl'>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold mb-6 text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end">
                  About CreativePro
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-400 leading-relaxed">
                  Welcome to CreativePro! We are excited to introduce a project designed to revolutionize contract creation by making the entire process quicker, more transparent, and remarkably user-friendly.
                </p>
              </div>
            </div>
          </div>
          

          {/* Slide 3 */}
          <div ref={(el) => (slidesRef.current[2] = el)} className="carousel-slide flex-shrink-0 w-full p-8 sm:p-12 flex items-center justify-center text-center">
            <div className="animate-slideInUp" style={{ animationDelay: '0.2s' }}>
              <div className='max-w-2xl'>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold mb-6 text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end">
                Our Core Aim
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Our project aims to simplify and significantly speed up the generation of professional contracts, all while ensuring absolute clarity and ease of understanding for everyone involved.
              </p>
              </div>
            </div>
          </div>
          {/* Example of a potential 4th slide - uncomment to test dynamic dot count */}
          {/* <div ref={(el) => (slidesRef.current[3] = el)} className="carousel-slide flex-shrink-0 w-full p-8 sm:p-12 flex items-center justify-center text-center">
            <div className="animate-slideInUp" style={{ animationDelay: '0.6s' }}>
              <div className='max-w-2xl'>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold mb-6 text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end">
                  Another Slide
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  This is an example of a fourth slide. The dots should dynamically adjust!
                </p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Navigation Buttons */}
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-transparent bg-opacity-50 text-custom-purple-start dark:text-custom-purple-end p-3 rounded-full shadow-sm hover:bg-opacity-75 transition-colors duration-300 z-10 hidden sm:block"
          onClick={() => { showPrevSlide(); resetAutoSlide(); }}
        >
          &#10094; {/* Left arrow */}
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-transparent bg-opacity-50 text-custom-purple-start dark:text-custom-purple-end p-3 rounded-full shadow-sm hover:bg-opacity-75 transition-colors duration-300 z-10 hidden sm:block"
          onClick={() => { showNextSlide(); resetAutoSlide(); }}
        >
          &#10095; {/* Right arrow */}
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {/* Map based on numSlides state */}
        {Array(numSlides).fill(null).map((_, index) => (
          <span
            key={index}
            ref={(el) => (dotsRef.current[index] = el)}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => { setCurrentIndex(index); resetAutoSlide(); }}
          ></span>
        ))}
      </div>

      {/* Buttons below carousel */}
      <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10 animate-slideInUp [animation-delay:0.4s]">
        <Link to="/sign_up" className="btn btn-primary">
            Get Started Free
        </Link>
        
        {/* --- "Learn More" button --- */}
        <a
          id="learn"
          href="#more" // Keep href for accessibility/fallback, but prevent default
          onClick={handleLearnMoreClick} // Add the onClick handler
          className="btn btn-secondary bg-custom-purple-start/10 text-custom-purple-start border-2 border-custom-purple-start/20 dark:bg-white/5 dark:text-indigo-300 dark:border-indigo-400/30 py-3 px-8 rounded-xl font-semibold hover:bg-custom-purple-start/20 transition-colors duration-300"
        >
          Learn More
        </a>
      </div>
    </section>
  );
}

export default Carousel;