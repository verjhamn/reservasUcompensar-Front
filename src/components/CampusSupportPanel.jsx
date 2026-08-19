/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Info, Map, X } from 'lucide-react';
import { RESERVATION_GUIDE_URL, TEUSAQUILLO_COWORKING_MAPS } from '../config/campusResources';

const TEUSAQUILLO_CAMPUS_ID = '2';
const COWORKING_SPACE_TYPE = 'Coworking';

const CampusSupportPanel = ({ selectedCampus, selectedSpaceType }) => {
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [activeMapIndex, setActiveMapIndex] = useState(0);

    const showTeusaquilloMaps = selectedCampus === TEUSAQUILLO_CAMPUS_ID && selectedSpaceType === COWORKING_SPACE_TYPE;
    const activeMap = TEUSAQUILLO_COWORKING_MAPS[activeMapIndex];

    const handleCloseModal = () => {
        setIsMapModalOpen(false);
    };

    const handlePrevMap = () => {
        setActiveMapIndex((currentIndex) =>
            currentIndex === 0 ? TEUSAQUILLO_COWORKING_MAPS.length - 1 : currentIndex - 1
        );
    };

    const handleNextMap = () => {
        setActiveMapIndex((currentIndex) =>
            currentIndex === TEUSAQUILLO_COWORKING_MAPS.length - 1 ? 0 : currentIndex + 1
        );
    };

    useEffect(() => {
        if (!showTeusaquilloMaps) {
            setIsMapModalOpen(false);
            setActiveMapIndex(0);
        }
    }, [showTeusaquilloMaps]);

    useEffect(() => {
        if (!isMapModalOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleCloseModal();
            }

            if (event.key === 'ArrowLeft') {
                handlePrevMap();
            }

            if (event.key === 'ArrowRight') {
                handleNextMap();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMapModalOpen]);

    return (
        <>
            <div className="mb-4 flex justify-end">
                <a
                    href={RESERVATION_GUIDE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-600 shadow-sm transition-colors hover:border-purple-200 hover:text-purple-700"
                    title="Abrir instructivo general de reservas"
                    aria-label="Abrir instructivo general de reservas"
                >
                    <Info className="h-4 w-4" />
                    <span>Ayuda</span>
                    <FileText className="h-4 w-4" />
                </a>
            </div>

            {showTeusaquilloMaps && (
                <section className="mb-6 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white px-4 py-4 shadow-sm sm:px-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold text-teal-800">
                                Planos de coworking en Campus Teusaquillo
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                                {'Consulta la ubicaci\u00f3n de las \u00e1reas por bloque y piso antes de elegir el coworking.'}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsMapModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-teal-700 shadow-sm transition-colors hover:border-teal-300 hover:bg-teal-50"
                        >
                            <Map className="h-4 w-4" />
                            Ver planos
                        </button>
                    </div>
                </section>
            )}

            {isMapModalOpen && showTeusaquilloMaps && activeMap && (
                <div
                    className="fixed inset-0 z-[60] bg-neutral-950/72 p-4 backdrop-blur-[3px] backdrop-brightness-75"
                    onClick={handleCloseModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="campus-support-modal-title"
                        className="mx-auto flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
                            <div>
                                <p className="text-sm font-semibold text-teal-700">Campus Teusaquillo</p>
                                <h4 id="campus-support-modal-title" className="text-xl font-bold text-neutral-900">
                                    {'Planos de las \u00e1reas de coworking'}
                                </h4>
                                <p className="mt-1 text-sm text-neutral-600">
                                    {'Revisa la distribuci\u00f3n por bloque y piso para ubicar mejor las zonas disponibles.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                                aria-label="Cerrar visor de planos"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 sm:px-6">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                                        Plano {activeMapIndex + 1} de {TEUSAQUILLO_COWORKING_MAPS.length}
                                    </p>
                                    <p className="mt-0.5 truncate text-sm font-semibold text-neutral-900">
                                        {activeMap.shortLabel}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 sm:min-w-[360px]">
                                    <button
                                        type="button"
                                        onClick={handlePrevMap}
                                        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                                        aria-label="Ver plano anterior"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    <label htmlFor="campus-map-selector" className="sr-only">
                                        Seleccionar bloque y piso
                                    </label>
                                    <select
                                        id="campus-map-selector"
                                        value={activeMapIndex}
                                        onChange={(event) => setActiveMapIndex(Number(event.target.value))}
                                        className="h-9 min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 shadow-sm outline-none transition-colors hover:border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                    >
                                        {TEUSAQUILLO_COWORKING_MAPS.map((map, index) => (
                                            <option key={map.id} value={index}>
                                                {map.shortLabel}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={handleNextMap}
                                        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                                        aria-label="Ver siguiente plano"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
                            <div className="relative flex min-h-[320px] items-center justify-center bg-white p-4 sm:p-6">
                                <img
                                    src={activeMap.imageUrl}
                                    alt={activeMap.alt}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(event) => {
                                        if (activeMap.fallbackImageUrl && event.currentTarget.src !== activeMap.fallbackImageUrl) {
                                            event.currentTarget.src = activeMap.fallbackImageUrl;
                                        }
                                    }}
                                    className="max-h-full w-full rounded-2xl object-contain shadow-2xl"
                                />

                                {TEUSAQUILLO_COWORKING_MAPS.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handlePrevMap}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-neutral-800 shadow-lg transition-colors hover:bg-white"
                                            aria-label="Ver plano anterior"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextMap}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-neutral-800 shadow-lg transition-colors hover:bg-white"
                                            aria-label="Ver siguiente plano"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </>
                                )}
                            </div>

                            <aside className="flex min-h-0 flex-col border-t border-neutral-200 bg-white lg:border-l lg:border-t-0">
                                <div className="border-b border-neutral-200 px-5 py-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                                        Plano {activeMapIndex + 1} de {TEUSAQUILLO_COWORKING_MAPS.length}
                                    </p>
                                    <h5 className="mt-1 text-lg font-bold text-neutral-900">{activeMap.title}</h5>
                                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{activeMap.summary}</p>
                                </div>

                                <div className="flex-1 overflow-y-auto px-5 py-4">
                                    <h6 className="text-sm font-semibold text-neutral-800">Referencias del plano</h6>
                                    {activeMap.details.length > 0 ? (
                                        <ul className="mt-3 space-y-3">
                                            {activeMap.details.map((detail) => (
                                                <li
                                                    key={`${activeMap.id}-${detail.label}`}
                                                    className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span
                                                            className="mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full"
                                                            style={{ backgroundColor: detail.color }}
                                                            aria-hidden="true"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-semibold text-neutral-900">{detail.label}</p>
                                                            {detail.meta && (
                                                                <p className="mt-1 text-sm text-neutral-600">{detail.meta}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-600">
                                            Consulta las referencias directamente en la imagen del plano.
                                        </p>
                                    )}
                                </div>

                                <div className="border-t border-neutral-200 px-5 py-4">
                                    <a
                                        href={activeMap.imageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-800"
                                    >
                                        {'Abrir imagen en otra pesta\u00f1a'}
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CampusSupportPanel;
