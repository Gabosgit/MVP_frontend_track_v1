import Navbar from "./Navbar"; // Import the Navbar
import Content from "./Content"; // Import the Navbar
import Footer from "./Footer"; // Import the Footer


export default function Layout({ pageName, loading, error, htmlContent }) {
    return (
      <div className="flex flex-col min-h-screen w-screen justify-between">
        <Navbar pageName={pageName} />
        <Content loading={loading} error={error} htmlContent={htmlContent} />
        <Footer />
      </div>
    );
  }
  