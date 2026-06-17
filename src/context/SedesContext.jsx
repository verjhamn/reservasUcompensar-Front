import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSedesEstado, toggleSedeEstado } from '../Services/sedesService';

const STORAGE_KEY = 'sedes_estado';

const defaultSedes = [
    { id: '1', nombre: 'Campus Av. 68', activo: true },
    { id: '2', nombre: 'Campus Teusaquillo', activo: true },
];

const SedesContext = createContext(null);

export const SedesProvider = ({ children }) => {
    const [sedes, setSedes] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : defaultSedes;
        } catch {
            return defaultSedes;
        }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadFromApi = async () => {
            try {
                setLoading(true);
                const data = await getSedesEstado();
                if (data?.sedes) {
                    setSedes(data.sedes);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.sedes));
                }
            } catch {
                // API no disponible: se usa el estado de localStorage/defaults
            } finally {
                setLoading(false);
            }
        };
        loadFromApi();
    }, []);

    const toggleSede = async (sedeId) => {
        const sede = sedes.find(s => s.id === sedeId);
        if (!sede) return;

        const updatedSedes = sedes.map(s =>
            s.id === sedeId ? { ...s, activo: !s.activo } : s
        );
        setSedes(updatedSedes);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSedes));

        try {
            await toggleSedeEstado(sedeId, !sede.activo);
        } catch {
            // Si falla la API, el estado local ya quedó actualizado
        }
    };

    const isSedeActive = (sedeId) => {
        const sede = sedes.find(s => s.id === sedeId);
        return sede ? sede.activo : true;
    };

    return (
        <SedesContext.Provider value={{ sedes, toggleSede, isSedeActive, loading }}>
            {children}
        </SedesContext.Provider>
    );
};

export const useSedes = () => {
    const context = useContext(SedesContext);
    if (!context) throw new Error('useSedes debe usarse dentro de SedesProvider');
    return context;
};
