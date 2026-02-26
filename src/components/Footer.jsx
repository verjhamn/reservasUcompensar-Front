import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Logo e información */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="https://ucompensar.edu.co/wp-content/uploads/2021/09/Logo-Fundacion-Universitaria-compensar.svg"
            alt="Compensar Fundación Universitaria"
            className="h-10 mb-4"
          />
          <p className="text-center md:text-left mb-4">
            Si deseas tener más información sobre las reservas, comunícate con nosotros.
          </p>
          {/*           <a href="mailto:reservas.campus@ucompensar.edu.co" className="text-orange-500 underline">
            reservas.campus@ucompensar.edu.co
          </a> */}
        </div>

        {/* Dirección Bogotá */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h3 className="text-xl font-semibold mb-4 text-orange-500">Bogotá</h3>
          <p>Bogotá Sede Principal</p>
          <p>Avenida (Calle) 32 No. 17 - 30</p>
          <p className="mb-4">Teléfono: 338 06 66</p>
        </div>

        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-6 w-full">
            <h3 className="text-xl font-semibold mb-4 text-orange-500">Campus Av 68</h3>
            <p>Av Carrera 68 No. 68 B – 45</p>
          </div>
          <div className="mb-6 w-full">
            <h3 className="text-xl font-semibold mb-4 text-orange-500">Villavicencio</h3>
            <p>Cra. 33 ·39-55</p>
          </div>
        </div>

        {/* Certificación y redes sociales */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex flex-col items-center md:items-start mb-4">
            <a
              href="https://ucompensar.edu.co/wp-content/uploads/2024/12/FUNDACION-UNIVERSITARIA-COMPENSAR-UCOMPENSAR-9001-2024-11-06.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://ucompensar.edu.co/wp-content/uploads/2025/10/440986-2.webp"
                alt="Icontec ISO 9001"
                className="h-40 mb-2"
              />
            </a>
            <p>N° Certificado</p>
            <p>SC-CER440986</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Síguenos</h3>
            <div className="flex space-x-6 text-white mt-4">
              <a href="https://www.facebook.com/UCompensar/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-orange-500 transition-colors hover:scale-110 transform duration-200">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/ucompensar" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-orange-500 transition-colors hover:scale-110 transform duration-200">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/ucompensar/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-orange-500 transition-colors hover:scale-110 transform duration-200">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.youtube.com/user/UCompensar" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-orange-500 transition-colors hover:scale-110 transform duration-200">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-10 border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-400">
          Fundación Universitaria Compensar P.J. Resolución 23635 del 23 diciembre 1981 | 12455 del 9 de julio 2020. – VIGILADA MINEDUCACIÓN
        </p>
      </div>

    </footer>
  );
};

export default Footer;
