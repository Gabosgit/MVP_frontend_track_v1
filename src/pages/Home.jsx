import Content from "../components/Content";
import '../index.css'



export default function Home() {

  // ✅ RETURN the JSX to ensure React renders it
    return (
      <Content 
        htmlContent={<HomeContent />} 
      />
    );
}


function HomeContent() {
  return (
    <div className="max-w-4xl p-4 text-center sm:p-8">
        <a href="#">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold mb-6 text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end animate-slideInUp text-transparent">
              Professional Creative Platform
            </h1>
        </a>
        <p className="text-lg sm:text-xl lg:text-[1.3rem]  mb-8 font-normal text-gray-700 dark:text-gray-400">
          Connect with top creatives, manage projects seamlessly, and grow your creative business with our comprehensive platform designed for professionals.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center animate-slideInUp [animation-delay:0.4s]" >
            <a href="#dashboard" className="btn btn-primary bg-gradient-to-r from-custom-purple-start to-custom-purple-end text-white">
              Get Started Free
            </a>

            <a href="#features" className="btn btn-secondary bg-custom-purple-start/10 text-custom-purple-start border-2 border-custom-purple-start/20 dark:bg-white/5 dark:text-indigo-300 dark:border-indigo-400/30">
              Learn More
            </a>
        </div>

        
    </div>


  );
}
