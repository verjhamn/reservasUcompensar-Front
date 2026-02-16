import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';

const QRSimulator = () => {
    const navigate = useNavigate();
    const [qrCode, setQrCode] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const testQRCodes = [
        {
            nombre: 'Ejemplo UUID',
            // ... (resto de códigos)
        },
        // ...
    ];

    const handleSimulate = () => {
        if (qrCode.trim()) {
            navigate(`/espacio/${qrCode.trim()}`);
        }
    };

    const handleQuickTest = (codigo) => {
        navigate(`/espacio/${codigo}`);
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 z-50 bg-neutral-800 text-white p-3 rounded-full shadow-lg hover:bg-neutral-700 transition-colors flex items-center gap-2 opacity-50 hover:opacity-100"
                title="Abrir Simulador QR"
            >
                <QrCode className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white border border-neutral-200 rounded-xl p-4 shadow-2xl w-80 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-neutral-800">Simulador QR</h3>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-neutral-400 hover:text-neutral-600 text-sm font-medium"
                >
                    Ocultar
                </button>
            </div>

            <div className="space-y-3">
                <input
                    type="text"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    placeholder="Código UUID del espacio..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
                />

                <button
                    onClick={handleSimulate}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Simular Escaneo
                </button>

                <div className="mt-2 text-xs text-neutral-500">
                    <p className="mb-1 font-medium">Pruebas rápidas:</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleQuickTest('27184818-d9c7-11ef-a876-0050568fe02c')}
                            className="bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded text-neutral-700 transition-colors"
                        >
                            Ejemplo UUID
                        </button>
                        <button
                            onClick={() => handleQuickTest('P3C01L')}
                            className="bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded text-neutral-700 transition-colors"
                        >
                            Espacio Prueba
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRSimulator;
