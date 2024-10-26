import React, { useEffect, useState } from 'react';
import { MenuDatas } from '../components/Datas';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import your CSS file for additional styles

function Sidebar() {
  const [sidebarStyle, setSidebarStyle] = useState({
    minHeight: '100vh',
    width: '250px', // Default width
    border: '2px solid rgba(0, 0, 0, 0.1)', // More visible border
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  });

  // Determine the active link
  const isActiveLink = (path) => {
    return window.location.pathname.split('/')[1] === path.split('/')[1];
  };

  // Function to update sidebar style based on window size
  const updateSidebarStyle = () => {
    const width = window.innerWidth;

    // Adjust sidebar width based on window size
    if (width < 768) {
      setSidebarStyle({
        minHeight: '100vh',
        width: '200px', // Smaller width for mobile
        border: '2px solid rgba(0, 0, 0, 0.1)', // Maintain border visibility
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', // Maintain shadow
      });
    } else {
      setSidebarStyle({
        minHeight: '100vh',
        width: '250px', // Default width for larger screens
        border: '2px solid rgba(0, 0, 0, 0.1)', // Maintain border visibility
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', // Maintain shadow
      });
    }
  };

  useEffect(() => {
    updateSidebarStyle(); // Initial call to set the style
    window.addEventListener('resize', updateSidebarStyle); // Add resize event listener

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('resize', updateSidebarStyle);
    };
  }, []);

  return (
    <nav
      className="bg-white xl:shadow-lg py-6 px-4 xl:h-screen overflow-y-auto"
      style={sidebarStyle}
    >
      <Link to="/">
        <h1 className="text-3xl font-bold text-green-600 text-3d-logo">
          SahaCare
        </h1>
      </Link>
      <div className="flex flex-col gap-4 mt-12"> {/* Adjusted gap for spacing */}
        {MenuDatas.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`flex gap-4 items-center w-full p-4 rounded-lg transition-colors duration-300 
              ${isActiveLink(item.path) ? 'bg-green-100 text-green-800' : 'hover:bg-green-200 text-gray-800'}`} // Clear colors for active and hover states
          >
            <item.icon className="text-xl text-green-600" /> {/* Icon color to match text */}
            <p className={`text-sm font-semibold 
              ${isActiveLink(item.path) ? 'text-green-800' : 'text-gray-700'} 
              group-hover:text-green-800 transition-colors duration-300`}>
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;
