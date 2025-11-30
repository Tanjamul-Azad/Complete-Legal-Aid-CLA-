import React, { useState, useEffect } from 'react';
import type { User } from '../../../types';
import { lawyerService, type LegalSpecialization } from '../../../services/lawyerService';
import { SearchIcon, BriefcaseIcon, MapPinIcon, SpinnerIcon } from '../../icons';
import { LawyerProfileCard } from '../../lawyers/LawyerProfileCard';
import { LawyerProfileModal } from '../../lawyers/LawyerProfileModal';

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center py-20 bg-cla-surface dark:bg-cla-surface-dark rounded-lg border-2 border-dashed border-cla-border dark:border-cla-border-dark col-span-1 md:col-span-2 xl:col-span-3">
        <SearchIcon className="w-16 h-16 mx-auto text-cla-text-muted dark:text-cla-text-muted-dark opacity-50" />
        <h3 className="mt-4 text-xl font-semibold text-cla-text dark:text-cla-text-dark">Couldn’t find a match.</h3>
        <p className="mt-1 text-cla-text-muted dark:text-cla-text-muted-dark">Try removing some filters to see more results.</p>
        <button onClick={onReset} className="mt-6 px-5 py-2.5 bg-cla-gold text-cla-text font-bold rounded-lg hover:bg-cla-gold-darker transition-colors">
            Reset Filters
        </button>
    </div>
);

export const CitizenFindLawyers: React.FC = () => {
    const [selectedLawyer, setSelectedLawyer] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);
    const [lawyers, setLawyers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [baseLawyers, setBaseLawyers] = useState<User[]>([]);
    const [specializations, setSpecializations] = useState<LegalSpecialization[]>([]);
    const [locationOptions, setLocationOptions] = useState<string[]>([]);
    const [hasBootstrapped, setHasBootstrapped] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const bootstrap = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const [specList, initialLawyers] = await Promise.all([
                    lawyerService.getLegalSpecializations(),
                    lawyerService.getAllLawyers(),
                ]);
                if (!isMounted) return;
                setSpecializations(specList);
                setLawyers(initialLawyers);
                setBaseLawyers(initialLawyers);
                const locationPool = initialLawyers
                    .map(l => l.location)
                    .filter((loc): loc is string => Boolean(loc));
                setLocationOptions([...new Set(locationPool)].sort());
            } catch (error) {
                if (isMounted) {
                    console.error('Failed to bootstrap lawyer directory:', error);
                    setLoadError('Unable to load lawyers right now. Please try again later.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                    setHasBootstrapped(true);
                }
            }
        };
        bootstrap();
        return () => {
            isMounted = false;
        };
    }, []);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if (!hasBootstrapped) {
            return;
        }

        if (!debouncedSearchTerm && !specializationFilter && !locationFilter) {
            setLawyers(baseLawyers);
            setIsFiltering(false);
            setLoadError(null);
            return;
        }

        let cancelled = false;
        setIsFiltering(true);
        setLoadError(null);

        const fetchFiltered = async () => {
            try {
                const filtered = await lawyerService.getAllLawyers({
                    specialization: specializationFilter || undefined,
                    location: locationFilter || undefined,
                    q: debouncedSearchTerm || undefined,
                });
                if (!cancelled) {
                    setLawyers(filtered);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Failed to filter lawyers:', error);
                    setLoadError('Unable to apply filters at the moment. Please retry.');
                }
            } finally {
                if (!cancelled) {
                    setIsFiltering(false);
                }
            }
        };

        fetchFiltered();

        return () => {
            cancelled = true;
        };
    }, [debouncedSearchTerm, specializationFilter, locationFilter, hasBootstrapped, baseLawyers]);


    const clearFilters = () => {
        setSearchTerm('');
        setSpecializationFilter('');
        setLocationFilter('');
        setLoadError(null);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="animate-fade-in-up">
                <h1 className="text-3xl font-bold text-cla-text dark:text-white mb-2">Find Your Legal Expert</h1>
                <p className="text-md text-cla-text-muted dark:text-[#CFCFCF]">Search our network of verified lawyers in Bangladesh.</p>
            </div>

            <div className="bg-cla-surface dark:bg-[#111111] p-5 rounded-xl shadow-sm dark:border border-white/5 sticky top-[72px] z-20 animate-fade-in-up transition-all duration-300" style={{ animationDelay: '100ms' }}>
                {/* Responsive Grid for Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label htmlFor="search" className="flex items-center gap-2 text-sm font-medium text-cla-text dark:text-white mb-1.5">
                            <SearchIcon className="h-[18px] w-[18px] text-cla-gold" />
                            Search by name
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full p-2.5 border rounded-xl bg-[#F7F7F7] dark:bg-white/5 border-[#E5E5E5] dark:border-white/10 text-cla-text dark:text-white placeholder:text-[#A0A0A0] dark:placeholder:text-white/40 focus:ring-2 focus:ring-cla-gold focus:border-transparent transition-all"
                            placeholder="e.g., Anisul Huq"
                        />
                    </div>
                    <div>
                        <label htmlFor="specialization" className="flex items-center gap-2 text-sm font-medium text-cla-text dark:text-white mb-1.5">
                            <BriefcaseIcon className="h-5 w-5 text-cla-gold" />
                            Specialization
                        </label>
                        <select id="specialization" value={specializationFilter} onChange={e => setSpecializationFilter(e.target.value)} className="block w-full p-2.5 border rounded-xl bg-white dark:bg-[#111111] border-[#E5E5E5] dark:border-white/10 text-cla-text dark:text-white focus:ring-2 focus:ring-cla-gold focus:border-transparent transition-all appearance-none bg-no-repeat bg-right pr-8" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23F59E0B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.7rem center' }}>
                            <option value="">All Specializations</option>
                            {specializations.map(s => (
                                <option key={s.slug} value={s.slug}>{s.name_en}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="location" className="flex items-center gap-2 text-sm font-medium text-cla-text dark:text-white mb-1.5">
                            <MapPinIcon className="h-5 w-5 text-cla-gold" />
                            Location
                        </label>
                        <select id="location" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="block w-full p-2.5 border rounded-xl bg-white dark:bg-[#111111] border-[#E5E5E5] dark:border-white/10 text-cla-text dark:text-white focus:ring-2 focus:ring-cla-gold focus:border-transparent transition-all appearance-none bg-no-repeat bg-right pr-8" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23F59E0B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.7rem center' }}>
                            <option value="">All Locations</option>
                            {locationOptions.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {loadError && (
                <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-200 px-4 py-3">
                    {loadError}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <SpinnerIcon className="w-10 h-10 text-cla-gold animate-spin" />
                    </div>
                ) : isFiltering ? (
                    <div className="col-span-full flex justify-center py-20">
                        <SpinnerIcon className="w-10 h-10 text-cla-gold animate-spin" />
                    </div>
                ) : lawyers.length > 0 ? (
                    lawyers.map((lawyer, index) =>
                        <LawyerProfileCard
                            key={lawyer.id}
                            user={lawyer}
                            onSelect={() => setSelectedLawyer(lawyer)}
                            animationDelay={`${100 + index * 60}ms`}
                        />
                    )
                ) : (
                    <EmptyState onReset={clearFilters} />
                )}
            </div>

            {selectedLawyer && <LawyerProfileModal lawyer={selectedLawyer} onClose={() => setSelectedLawyer(null)} />}
        </div>
    );
};