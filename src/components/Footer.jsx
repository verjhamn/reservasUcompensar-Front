import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-bold">Bogotá</h3>
            <p>Avenida (Calle) 32 No. 17 – 30</p>
            <p>Teléfono: 601 338 06 66</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Villavicencio</h3>
            <p>Carrera 35 No. 20A-02</p>
            <p>Teléfono: 608 681 86 40</p>
          </div>
          <div>
            <p>Fundación Universitaria Compensar</p>
            <p>VIGILADA MINEDUCACIÓN</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
