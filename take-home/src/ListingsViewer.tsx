import { useState, useEffect } from 'react';
import { listingsService } from './middleware/middleware';

const ListingsViewer = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<'color' | 'language'>('color');
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [propertyValues, setPropertyValues] = useState<string[]>([]);
    const [nullCount, setNullCount] = useState<number>(0);

    useEffect(() => {
        const fetchInitialData = async () => {
            const countriesData = await listingsService.getCountries();
            setCountries(countriesData);

            const values = await listingsService.getPropertyValues(selectedProperty);
            setPropertyValues(values);
        };

        fetchInitialData();
    }, [selectedProperty]);

    const handleSearch = async () => {
        if (!selectedValue) return;

        const result = await listingsService.getListingsByProperty(selectedProperty, selectedValue);
        setListings(result.data);
        setNullCount(result.nullCount);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-red-500 mb-6">Listings Viewer</h1>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value as 'color' | 'language')}
                    className="bg-black text-white border border-red-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="color">Color</option>
                    <option value="language">Language</option>
                </select>

                <select
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    className="bg-black text-white border border-red-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="">Select a {selectedProperty}</option>
                    {propertyValues.map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>

                <button
                    onClick={handleSearch}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                    Search
                </button>
            </div>

            {nullCount > 0 && (
                <div className="mb-6 p-4 bg-black border border-red-500 text-red-300 rounded-md">
                    {nullCount} listings have null values for {selectedProperty}
                </div>
            )}

            <h2 className="text-2xl font-semibold text-red-500 mb-4">Listings by Country</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {countries.map(country => (
                    <div key={country} className="bg-black border border-red-500 rounded-lg p-4 shadow-lg">
                        <h3 className="text-xl font-medium text-red-500 mb-3">{country}</h3>
                        <ul className="space-y-3">
                            {listings
                                .filter(listing => listing.country === country)
                                .map(listing => (
                                    <li key={listing.id} className="border-b border-red-500 pb-3 last:border-b-0">
                                        <div className="font-semibold text-white">{listing.first_name} {listing.last_name}</div>
                                        <div className="text-gray-200">Email: {listing.email}</div>
                                        <div className="text-gray-200">Language: {listing.language || 'Not specified'}</div>
                                        <div className="text-gray-200">Color: {listing.color || 'Not specified'}</div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListingsViewer;