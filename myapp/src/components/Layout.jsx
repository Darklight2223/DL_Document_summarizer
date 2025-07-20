import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="dark:bg-gray-900 bg-white min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="pt-20 px-4 flex-grow text-gray-900 dark:text-gray-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
