import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Logo e información */}
        <div className="flex flex-col items-center md:items-start">
          <img 
            src="https://ucompensar.edu.co/wp-content/uploads/2021/09/Logo-Fundacion-Universitaria-compensar.svg" 
            alt="Compensar Fundación Universitaria" 
            className="h-10 mb-4" 
          />
          <p className="text-center md:text-left mb-4">
            Si deseas tener más información sobre los cursos, comunícate con nosotros.
          </p>
          <p>Teléfono: (601) 3380666</p>
          <p>WhatsApp: (+1) 3128831904</p>
          <a href="mailto:cuposeducon@ucompensar.edu.co" className="text-orange-500 underline">
            cuposeducon@ucompensar.edu.co
          </a>
        </div>

        {/* Dirección Bogotá */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h3 className="text-xl font-semibold mb-4 text-orange-500">Bogotá</h3>
          <p>Bogotá Sede Principal</p>
          <p>Avenida (Calle) 32 No. 17 - 30</p>
          <p className="mb-4">Teléfono: 338 06 66</p>
          <p>Sede Nuevo Campus</p>
          <p>Av Carrera 68 No. 68 B – 45</p>
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
            <img 
              src="https://ucompensar.edu.co/wp-content/uploads/2024/12/440986.webp" 
              alt="Icontec ISO 9001" 
              className="h-40 mb-2" 
            />
            <p>N° Certificado</p>
            <p>SC-CER440986</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Síguenos</h3>
            <div className="flex space-x-4 text-white">
              <a href="#" aria-label="Facebook" className="hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
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
