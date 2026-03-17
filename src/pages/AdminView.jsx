import React, { useState } from 'react';
import { Calendar, Briefcase } from 'lucide-react';
import AdminReservationsView from '../components/AdminReservations/AdminReservationsView';
import ExternalQuotesIndex from '../components/AdminReservations/ExternalQuotes';

const AdminView = () => {
    const [activeTab, setActiveTab] = useState('internas');

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-center mb-8">
                <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2 animate-fade-in">
                    <button
                        onClick={() => setActiveTab('internas')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-out ${activeTab === 'internas'
                                ? 'bg-purple-600 text-white shadow-md transform scale-[1.02]'
                                : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Operación Interna
                    </button>
                    <button
                        onClick={() => setActiveTab('externas')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-out ${activeTab === 'externas'
                                ? 'bg-purple-600 text-white shadow-md transform scale-[1.02]'
                                : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                            }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        Cotizaciones Externas
                    </button>
                </div>
            </div>

            <div className="mt-2 animate-fade-in">
                {activeTab === 'internas' ? (
                    <AdminReservationsView />
                ) : (
                    <ExternalQuotesIndex />
                )}
            </div>
        </div>
    );
};

export default AdminView;
