import React from "react";

const Header = () => {
  return (
    <header className="bg-white text-white py-4 py-10" >
      <div className="container mx-auto flex justify-start">
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
