import React from "react";

const Header = () => {
  return (
    <header className="bg-white text-white py-4" >
      <div className="container flex justify-center md:justify-start mr-4 md:mx-4 ">
        <img 
          src="https://ucompensar.edu.co/wp-content/uploads/2021/04/main-logo.svg"
          alt="Logo"
          className="h-12"
        />
      </div>
    </header>
  );
};

export default Header;
