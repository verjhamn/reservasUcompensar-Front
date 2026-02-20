import React, { useState } from 'react';
import { X, CheckCircle, Store, User, Mail, Phone, Calendar } from 'lucide-react';

import { sendQuoteRequest } from '../services/quoteService';
import { toast, Toaster } from 'react-hot-toast';

const QuoteRequestModal = ({ isOpen, onClose, spaceData, quoteData, onBack, isEmbedded = false }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        tipoDocumento: '',
        numeroDocumento: '',
        correo: '',
        telefono: '',
        empresa: '',
        tipoDocumentoEmpresa: '',
        numeroDocumentoEmpresa: '',
        telefonoEmpresa: '',
        direccionEmpresa: '',
        tipoEvento: '',
        detalles: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentStep, setCurrentStep] = useState(1); // 1: Personales, 2: Empresa, 3: Evento
    const totalSteps = 3;

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Helper para evitar errores de renderizado de objetos
    const safeRender = (value) => {
        if (typeof value === 'object' && value !== null) {
            return value.nombre || value.name || value.label || '';
        }
        return value;
    };

    const validateStep = (step) => {
        if (step === 1) {
            return formData.nombre && formData.tipoDocumento && formData.numeroDocumento && formData.correo && formData.telefono;
        }
        if (step === 2) {
            // Asumiendo que son requeridos como en el form anterior:
            return formData.empresa && formData.tipoDocumentoEmpresa && formData.numeroDocumentoEmpresa && formData.telefonoEmpresa && formData.direccionEmpresa;
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
            else toast.error("Por favor completa todos los campos requeridos para continuar.", {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#F3E8FF', // purple-50
                    color: '#7E22CE', // purple-700
                    border: '1px solid #D8B4FE', // purple-300
                    padding: '16px',
                    fontWeight: '500',
                },
                iconTheme: {
                    primary: '#7E22CE', // purple-700
                    secondary: '#FAF5FF', // purple-50
                },
            });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else if (onBack) {
            onBack();
        } else {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Construir JSON de solicitud extendido
        const requestData = {
            solicitante: {
                nombre: formData.nombre,
                tipo_documento: formData.tipoDocumento,
                numero_documento: formData.numeroDocumento,
                correo: formData.correo,
                telefono: formData.telefono
            },
            empresa: {
                nombre: formData.empresa,
                tipo_documento: formData.tipoDocumentoEmpresa,
                numero_documento: formData.numeroDocumentoEmpresa,
                telefono: formData.telefonoEmpresa,
                direccion: formData.direccionEmpresa
            },
            espacio: {
                id: spaceData?.id,
                codigo: safeRender(spaceData?.codigo),
                nombre: safeRender(spaceData?.Titulo),
                sede: safeRender(spaceData?.sede),
                tipo: safeRender(spaceData?.tipo)
            },
            seleccion: {
                fecha: quoteData?.date,
                hora_inicio: quoteData?.startTime,
                hora_fin: quoteData?.endTime,
                horas_totales: quoteData?.hours
            },
            evento: {
                tipo: formData.tipoEvento,
                detalles: formData.detalles,
                fecha_solicitud: new Date().toISOString()
            }
        };

        try {
            await sendQuoteRequest(requestData);
            setShowSuccess(true);
        } catch (err) {
            setError("Hubo un error al enviar la solicitud. Por favor intenta nuevamente.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setShowSuccess(false);
        setCurrentStep(1);
        setFormData({
            nombre: '',
            tipoDocumento: '',
            numeroDocumento: '',
            correo: '',
            telefono: '',
            empresa: '',
            tipoDocumentoEmpresa: '',
            numeroDocumentoEmpresa: '',
            telefonoEmpresa: '',
            direccionEmpresa: '',
            tipoEvento: '',
            detalles: ''
        });
        onClose();
    };

    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-6">
                        <CheckCircle className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud Recibida!</h3>
                    <p className="text-gray-500 mb-8">
                        Hemos generado tu solicitud de cotización exitosamente. Un asesor comercial te contactará pronto al correo <strong>{formData.correo}</strong>.
                    </p>
                    <button
                        onClick={handleClose}
                        className="w-full bg-purple-600 text-white rounded-lg py-3 px-4 font-semibold hover:bg-purple-700 transition duration-200"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        );
    }

    const formattedDate = quoteData?.date ? new Date(quoteData.date).toLocaleDateString() : '';

    const content = (
        <div className={`bg-white rounded-2xl ${!isEmbedded ? 'shadow-2xl w-full max-w-2xl' : 'w-full'} overflow-hidden flex flex-col ${!isEmbedded ? 'max-h-[90vh]' : 'h-full'}`}>
            {!isEmbedded && <Toaster />}
            {/* Header */}
            <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Solicitar Cotización de Evento
                </h2>
                {!isEmbedded && (
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                    >
                        <X className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                        Paso {currentStep} de {totalSteps}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                        {currentStep === 1 && "Datos Personales"}
                        {currentStep === 2 && "Datos de Empresa"}
                        {currentStep === 3 && "Detalles del Evento"}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
                {/* Espacio seleccionado info - Always visible */}
                <div className="mb-6 bg-purple-50 p-4 rounded-lg flex items-start gap-3 border border-purple-100">
                    <Calendar className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-purple-900">Espacio Seleccionado</h4>
                        <p className="text-sm text-purple-700">
                            {safeRender(spaceData?.Titulo)} - {safeRender(spaceData?.codigo)} <br />
                            <span className="opacity-75">{safeRender(spaceData?.tipo)} en sede {safeRender(spaceData?.sede)}</span>
                        </p>
                        {quoteData && (
                            <div className="mt-2 pt-2 border-t border-purple-200">
                                <p className="text-sm font-medium text-purple-800">Fecha y Hora Preferida:</p>
                                <p className="text-sm text-purple-700">
                                    {formattedDate} <br />
                                    {quoteData.startTime} - {quoteData.endTime}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                    <div className="flex-1">
                        {/* Seccion 1: Datos Personales */}
                        {currentStep === 1 && (
                            <div className="animate-fade-in space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Datos Personales</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            Nombre(s) y apellido(s) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            Tipo de documento <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="tipoDocumento"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            value={formData.tipoDocumento}
                                            onChange={handleChange}
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="CC">Cédula de Ciudadanía</option>
                                            <option value="CE">Cédula de Extranjería</option>
                                            <option value="TI">Tarjeta de Identidad</option>
                                            <option value="PA">Pasaporte</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            Número de documento <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="numeroDocumento"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            value={formData.numeroDocumento}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            Correo electrónico <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="correo"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            value={formData.correo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            Teléfono / celular <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Seccion 2: Datos de la empresa */}
                        {currentStep === 2 && (
                            <div className="animate-fade-in space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Datos de la Empresa</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            Nombre empresa <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="empresa"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            value={formData.empresa}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            Tipo de documento empresa <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="tipoDocumentoEmpresa"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            value={formData.tipoDocumentoEmpresa}
                                            onChange={handleChange}
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="NIT">NIT</option>
                                            <option value="RUT">RUT</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            Número de documento empresa <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="numeroDocumentoEmpresa"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            value={formData.numeroDocumentoEmpresa}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            Teléfono / celular corporativo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="telefonoEmpresa"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            value={formData.telefonoEmpresa}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            Dirección empresa <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="direccionEmpresa"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            value={formData.direccionEmpresa}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Seccion 3: Detalles del evento */}
                        {currentStep === 3 && (
                            <div className="animate-fade-in space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Detalles del Evento</h3>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Tipo de evento / Propósito <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="tipoEvento"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Ej: Capacitación, Seminario, Lanzamiento..."
                                        value={formData.tipoEvento}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Observaciones adicionales</label>
                                    <textarea
                                        name="detalles"
                                        rows="4"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                                        placeholder="Número de asistentes estimado, requerimientos especiales, etc."
                                        value={formData.detalles}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 mt-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="pt-6 flex justify-between gap-4 mt-auto border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            {currentStep === 1 ? 'Volver' : 'Atrás'}
                        </button>

                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-8 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 shadow-md transition-all"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-8 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 shadow-md transition-all flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Enviando...
                                    </>
                                ) : (
                                    'Solicitar Cotización'
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );

    if (isEmbedded) {
        return content;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            {content}
        </div>
    );
};

export default QuoteRequestModal;
