import { PageWrapper } from "../components/PageWrapper";

export default function About() {
  return (
  <PageWrapper
    htmlContent={<AboutContent />} 
  />
  )
  
}

function AboutContent() {
  return (
    <>
      <h1 className="text-3xl font-bold text-center">Making strong connections</h1>
      <p className="text-xl mt-4 max-w-2xl text-center">
        We aim to connect users and create seamless contract interactions. <br />
        Learn more about our journey!
      </p>
    </>
      
  );
}
