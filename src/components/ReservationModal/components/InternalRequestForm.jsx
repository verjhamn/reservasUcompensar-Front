/* eslint-disable react/prop-types */
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { crearSolicitudInterna } from '../../../Services/internalReservationRequestService';
import {
    formatPayloadDate,
    getBackendErrorMessage,
    getRequestDates,
    isValidEmail
} from './requestFormUtils';
import RequestPolicies from './RequestPolicies';

const initialFormData = {
    reservaParaTercero: false,
    correoTitular: '',
    nombreEvento: '',
    tiempoMontajeHoras: '',
    cantidadPersonas: '',
    detalles: ''
};

const InternalRequestForm = ({ spaceData, quoteData, onBack, onSuccess }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [policiesAccepted, setPoliciesAccepted] = useState(false);
    const [dataTreatmentAccepted, setDataTreatmentAccepted] = useState(false);

    const totalSteps = 3;

    const handleChange = (event) => {
        const { name, type, checked, value } = event.target;
        const nextValue = type === 'checkbox' ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: nextValue,
            ...(name === 'reservaParaTercero' && !checked ? { correoTitular: '' } : {})
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (formData.reservaParaTercero) {
                if (!formData.correoTitular) {
                    newErrors.correoTitular = 'El correo del titular es requerido';
                } else if (!isValidEmail(formData.correoTitular)) {
                    newErrors.correoTitular = 'Formato de correo invalido';
                }
            }
        }

        if (step === 2) {
            if (!formData.nombreEvento.trim()) {
                newErrors.nombreEvento = 'El nombre de la solicitud es requerido';
            }

            if (!formData.cantidadPersonas || Number(formData.cantidadPersonas) < 1) {
                newErrors.cantidadPersonas = 'Minimo 1 persona';
            }

            if (formData.tiempoMontajeHoras === '') {
                newErrors.tiempoMontajeHoras = 'El tiempo de montaje es requerido';
            }
        }

        if (step === 3 && (!policiesAccepted || !dataTreatmentAccepted)) {
            newErrors.policies = 'Debes aceptar las politicas y el tratamiento de datos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) {
            toast.error("Por favor revisa los campos en rojo para continuar.");
            return;
        }

        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
            return;
        }

        onBack?.();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (currentStep < totalSteps) {
            handleNext();
            return;
        }

        if (!validateStep(3)) {
            toast.error("Por favor acepta las politicas y tratamiento de datos para enviar la solicitud.");
            return;
        }

        const { startDate, endDate } = getRequestDates(quoteData);
        const requestData = {
            solicitante: {
                correo_alternativo: formData.reservaParaTercero ? formData.correoTitular.trim() : ''
            },
            reserva: {
                espacio_id: spaceData?.id,
                fecha: formatPayloadDate(startDate),
                fecha_fin: formatPayloadDate(endDate || startDate),
                hora_inicio: quoteData?.startTime,
                hora_fin: quoteData?.endTime,
                tiempo_montaje: (parseInt(formData.tiempoMontajeHoras, 10) || 0) * 60,
                cantidad_personas: parseInt(formData.cantidadPersonas, 10) || 0
            },
            solicitud: {
                nombre: formData.nombreEvento.trim(),
                detalles: formData.detalles.trim(),
                fecha_solicitud: new Date().toISOString()
            }
        };

        setIsLoading(true);
        setError(null);

        try {
            await crearSolicitudInterna(requestData);
            setShowSuccess(true);
        } catch (err) {
            const message = getBackendErrorMessage(err, "Hubo un error al enviar la solicitud. Por favor intenta nuevamente.");
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="w-full lg:w-2/3 flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-white rounded-xl border border-gray-100">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 mb-6 border-4 border-purple-50">
                    <CheckCircle className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Solicitud recibida</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                    La solicitud de espacio ha sido radicada con exito. Proximamente se dara respuesta sobre su viabilidad.
                </p>
                <button
                    type="button"
                    onClick={onSuccess}
                    className="bg-purple-600 text-white rounded-xl py-3 px-8 font-semibold hover:bg-purple-700 transition duration-200 shadow-md"
                >
                    Cerrar
                </button>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-2/3 flex flex-col flex-1 bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="h-full flex flex-col p-6">
                <div className="bg-gray-50/80 px-4 py-4 rounded-xl mb-6 border border-gray-100 shadow-sm shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-purple-800 uppercase tracking-wider">
                            Paso {currentStep} de {totalSteps}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                            {currentStep === 1 && "Datos de contacto"}
                            {currentStep === 2 && "Detalles de la solicitud"}
                            {currentStep === 3 && "Politicas de uso"}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {currentStep === 1 && (
                        <div className="animate-fade-in space-y-5 pb-4">
                            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Titular de la reserva</h3>

                            <div className="grid md:grid-cols-2 gap-5">
                                <label className="md:col-span-2 flex items-start gap-3 bg-purple-50/50 border border-purple-100 rounded-xl p-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="reservaParaTercero"
                                        className="w-5 h-5 mt-0.5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                                        checked={formData.reservaParaTercero}
                                        onChange={handleChange}
                                    />
                                    <span>
                                        <span className="block text-sm font-bold text-purple-900">Reservo a nombre de otra persona</span>
                                        <span className="block text-xs text-purple-700 mt-0.5">El correo del titular se usara para asociar la solicitud a esa persona.</span>
                                    </span>
                                </label>

                                {formData.reservaParaTercero && (
                                    <div className="space-y-1.5 md:col-span-2 animate-fade-in">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Correo del titular de la reserva <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="correoTitular"
                                            className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all bg-gray-50/50 hover:bg-white focus:ring-2 ${errors.correoTitular ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}
                                            value={formData.correoTitular}
                                            onChange={handleChange}
                                            placeholder="titular@ucompensar.edu.co"
                                        />
                                        {errors.correoTitular && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.correoTitular}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="animate-fade-in space-y-5 pb-4">
                            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Detalles de la solicitud</h3>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Nombre de la solicitud <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreEvento"
                                        className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all bg-gray-50/50 hover:bg-white focus:ring-2 ${errors.nombreEvento ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}
                                        value={formData.nombreEvento}
                                        onChange={handleChange}
                                        placeholder="Ej. Sustentacion de proyecto"
                                    />
                                    {errors.nombreEvento && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.nombreEvento}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Cantidad de asistentes <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        name="cantidadPersonas"
                                        className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all bg-gray-50/50 hover:bg-white focus:ring-2 ${errors.cantidadPersonas ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}
                                        value={formData.cantidadPersonas}
                                        onChange={handleChange}
                                        placeholder="Ej. 10"
                                    />
                                    {errors.cantidadPersonas && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.cantidadPersonas}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Tiempo de montaje previo <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="tiempoMontajeHoras"
                                        className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-700 focus:ring-2 ${errors.tiempoMontajeHoras ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'}`}
                                        value={formData.tiempoMontajeHoras}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden>Seleccionar tiempo...</option>
                                        <option value="0">Sin montaje previo (0 horas)</option>
                                        <option value="1">1 Hora</option>
                                        <option value="2">2 Horas</option>
                                        <option value="3">3 Horas</option>
                                        <option value="4">Medio dia (4 Horas)</option>
                                        <option value="8">Dia completo (8 Horas)</option>
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
                                    placeholder="Requerimientos especiales o informacion importante."
                                    value={formData.detalles}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <>
                            <RequestPolicies
                                policiesAccepted={policiesAccepted}
                                setPoliciesAccepted={setPoliciesAccepted}
                                dataTreatmentAccepted={dataTreatmentAccepted}
                                setDataTreatmentAccepted={setDataTreatmentAccepted}
                            />

                            {(errors.policies || error) && (
                                <div className="p-4 mt-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200 font-medium animate-fade-in">
                                    {errors.policies || error}
                                </div>
                            )}
                        </>
                    )}
                </div>

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
                            type="button"
                            onClick={handleNext}
                            className="px-8 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5 shadow-md transition-all duration-200"
                        >
                            Siguiente
                        </button>
                    )}

                    {currentStep === totalSteps && (
                        <button
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
                                'Enviar solicitud'
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default InternalRequestForm;
