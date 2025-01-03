import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-8"> {/* Usamos bg-gray-700 */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        {/* Columna 1: Información de contacto */}
        <div>
          <img
            src="https://ucompensar.edu.co/wp-content/uploads/2021/09/Logo-Fundacion-Universitaria-compensar.svg"
            alt="Logo Compensar"
            className="h-12 mb-4"
          />
          <p className="text-sm mb-4">
          Para requerimientos de autoridades, tutelas o notificaciones judiciales por favor dirigirse al correo:
          </p>
            <a
              href="mailto:cuposeducon@ucompensar.edu.co"
              className="text-orange-500 hover:underline"
            >
              notificacionesjudiciales@ucompensar.edu.co
            </a>

        </div>

        {/* Columna 2: Sedes */}
        <div>
          <h3 className="text-lg font-bold text-orange-500 mb-4">Bogotá</h3>
          <p className="text-sm mb-4">
            Bogotá Sede Principal <br />
            Av. Calle 32 No. 17 - 30 <br />
            Teléfono: 338 06 66
          </p>
          <p className="text-sm mb-4">
            Sede Nuevo Campus <br />
            Av Carrera 68 No. 68 B - 45
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-orange-500 mb-4">Villavicencio</h3>
          <p className="text-sm">
            Sede Cofrem <br />
            Carrera 35 No. 20A-02 <br />
            Vía Catama (antes del Colegio Cofrem) <br />
            Teléfono: 681 86 40
          </p>
        </div>

        {/* Columna 3: Certificado y redes sociales */}
        <div className="text-center md:text-left">
          {/* Nueva imagen del certificado */}
          <img
            src="https://ucompensar.edu.co/wp-content/uploads/2024/12/440986.webp"
            alt="Certificación ISO"
            className="h-44 mx-auto md:mx-0"
          />
          <p className="text-sm mb-4">Nº Certificado SC-CER440986</p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="#"
              className="text-white hover:text-orange-500 transition"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook fa-lg"></i>
            </a>
            <a
              href="#"
              className="text-white hover:text-orange-500 transition"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter fa-lg"></i>
            </a>
            <a
              href="#"
              className="text-white hover:text-orange-500 transition"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram fa-lg"></i>
            </a>
            <a
              href="#"
              className="text-white hover:text-orange-500 transition"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube fa-lg"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
