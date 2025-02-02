import React, { useState } from "react";

const LoginTest = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Simular autenticación exitosa
    onLoginSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <img src="https://ucompensar.edu.co/wp-content/uploads/2021/04/main-logo.svg" alt="Logo Institucional" className="h-12" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario_correo@ucompensar.edu.co"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa"
              required
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-gray-700">Recordarme</label>
            </div>
            <a href="#" className="text-turquesa hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-700">¿No tienes una cuenta? <a href="#" className="text-turquesa hover:underline">Regístrate</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginTest;
