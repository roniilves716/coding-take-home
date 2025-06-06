// middleware.ts
import data from '../mock-data/MOCK_DATA.json';

// 1. Define TypeScript interfaces for our data model
export interface Listing {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  language: string | null;
  color: string | null;
}

export interface ListingsByCountry {
  [country: string]: Listing[];
}

export interface ListingsResponse {
  data: Listing[];
  count: number;
  nullCount: number;
}

// 2. Mock data fetch function
const fetchMockData = async (): Promise<Listing[]> => {
  try {
    // Directly use the imported JSON data
    return data as Listing[];
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw new Error('Failed to fetch listings');
  }
};

// 3. Main API service object
export const listingsService = {
  /**
   * Get all listings with optional filtering
   */
  async getAllListings(): Promise<Listing[]> {
    return await fetchMockData();
  },

  /**
   * Get listings filtered by a specific property value
   * @param property - 'color' or 'language'
   * @param value - The value to filter by
   */
  async getListingsByProperty(
    property: 'color' | 'language',
    value: string
  ): Promise<ListingsResponse> {
    const allListings = await fetchMockData();
    const filtered = allListings.filter(listing => listing[property] === value);
    const nullCount = allListings.filter(listing => listing[property] === null).length;

    return {
      data: filtered,
      count: filtered.length,
      nullCount
    };
  },

  /**
   * Get all unique countries in the dataset
   */
  async getCountries(): Promise<string[]> {
    const allListings = await fetchMockData();
    const countries = new Set(allListings.map(listing => listing.country));
    return Array.from(countries).sort();
  },

  /**
   * Get listings grouped by country
   */
  async getListingsByCountry(): Promise<ListingsByCountry> {
    const allListings = await fetchMockData();
    const grouped: ListingsByCountry = {};

    allListings.forEach(listing => {
      if (!grouped[listing.country]) {
        grouped[listing.country] = [];
      }
      grouped[listing.country].push(listing);
    });

    return grouped;
  },

  /**
   * Get listings with null values for a specific property
   * @param property - 'color' or 'language'
   */
  async getListingsWithNullProperty(
    property: 'color' | 'language'
  ): Promise<Listing[]> {
    const allListings = await fetchMockData();
    return allListings.filter(listing => listing[property] === null);
  },

  /**
   * Get all available values for a property
   * @param property - 'color' or 'language'
   */
  async getPropertyValues(property: 'color' | 'language'): Promise<string[]> {
    const allListings = await fetchMockData();
    const values = new Set(
      allListings
        .map(listing => listing[property])
        .filter((value): value is string => value !== null)
    );
    return Array.from(values).sort();
  }
};