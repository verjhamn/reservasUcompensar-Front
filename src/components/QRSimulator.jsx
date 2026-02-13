import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';

const QRSimulator = () => {
    const navigate = useNavigate();
    const [qrCode, setQrCode] = useState('');

    const testQRCodes = [
        {
            nombre: 'Ejemplo UUID',
            codigo: '27184818-d9c7-11ef-a876-0050568fe02c'
        },
        {
            nombre: 'Espacio de prueba',
            codigo: 'P3C01L'
        },
    ];

    const handleSimulate = () => {
        if (qrCode.trim()) {
            navigate(`/espacio/${qrCode.trim()}`);
        }
    };

    const handleQuickTest = (codigo) => {
        navigate(`/espacio/${codigo}`);
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
                <QrCode className="w-5 h-5 text-yellow-700" />
                <h3 className="font-semibold text-yellow-900">Simulador de QR (Testing)</h3>
            </div>

            <div className="space-y-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={qrCode}
                        onChange={(e) => setQrCode(e.target.value)}
                        placeholder="Ingresa código del espacio (ej: 27184818-d9c7-11ef...)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                        onClick={handleSimulate}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm"
                    >
                        Simular
                    </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <span className="text-xs text-gray-600">Pruebas rápidas:</span>
                    {testQRCodes.map((qr) => (
                        <button
                            key={qr.codigo}
                            onClick={() => handleQuickTest(qr.codigo)}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                        >
                            {qr.nombre}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QRSimulator;
