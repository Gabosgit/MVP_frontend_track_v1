import Content from "../components/Content";
import Carousel from "../components/Carousel";

export default function About() {
  return (
  <Content
    htmlContent={<AboutContent />} 
  />
  )
  
}

function AboutContent() {
  return (
    <>
        <Carousel />
        
        <section id="more" className="w-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-card">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12 sm:mb-16 animate-slideInUp">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-5 text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end">
                        How We Achieve It
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-700 dark:text-dark-text-secondary max-w-2xl mx-auto">
                        We focus on intuitive design and powerful tools to streamline your workflow.
                    </p>
                </div>
                {/* Card left */}
                <div className="grid md:grid-cols-2 gap-10 lg:gap-12 items-start">
                    <div className="group bg-custom-purple-start/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-xl 
                    transition-all ease-in-out duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="feature-icon-bg">
                            <span>🖥️</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end">
                            User-Friendly Interface 
                        </h3>
                        <p className="text-gray-600 dark:text-dark-text-secondary leading-relaxed">
                            Our intuitive, user-friendly interface is crafted to guide you step-by-step, enabling effortless creation of both professional profiles and comprehensive contracts. Say goodbye to complexity!
                        </p>
                    </div>
                    {/* Card right */}
                    <div className="group bg-custom-purple-start/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-xl
                    transition-all ease-in-out duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="feature-icon-bg">
                            <span>🗓️</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end">
                            Smart Event Itinerary
                        </h3>
                        <p className="text-gray-600 dark:text-dark-text-secondary leading-relaxed">
                            The innovative event itinerary feature empowers users to track all contract-related events, milestones, and deadlines with unparalleled ease and precision, ensuring you never miss a beat.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="text-center w-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-transparent  backdrop-blur-md">
            <div className="max-w-3xl mx-auto animate-slideInUp">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end">
                    Join the Revolution
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-dark-text-secondary mb-10 leading-relaxed">
                    CreativePro is more than just a tool; it's your partner in professional contract management. Simplify your processes, enhance clarity, and focus on what you do best – creating.
                </p>
                <a href="/sign_up"
                   className="inline-block py-3.5 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-custom-purple-start to-custom-purple-end hover:from-custom-purple-end hover:to-custom-purple-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-purple-start dark:focus:ring-offset-dark-card 
                   transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-custom-purple-start/40 hover:-translate-y-1 text-base sm:text-lg">
                    Get Started with CreativePro
                </a>
            </div>
        </section>
    </>
  );
}
