import Navbar from "./Navbar"; // Import the Navbar
import Content from "./Content"; // Import the Navbar
import Footer from "./Footer"; // Import the Footer
import React, { useRef, useEffect, useState } from 'react';


export default function Layout({ pageName, loading, error, htmlContent }) {

  const myElementRef = useRef(null); // 1. Create a ref
  
  useEffect(() => {
    // 3. Access the DOM element in useEffect (after render)
    if (myElementRef.Navbar) {
      // Calculate height using different properties
      const clientHeight = myElementRef.current.clientHeight;
      const offsetHeight = myElementRef.current.offsetHeight;
      const scrollHeight = myElementRef.current.scrollHeight;
      const boundingHeight = myElementRef.current.getBoundingClientRect().height;

      console.log('Client Height:', clientHeight);
      console.log('Offset Height:', offsetHeight);
      console.log('Scroll Height:', scrollHeight);
      console.log('Bounding Rect Height:', boundingHeight);
    }
  })

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Navbar />
      <Content pageName={pageName} loading={loading} error={error} htmlContent={htmlContent} />
      <Footer />
    </div>
  );
}
  