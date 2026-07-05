/* eslint-disable react/prop-types */

const RequestPolicies = ({
    policiesAccepted,
    setPoliciesAccepted,
    dataTreatmentAccepted,
    setDataTreatmentAccepted
}) => (
    <div className="animate-fade-in space-y-5 pb-4">
        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Politica de escenarios y tratamiento de datos</h3>

        <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-4 h-48 overflow-y-auto text-sm text-gray-700 space-y-3 shadow-inner custom-scrollbar">
            <p className="font-bold text-purple-900 text-base mb-4">Normas generales para el uso de instalaciones</p>
            <ul className="list-disc pl-5 space-y-2 marker:text-purple-500">
                <li>No se permite consumir alimentos ni bebidas dentro de los auditorios, salvo autorizacion expresa.</li>
                <li>Se manejan bloques de 4 horas.</li>
                <li>No se permite el ingreso de alimentos de proveedores no inscritos en la CCF Compensar, Consorcio o UCompensar.</li>
                <li>Se debe incluir dentro de las solicitudes el valor de las horas de montaje cuando se requieran.</li>
                <li>En horarios fuera de la operacion de la universidad, se debera incluir el personal necesario para la ejecucion del evento.</li>
                <li>Los proveedores deberan cumplir con la normativa sanitaria vigente, usar utensilios biodegradables o reutilizables y cumplir con los requerimientos de SST.</li>
                <li>Esta prohibido cocinar, calentar o preparar alimentos dentro de los auditorios.</li>
                <li>Cualquier dano ocasionado a las instalaciones sera responsabilidad del organizador.</li>
                <li>No se permite el consumo de bebidas alcoholicas.</li>
                <li>En las areas comunes no se puede solicitar exclusividad.</li>
                <li>No se permite el ingreso de mascotas.</li>
                <li>Se deben respetar los aforos establecidos en la ficha tecnica y brochure.</li>
            </ul>
        </div>

        <div className="space-y-4 pt-4 px-2">
            <label className="flex items-start gap-4 cursor-pointer group">
                <div className="flex items-center h-6 mt-0.5">
                    <input
                        type="checkbox"
                        className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer transition-colors"
                        checked={policiesAccepted}
                        onChange={(event) => setPoliciesAccepted(event.target.checked)}
                    />
                </div>
                <span className="text-base text-gray-700 group-hover:text-gray-900 transition-colors leading-relaxed">
                    He leido, comprendo y <strong>acepto las politicas de escenarios y normas generales</strong> aplicables a mi reserva.
                </span>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group">
                <div className="flex items-center h-6 mt-0.5">
                    <input
                        type="checkbox"
                        className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer transition-colors"
                        checked={dataTreatmentAccepted}
                        onChange={(event) => setDataTreatmentAccepted(event.target.checked)}
                    />
                </div>
                <span className="text-base text-gray-700 group-hover:text-gray-900 transition-colors leading-relaxed">
                    Autorizo el <a href="https://ucompensar.edu.co/pdf/documentos/POL-PAJ-02-V08-Tratamiento-de-datos-personales.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-bold hover:underline hover:text-purple-800 transition-colors" onClick={(event) => event.stopPropagation()}>tratamiento de mis datos personales</a> conforme a las politicas corporativas.
                </span>
            </label>
        </div>
    </div>
);

export default RequestPolicies;
