import React, { useState } from 'react';
import { CheckCircle, Calendar } from 'lucide-react';

import { crearReservaExterna } from '../../../Services/externalReservationService';
import { toast, Toaster } from 'react-hot-toast';

const QuoteForm = ({ spaceData, quoteData, onBack, onSuccess }) => {
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
        esCompensar: false,
        compensarId: '',
        centroCostos: '',
        tipoEvento: '',
        tiempoMontajeHoras: '',
        cantidadPersonas: '',
        detalles: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [policiesAccepted, setPoliciesAccepted] = useState(false);
    const [dataTreatmentAccepted, setDataTreatmentAccepted] = useState(false);
    const [errors, setErrors] = useState({});

    const [currentStep, setCurrentStep] = useState(1); // 1: Personales, 2: Empresa, 3: Evento, 4: Políticas
    const totalSteps = 4;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const safeRender = (value) => {
        if (typeof value === 'object' && value !== null) {
            return value.nombre || value.name || value.label || '';
        }
        return value;
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
            else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,100}$/.test(formData.nombre)) newErrors.nombre = 'Mínimo 3 letras o espacios';

            if (!formData.tipoDocumento) newErrors.tipoDocumento = 'Requerido';

            if (!formData.numeroDocumento) newErrors.numeroDocumento = 'Requerido';
            else if (!/^[A-Za-z0-9]{5,20}$/.test(formData.numeroDocumento)) newErrors.numeroDocumento = 'Mínimo 5 caracteres alfanuméricos';

            if (!formData.correo) newErrors.correo = 'El correo es requerido';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) newErrors.correo = 'Formato de correo inválido';

            if (!formData.telefono) newErrors.telefono = 'El teléfono es requerido';
            else if (!/^\d{10}$/.test(formData.telefono)) newErrors.telefono = 'Debe tener exactamente 10 dígitos';

            if (Object.keys(newErrors).length > 0) isValid = false;
        }

        if (step === 2) {
            if (!formData.empresa) newErrors.empresa = 'Requerido';
            else if (formData.empresa.length < 2) newErrors.empresa = 'Mínimo 2 caracteres';

            if (!formData.tipoDocumentoEmpresa) newErrors.tipoDocumentoEmpresa = 'Requerido';

            if (!formData.numeroDocumentoEmpresa) newErrors.numeroDocumentoEmpresa = 'Requerido';
            else if (formData.tipoDocumentoEmpresa === 'NIT' && !/^\d{8,15}$/.test(formData.numeroDocumentoEmpresa)) newErrors.numeroDocumentoEmpresa = 'NIT debe tener entre 8 y 15 números';
            else if (formData.tipoDocumentoEmpresa !== 'NIT' && formData.numeroDocumentoEmpresa.length < 5) newErrors.numeroDocumentoEmpresa = 'Mínimo 5 caracteres';

            if (!formData.telefonoEmpresa) newErrors.telefonoEmpresa = 'Requerido';
            else if (!/^\d{10}$/.test(formData.telefonoEmpresa)) newErrors.telefonoEmpresa = 'Debe tener exactamente 10 dígitos';

            if (!formData.direccionEmpresa) newErrors.direccionEmpresa = 'Requerido';

            if (formData.esCompensar) {
                if (!formData.compensarId) newErrors.compensarId = 'Requerido';
                if (!formData.centroCostos) newErrors.centroCostos = 'Requerido';
            }

            if (Object.keys(newErrors).length > 0) isValid = false;
        }

        if (step === 3) {
            if (!formData.tipoEvento) newErrors.tipoEvento = 'Requerido';
            if (!formData.cantidadPersonas || formData.cantidadPersonas < 1) newErrors.cantidadPersonas = 'Mínimo 1 persona';
            if (!formData.tiempoMontajeHoras) newErrors.tiempoMontajeHoras = 'Requerido';

            if (Object.keys(newErrors).length > 0) isValid = false;
        }

        if (step === 4) {
            if (!policiesAccepted || !dataTreatmentAccepted) {
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
            else toast.error("Por favor revisa los campos en rojo para continuar.", {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#FEF2F2',
                    color: '#991B1B',
                    border: '1px solid #FECACA',
                    padding: '16px',
                    fontWeight: '500',
                },
                iconTheme: {
                    primary: '#991B1B',
                    secondary: '#FEF2F2',
                },
            });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else if (onBack) {
            onBack();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Si el usuario presiona "Enter" en un input antes del último paso, avanzamos de paso en vez de emitir error
        if (currentStep < totalSteps) {
            handleNext();
            return;
        }

        if (!validateStep(4)) {
            toast.error("Por favor acepta las políticas y tratamiento de datos para enviar la cotización.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const d = quoteData?.date ? new Date(quoteData.date) : new Date();
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const anio = d.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${anio}`;

        const requestData = {
            solicitante: {
                nombre: formData.nombre,
                tipo_documento: formData.tipoDocumento,
                numero_documento: formData.numeroDocumento,
                correo: formData.correo,
                correo_alternativo: "",
                telefono: formData.telefono,
                es_compensar: formData.esCompensar
            },
            empresa: {
                nombre: formData.empresa,
                tipo_documento: formData.tipoDocumentoEmpresa,
                numero_documento: formData.numeroDocumentoEmpresa,
                digito_verificacion: "0",
                telefono: formData.telefonoEmpresa,
                direccion: formData.direccionEmpresa,
                ...(formData.esCompensar ? { compensar_id: formData.compensarId, centro_costo: formData.centroCostos } : {})
            },
            reserva: {
                espacio_id: spaceData?.id,
                fecha: fechaFormateada,
                hora_inicio: quoteData?.startTime,
                hora_fin: quoteData?.endTime,
                tiempo_montaje: (parseInt(formData.tiempoMontajeHoras) || 0) * 60,
                cantidad_personas: parseInt(formData.cantidadPersonas) || 0
            },
            evento: {
                tipo: formData.tipoEvento,
                detalles: formData.detalles,
                fecha_solicitud: new Date().toISOString()
            }
        };

        try {
            await crearReservaExterna(requestData);
            setShowSuccess(true);
        } catch (err) {
            console.error(err);
            if (err.errors && Object.keys(err.errors).length > 0) {
                const primerError = Object.values(err.errors)[0][0];
                setError(primerError || err.message);
            } else {
                setError(err.message || "Hubo un error al enviar la solicitud. Por favor intenta nuevamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = () => {
        if (onSuccess) {
            onSuccess();
        }
    };

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in h-full bg-white rounded-2xl">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 mb-6 border-4 border-purple-50">
                    <CheckCircle className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Solicitud de Cotización Recibida!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                    La solicitud de espacio ha sido radicada con éxito. Próximamente se dará respuesta sobre su viabilidad y, una vez validada, se confirmará la reserva por medio del correo electrónico.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={handleFinish}
                        className="bg-purple-600 text-white rounded-xl py-3 px-8 font-semibold hover:bg-purple-700 transition duration-200 shadow-md flex items-center gap-2"
                    >
                        <span>Cerrar</span>
                    </button>
                </div>
            </div>
        );
    }

    const formattedDate = quoteData?.date ? new Date(quoteData.date).toLocaleDateString() : '';

    return (
        <div className="flex flex-col h-full bg-white animate-fade-in relative z-10 w-full max-w-5xl mx-auto rounded-xl">
            <Toaster />

            {/* Progress Bar */}
            <div className="bg-gray-50/80 px-4 py-4 rounded-xl mb-6 border border-gray-100 shadow-sm shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-purple-800 uppercase tracking-wider">
                        Paso {currentStep} de {totalSteps}
                    </span>
                    <span className="text-sm font-semibold text-gray-600">
                        {currentStep === 1 && "Datos Personales"}
                        {currentStep === 2 && "Datos de Empresa"}
                        {currentStep === 3 && "Detalles del Evento"}
                        {currentStep === 4 && "Políticas de Uso"}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 overflow-hidden min-h-0">
                {/* Resumen lateral (Izq) */}
                <div className="w-full lg:w-1/3 shrink-0 flex flex-col">
                    <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            <h4 className="font-bold text-purple-900 text-lg">Resumen</h4>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider mb-1">Espacio Seleccionado</p>
                                <p className="text-sm text-gray-800 font-medium">
                                    {safeRender(spaceData?.Titulo)} - {safeRender(spaceData?.codigo)}
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    Tipo: {safeRender(spaceData?.tipo)}
                                </p>
                                <p className="text-xs text-gray-600">
                                    Sede: {safeRender(spaceData?.sede)}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-purple-200/60">
                                <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider mb-1">Fecha Preferida</p>
                                <p className="text-sm text-gray-800 font-medium">{formattedDate}</p>
                            </div>

                            <div className="pt-4 border-t border-purple-200/60">
                                <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider mb-1">Horarios Preferidos</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {quoteData?.hours?.map(h => (
                                        <span key={h} className="bg-white border border-purple-200 text-purple-700 text-xs py-1 px-3 rounded-md shadow-sm font-medium">
                                            {h}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-purple-700 mt-3 font-medium bg-purple-100/50 p-2 rounded-lg border border-purple-100 text-center">
                                    Rango: {quoteData?.startTime} - {quoteData?.endTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulario (Der) */}
                <div className="w-full lg:w-2/3 flex flex-col flex-1 bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="h-full flex flex-col p-6">
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {/* Seccion 1: Datos Personales */}
                            {currentStep === 1 && (
                                <div className="animate-fade-in space-y-5 pb-4">
                                    <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Datos del Solicitante</h3>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Nombre(s) y apellido(s) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all bg-gray-50/50 hover:bg-white focus:ring-2 ${errors.nombre ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                placeholder="Ej. Juan Pérez"
                                            />
                                            {errors.nombre && <p className={`text-red-500 text-[11px] font-semibold mt-1 focus:ring-2 ${errors.numeroDocumento ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>{errors.nombre}</p>}
                                        </div>
                                        <div className={`space-y-1.5 focus:ring-2 ${errors.correo ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>
                                            <label className={`text-sm font-semibold text-gray-700 focus:ring-2 ${errors.telefono ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>
                                                Tipo de documento <span className={`text-red-500 focus:ring-2 ${errors.compensarId ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>*</span>
                                            </label>
                                            <select
                                                name="tipoDocumento"
                                                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-700 focus:ring-2 ${errors.tipoDocumento ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}
                                                value={formData.tipoDocumento}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled hidden>Seleccionar</option>
                                                <option value="CC">Cédula de Ciudadanía</option>
                                                <option value="CE">Cédula de Extranjería</option>
                                                <option value="TI">Tarjeta de Identidad</option>
                                                <option value="PA">Pasaporte</option>
                                            </select>
                                            {errors.tipoDocumento && <p className={`text-red-500 text-[11px] font-semibold mt-1 focus:ring-2 ${errors.centroCostos ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>{errors.tipoDocumento}</p>}
                                        </div>
                                        <div className={`space-y-1.5 focus:ring-2 ${errors.empresa ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>
                                            <label className={`text-sm font-semibold text-gray-700 focus:ring-2 ${errors.tipoDocumentoEmpresa ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>
                                                Número de documento <span className={`text-red-500 focus:ring-2 ${errors.numeroDocumentoEmpresa ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="numeroDocumento"
                                                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all bg-gray-50/50 hover:bg-white focus:ring-2 ${errors.telefonoEmpresa ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}
                                                value={formData.numeroDocumento}
                                                onChange={handleChange}
                                                placeholder="Ej. 1020304050"
                                            />
                                            {errors.numeroDocumento && <p className={`text-red-500 text-[11px] font-semibold mt-1 focus:ring-2 ${errors.direccionEmpresa ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>{errors.numeroDocumento}</p>}
                                        </div>
                                        <div className={`space-y-1.5 focus:ring-2 ${errors.tipoEvento ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>
                                            <label className={`text-sm font-semibold text-gray-700 focus:ring-2 ${errors.cantidadPersonas ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>
                                                Correo electrónico <span className={`text-red-500 focus:ring-2 ${errors.tiempoMontajeHoras ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}>*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="correo"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white"
                                                value={formData.correo}
                                                onChange={handleChange}
                                                placeholder="correo@ejemplo.com"
                                            />
                                            {errors.correo && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.correo}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Teléfono / celular <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                placeholder="Ej. 300 123 4567"
                                            />
                                            {errors.telefono && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.telefono}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Seccion 2: Datos de la empresa */}
                            {currentStep === 2 && (
                                <div className="animate-fade-in space-y-5 pb-4">
                                    <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Datos de su Empresa</h3>

                                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-purple-900 text-sm">¿Eres colaborador o aliado interno de Compensar?</p>
                                            <p className="text-xs text-purple-700 mt-0.5">Se solicitará tu identificador y centro de costos.</p>
                                        </div>
                                        <div
                                            onClick={() => setFormData({ ...formData, esCompensar: !formData.esCompensar })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors focus:outline-none ${formData.esCompensar ? 'bg-purple-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.esCompensar ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </div>
                                    </div>

                                    {formData.esCompensar && (
                                        <div className="grid md:grid-cols-2 gap-5 bg-purple-50/50 p-4 rounded-xl border border-purple-100/50 animate-fade-in">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-purple-900">
                                                    Identificador Compensar <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="compensarId"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                                                    value={formData.compensarId}
                                                    onChange={handleChange}
                                                    placeholder="Ej. ID Interno"
                                                />
                                                {errors.compensarId && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.compensarId}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-purple-900">
                                                    Centro de Costos <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="centroCostos"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                                                    value={formData.centroCostos}
                                                    onChange={handleChange}
                                                    placeholder="Ej. CC-1234"
                                                />
                                                {errors.centroCostos && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.centroCostos}</p>}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Razón Social / Nombre <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="empresa"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white"
                                                value={formData.empresa}
                                                onChange={handleChange}
                                                placeholder="Ej. Empresa SA"
                                            />
                                            {errors.empresa && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.empresa}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Tipo de documento <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="tipoDocumentoEmpresa"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-700"
                                                value={formData.tipoDocumentoEmpresa}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled hidden>Seleccionar</option>
                                                <option value="NIT">NIT</option>
                                                <option value="RUT">RUT</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                            {errors.tipoDocumentoEmpresa && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.tipoDocumentoEmpresa}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Número de documento <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="numeroDocumentoEmpresa"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white"
                                                value={formData.numeroDocumentoEmpresa}
                                                onChange={handleChange}
                                                placeholder="Sin dígito de verificación"
                                            />
                                            {errors.numeroDocumentoEmpresa && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.numeroDocumentoEmpresa}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Teléfono corporativo <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="telefonoEmpresa"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white"
                                                value={formData.telefonoEmpresa}
                                                onChange={handleChange}
                                                placeholder="Teléfono fijo o celular"
                                            />
                                            {errors.telefonoEmpresa && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.telefonoEmpresa}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Dirección empresa <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="direccionEmpresa"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white"
                                                value={formData.direccionEmpresa}
                                                onChange={handleChange}
                                                placeholder="Ej. Calle 123 #45-67"
                                            />
                                            {errors.direccionEmpresa && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.direccionEmpresa}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Seccion 3: Detalles del evento */}
                            {currentStep === 3 && (
                                <div className="animate-fade-in space-y-5 pb-4">
                                    <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Detalles de su Evento</h3>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Tipo de evento / Propósito <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="tipoEvento"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white"
                                                placeholder="Ej: Capacitación, Seminario, Lanzamiento..."
                                                value={formData.tipoEvento}
                                                onChange={handleChange}
                                            />
                                            {errors.tipoEvento && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.tipoEvento}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">Cantidad de asistentes (Aforo) <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                min="1"
                                                name="cantidadPersonas"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white"
                                                placeholder="Ej: 50"
                                                value={formData.cantidadPersonas}
                                                onChange={handleChange}
                                            />
                                            {errors.cantidadPersonas && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.cantidadPersonas}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">Tiempo de montaje previo <span className="text-red-500">*</span></label>
                                            <select
                                                name="tiempoMontajeHoras"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-700"
                                                value={formData.tiempoMontajeHoras}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled hidden>Seleccionar tiempo...</option>
                                                <option value="0">Sin montaje previo (0 horas)</option>
                                                <option value="1">1 Hora</option>
                                                <option value="2">2 Horas</option>
                                                <option value="3">3 Horas</option>
                                                <option value="4">Medio día (4 Horas)</option>
                                                <option value="8">Día completo (8 Horas)</option>
                                            </select>
                                            {errors.tiempoMontajeHoras && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.tiempoMontajeHoras}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Observaciones adicionales</label>
                                        <textarea
                                            name="detalles"
                                            rows="4"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white resize-none custom-scrollbar"
                                            placeholder="Número de asistentes estimado, requerimientos especiales (catering, equipos extra...), o algo importante."
                                            value={formData.detalles}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            {/* Seccion 4: Políticas y Tratamiento de Datos */}
                            {currentStep === 4 && (
                                <div className="animate-fade-in space-y-5 pb-4">
                                    <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Política de Escenarios y Tratamiento de Datos</h3>

                                    <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-4 h-48 overflow-y-auto text-sm text-gray-700 space-y-3 shadow-inner custom-scrollbar">
                                        <p className="font-bold text-purple-900 text-base mb-4">Normas Generales para el uso de instalaciones</p>
                                        <ul className="list-disc pl-5 space-y-2 marker:text-purple-500">
                                            <li>No se permite consumir alimentos ni bebidas dentro de los auditorios, salvo autorización expresa.</li>
                                            <li>Se manejan bloques de 4 horas (8 a.m. a 12 m; 1p.m. a 5 p.m.; 6p.m. a 10 p.m.)</li>
                                            <li>No se permite el ingreso de alimentos de proveedores no inscritos en la CCF Compensar, Consorcio o UCompensar.</li>
                                            <li>Se debe incluir dentro de las cotizaciones el valor de las horas de montaje cuando se requieran.</li>
                                            <li>En horarios fuera de la operación de la universidad, se deberá incluir el personal necesario para la ejecución del evento.</li>
                                            <li>Los proveedores deberán cumplir con la normativa sanitaria vigente, usar utensilios biodegradables o reutilizables y cumplir con los requerimientos de SST.</li>
                                            <li>Está prohibido cocinar, calentar o preparar alimentos dentro de los auditorios.</li>
                                            <li>Cualquier daño ocasionado a las instalaciones será responsabilidad del organizador.</li>
                                            <li>El incumplimiento de este procedimiento podrá derivar en la suspensión temporal del derecho a uso de espacios institucionales.</li>
                                            <li>No se permite el consumo de bebidas alcohólicas.</li>
                                            <li>En las áreas comunes no se puede solicitar exclusividad.</li>
                                            <li>No se permite el ingreso de mascotas.</li>
                                            <li>Se deben respetar los aforos establecidos en la ficha técnica y brochure.</li>
                                            <li>Todas las actividades que se desarrollen en las instalaciones de UCompensar deben estar dentro del marco regulatorio de las instituciones educativas.</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4 pt-4 px-2">
                                        <label className="flex items-start gap-4 cursor-pointer group">
                                            <div className="flex items-center h-6 mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer transition-colors"
                                                    checked={policiesAccepted}
                                                    onChange={(e) => setPoliciesAccepted(e.target.checked)}
                                                />
                                            </div>
                                            <span className="text-base text-gray-700 group-hover:text-gray-900 transition-colors leading-relaxed">
                                                He leído, comprendo y <strong>acepto las Políticas de escenarios y normas generales</strong> aplicables a mi reserva.
                                            </span>
                                        </label>

                                        <label className="flex items-start gap-4 cursor-pointer group">
                                            <div className="flex items-center h-6 mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer transition-colors"
                                                    checked={dataTreatmentAccepted}
                                                    onChange={(e) => setDataTreatmentAccepted(e.target.checked)}
                                                />
                                            </div>
                                            <span className="text-base text-gray-700 group-hover:text-gray-900 transition-colors leading-relaxed">
                                                Autorizo el <a href="https://ucompensar.edu.co/pdf/documentos/POL-PAJ-02-V08-Tratamiento-de-datos-personales.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-bold hover:underline hover:text-purple-800 transition-colors" onClick={(e) => e.stopPropagation()}>Tratamiento de mis Datos Personales</a> conforme a las políticas corporativas.
                                            </span>
                                        </label>
                                    </div>

                                    {error && (
                                        <div className="p-4 mt-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200 font-medium animate-fade-in flex items-start gap-2">
                                            <span className="text-red-500">⚠</span>
                                            {error}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Footer Buttons */}
                        <div className="pt-5 shrink-0 flex justify-between gap-4 mt-auto border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                            >
                                {currentStep === 1 ? 'Volver al calendario' : 'Anterior'}
                            </button>

                            {currentStep < totalSteps && (
                                <button
                                    key="next-btn"
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5 shadow-md transition-all duration-200"
                                >
                                    Siguiente
                                </button>
                            )}

                            {currentStep === totalSteps && (
                                <button
                                    key="submit-btn"
                                    type="submit"
                                    disabled={isLoading}
                                    className={`px-8 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-md transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5 duration-200'}`}
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
        </div>
    );
};

export default QuoteForm;
