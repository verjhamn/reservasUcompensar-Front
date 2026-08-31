import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const socialLinks = [
  { href: 'https://www.facebook.com/UCompensar/', label: 'Facebook', Icon: Facebook },
  { href: 'https://twitter.com/ucompensar', label: 'Twitter', Icon: Twitter },
  { href: 'https://www.instagram.com/ucompensar/', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.youtube.com/@ucompensar', label: 'YouTube', Icon: Youtube },
];

const Footer = () => {
  return (
    <footer className="mt-auto shrink-0 bg-gray-800 text-white py-6">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Logo e información */}
        <div className="min-w-0 flex flex-col items-center md:items-start">
          <img
            src="https://ucompensar.edu.co/wp-content/uploads/2021/09/Logo-Fundacion-Universitaria-compensar.svg"
            alt="Compensar Fundación Universitaria"
            className="h-10 w-auto max-w-full mb-4"
          />
          <p className="text-center md:text-left mb-4">
            Si deseas tener más información sobre las reservas, comunícate con nosotros.
          </p>
          {/*           <a href="mailto:reservas.campus@ucompensar.edu.co" className="text-orange-500 underline">
            reservas.campus@ucompensar.edu.co
          </a> */}
        </div>

        {/* Dirección Bogotá */}
        <div className="min-w-0 flex flex-col items-center text-center md:items-start md:text-left">
          <h3 className="text-xl font-semibold mb-4 text-orange-500">Bogotá</h3>
          <p>Bogotá Sede Principal</p>
          <p>Avenida (Calle) 32 No. 17 - 30</p>
          <p className="mb-4">Teléfono: 338 06 66</p>
        </div>

        <div className="min-w-0 flex flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-6 w-full">
            <h3 className="text-xl font-semibold mb-4 text-orange-500">Campus Av 68</h3>
            <p>Av Carrera 68 No. 68 B – 45</p>
          </div>
          <div className="mb-6 w-full">
            <h3 className="text-xl font-semibold mb-4 text-orange-500">Villavicencio</h3>
            <p>Cra. 33 No. 39-55</p>
          </div>
        </div>

        {/* Certificación */}
        <div className="min-w-0 flex flex-col items-center md:items-start">
          <a
            href="https://ucompensar.edu.co/wp-content/uploads/2024/12/FUNDACION-UNIVERSITARIA-COMPENSAR-UCOMPENSAR-9001-2024-11-06.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity max-w-full"
          >
            <img
              src="https://ucompensar.edu.co/wp-content/uploads/2025/10/440986-2.webp"
              alt="Icontec ISO 9001"
              className="h-28 w-auto max-w-full object-contain mb-2"
            />
          </a>
          <p>N° Certificado</p>
          <p>SC-CER440986</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-20 mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-lg font-semibold shrink-0">Síguenos</h3>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 text-white">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="inline-flex items-center justify-center p-1 hover:text-orange-500 transition-colors"
            >
              <Icon className="w-6 h-6 shrink-0" />
            </a>
          ))}
        </div>
      </div>

      <div className="text-center mt-6 border-t border-gray-700 pt-4 px-6">
        <p className="text-sm text-gray-400">
          Fundación Universitaria Compensar P.J. Resolución 23635 del 23 diciembre 1981 | 12455 del 9 de julio 2020. – VIGILADA MINEDUCACIÓN
        </p>
      </div>
    </footer>
  );
};

export default Footer;
