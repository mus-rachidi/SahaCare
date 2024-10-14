import React from 'react';
import { MenuDatas } from '../components/Datas';
import { Link } from 'react-router-dom';

function Sidebar() {
  // Determine the active link
  const isActiveLink = (path) => {
    return window.location.pathname.split('/')[1] === path.split('/')[1];
  };

  return (
    <nav className="bg-white xl:shadow-lg py-6 px-4 xl:h-screen w-full border-r border-border">
      <Link to="/">
        <img
          src="/images/logo9.png"
          alt="logo"
          className="w-2/4 h-12 ml-4 object-contain"
        />
      </Link>
      <div className="flex flex-col gap-2 mt-12">
        {MenuDatas.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`flex gap-4 items-center w-full p-4 rounded-lg transition-colors duration-300 
              ${isActiveLink(item.path) ? 'bg-text' : 'hover:bg-text'}`}
          >
            <item.icon className="text-xl text-subMain" />
            <p className={`text-sm font-medium 
              ${isActiveLink(item.path) ? 'text-subMain' : 'text-gray-500'} 
              group-hover:text-subMain transition-colors duration-300`}>
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;
