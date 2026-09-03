import Location from '../models/Location.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

// Default initial dataset for auto-seeding or fallback
export const DEFAULT_LOCATIONS_DATA = [
  {
    stateName: 'Chhattisgarh',
    stateCode: 'CG',
    country: 'India',
    cities: [
      'Raipur', 'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur',
      'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi',
      'Janjgir-Champa', 'Jashpur', 'Kabirdham (Kawardha)', 'Kanker',
      'Khairagarh-Chhuikhadan-Gandai', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund',
      'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki', 'Mungeli',
      'Narayanpur', 'Raigarh', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja', 'Sarangarh-Bilaigarh'
    ].map(name => ({ cityName: name }))
  },
  {
    stateName: 'Delhi',
    stateCode: 'DL',
    country: 'India',
    cities: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'West Delhi'].map(name => ({ cityName: name }))
  },
  {
    stateName: 'Maharashtra',
    stateCode: 'MH',
    country: 'India',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Amravati'].map(name => ({ cityName: name }))
  },
  {
    stateName: 'Uttar Pradesh',
    stateCode: 'UP',
    country: 'India',
    cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Noida', 'Ghaziabad', 'Prayagraj', 'Gorakhpur'].map(name => ({ cityName: name }))
  },
  {
    stateName: 'Madhya Pradesh',
    stateCode: 'MP',
    country: 'India',
    cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Satna'].map(name => ({ cityName: name }))
  }
];

// Internal helper to auto seed default data if collection is empty
async function ensureLocationsSeeded() {
  const count = await Location.countDocuments();
  if (count === 0) {
    for (const item of DEFAULT_LOCATIONS_DATA) {
      await Location.create(item);
    }
  }
}

/**
 * Public Route: GET /api/v1/locations & GET /api/v1/locations/public
 * Get all active states with active nested cities and districts list
 */
export const getPublicLocations = asyncHandler(async (req, res) => {
  await ensureLocationsSeeded();

  const { state, search } = req.query;
  let query = { isActive: true };

  if (state) {
    query.$or = [
      { stateName: { $regex: state, $options: 'i' } },
      { stateCode: { $regex: state, $options: 'i' } }
    ];
  }

  const locations = await Location.find(query)
    .select('stateName stateCode country cities isActive')
    .sort({ stateName: 1 });

  const formattedLocations = locations.map(loc => {
    let citiesFiltered = (loc.cities || []).filter(c => c.isActive !== false);

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      citiesFiltered = citiesFiltered.filter(c => searchRegex.test(c.cityName));
    }

    const cityList = citiesFiltered.map(c => ({
      _id: c._id,
      cityName: c.cityName,
      districtName: c.cityName, // District alias
      cityCode: c.cityCode || ''
    }));

    return {
      _id: loc._id,
      stateName: loc.stateName,
      stateCode: loc.stateCode,
      country: loc.country,
      cities: cityList,
      districts: cityList // District array alias
    };
  });

  return ApiResponse.success(res, 'Public states, cities and districts list retrieved', formattedLocations);
});

/**
 * Public Route: GET /api/v1/locations/states
 * Get list of active state names and metadata
 */
export const getStates = asyncHandler(async (req, res) => {
  await ensureLocationsSeeded();

  const locations = await Location.find({ isActive: true })
    .select('stateName stateCode country cities isActive')
    .sort({ stateName: 1 });

  const statesList = locations.map(loc => ({
    _id: loc._id,
    stateName: loc.stateName,
    stateCode: loc.stateCode,
    country: loc.country,
    totalCities: (loc.cities || []).length
  }));

  return ApiResponse.success(res, 'States list retrieved successfully', statesList);
});

/**
 * Public Route: GET /api/v1/locations/cities & GET /api/v1/locations/districts
 * Get flattened or state-filtered list of active cities/districts
 */
export const getCitiesOrDistricts = asyncHandler(async (req, res) => {
  await ensureLocationsSeeded();

  const { state, stateCode, stateId, search } = req.query;
  let query = { isActive: true };

  if (stateId && mongoose.Types.ObjectId.isValid(stateId)) {
    query._id = stateId;
  } else if (state || stateCode) {
    const targetState = state || stateCode;
    query.$or = [
      { stateName: { $regex: targetState, $options: 'i' } },
      { stateCode: { $regex: targetState, $options: 'i' } }
    ];
  }

  const locations = await Location.find(query).sort({ stateName: 1 });

  let allCities = [];
  locations.forEach(loc => {
    (loc.cities || [])
      .filter(c => c.isActive !== false)
      .forEach(c => {
        if (!search || new RegExp(search, 'i').test(c.cityName)) {
          allCities.push({
            _id: c._id,
            cityName: c.cityName,
            districtName: c.cityName, // District alias
            cityCode: c.cityCode || '',
            stateId: loc._id,
            stateName: loc.stateName,
            stateCode: loc.stateCode
          });
        }
      });
  });

  return ApiResponse.success(res, 'Cities and districts list retrieved successfully', allCities);
});

/**
 * Public Route: GET /api/v1/locations/chhattisgarh
 * Fast dedicated route for Chhattisgarh state and all 33 districts
 */
export const getChhattisgarhLocations = asyncHandler(async (req, res) => {
  await ensureLocationsSeeded();

  let cgLocation = await Location.findOne({
    $or: [{ stateName: /^Chhattisgarh$/i }, { stateCode: /^CG$/i }]
  });

  if (!cgLocation) {
    const defaultCg = DEFAULT_LOCATIONS_DATA.find(d => d.stateCode === 'CG');
    cgLocation = await Location.create(defaultCg);
  }

  const districts = (cgLocation.cities || [])
    .filter(c => c.isActive !== false)
    .map(c => ({
      _id: c._id,
      cityName: c.cityName,
      districtName: c.cityName,
      cityCode: c.cityCode || ''
    }));

  return ApiResponse.success(res, 'Chhattisgarh state and districts retrieved successfully', {
    _id: cgLocation._id,
    stateName: cgLocation.stateName,
    stateCode: cgLocation.stateCode,
    country: cgLocation.country,
    districts,
    cities: districts
  });
});

/**
 * Public Route: GET /api/v1/locations/:idOrName
 * Get single state location by ObjectId, stateName, or stateCode
 */
export const getLocationByIdOrName = asyncHandler(async (req, res) => {
  await ensureLocationsSeeded();
  const { idOrName } = req.params;

  let location;
  if (mongoose.Types.ObjectId.isValid(idOrName)) {
    location = await Location.findById(idOrName);
  }

  if (!location) {
    location = await Location.findOne({
      $or: [
        { stateName: { $regex: `^${idOrName}$`, $options: 'i' } },
        { stateCode: { $regex: `^${idOrName}$`, $options: 'i' } }
      ]
    });
  }

  if (!location) {
    return ApiResponse.error(res, `Location '${idOrName}' not found`, 404);
  }

  const cityList = (location.cities || [])
    .filter(c => c.isActive !== false)
    .map(c => ({
      _id: c._id,
      cityName: c.cityName,
      districtName: c.cityName,
      cityCode: c.cityCode || ''
    }));

  return ApiResponse.success(res, 'Location retrieved successfully', {
    _id: location._id,
    stateName: location.stateName,
    stateCode: location.stateCode,
    country: location.country,
    cities: cityList,
    districts: cityList,
    isActive: location.isActive
  });
});

/**
 * Admin Route: GET /api/v1/locations/admin
 * Get all states with nested cities list for Admin Dashboard management
 */
export const getAllLocationsAdmin = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query.$or = [
      { stateName: { $regex: search, $options: 'i' } },
      { 'cities.cityName': { $regex: search, $options: 'i' } }
    ];
  }

  const locations = await Location.find(query).sort({ stateName: 1 });
  return ApiResponse.success(res, 'Admin states and nested cities list retrieved', locations);
});

/**
 * Admin Route: POST /api/v1/locations
 * Create a new State with an optional nested array of Cities/Districts
 */
export const createState = asyncHandler(async (req, res) => {
  const { stateName, stateCode, country, cities, isActive } = req.body;

  if (!stateName || !stateName.trim()) {
    return ApiResponse.error(res, 'State name is required', 400);
  }

  const existingState = await Location.findOne({
    stateName: { $regex: `^${stateName.trim()}$`, $options: 'i' }
  });

  if (existingState) {
    return ApiResponse.error(res, `State '${stateName}' already exists`, 400);
  }

  const normalizedCities = Array.isArray(cities)
    ? cities.map(c => typeof c === 'string' ? { cityName: c } : c)
    : [];

  const newLocation = await Location.create({
    stateName: stateName.trim(),
    stateCode: stateCode || '',
    country: country || 'India',
    cities: normalizedCities,
    isActive: isActive !== undefined ? isActive : true
  });

  return ApiResponse.success(res, 'State created successfully with nested cities', newLocation, 201);
});

/**
 * Admin Route: PUT /api/v1/locations/:id
 * Update State metadata or replace nested cities array
 */
export const updateState = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stateName, stateCode, country, cities, isActive } = req.body;

  const location = await Location.findById(id);
  if (!location) {
    return ApiResponse.error(res, 'State location not found', 404);
  }

  if (stateName) location.stateName = stateName.trim();
  if (stateCode !== undefined) location.stateCode = stateCode;
  if (country !== undefined) location.country = country;
  if (isActive !== undefined) location.isActive = isActive;

  if (Array.isArray(cities)) {
    location.cities = cities.map(c => typeof c === 'string' ? { cityName: c } : c);
  }

  await location.save();
  return ApiResponse.success(res, 'State location updated successfully', location);
});

/**
 * Admin Route: DELETE /api/v1/locations/:id
 * Delete a State and its nested cities
 */
export const deleteState = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Location.findByIdAndDelete(id);

  if (!deleted) {
    return ApiResponse.error(res, 'State location not found', 404);
  }

  return ApiResponse.success(res, 'State location deleted successfully', { id });
});

/**
 * Admin Route: POST /api/v1/locations/:id/cities
 * Add a new City/District into a State's nested cities array
 */
export const addCityToState = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cityName, cityCode, isActive } = req.body;

  if (!cityName || !cityName.trim()) {
    return ApiResponse.error(res, 'City/District name is required', 400);
  }

  const location = await Location.findById(id);
  if (!location) {
    return ApiResponse.error(res, 'State location not found', 404);
  }

  const cityExists = location.cities.some(
    c => c.cityName.toLowerCase() === cityName.trim().toLowerCase()
  );

  if (cityExists) {
    return ApiResponse.error(res, `City '${cityName}' already exists in ${location.stateName}`, 400);
  }

  location.cities.push({
    cityName: cityName.trim(),
    cityCode: cityCode || '',
    isActive: isActive !== undefined ? isActive : true
  });

  await location.save();
  return ApiResponse.success(res, `City '${cityName}' added to ${location.stateName} successfully`, location);
});

/**
 * Admin Route: DELETE /api/v1/locations/:id/cities/:cityId
 * Remove a City/District from a State's nested cities array
 */
export const deleteCityFromState = asyncHandler(async (req, res) => {
  const { id, cityId } = req.params;

  const location = await Location.findById(id);
  if (!location) {
    return ApiResponse.error(res, 'State location not found', 404);
  }

  location.cities = location.cities.filter(c => c._id.toString() !== cityId);
  await location.save();

  return ApiResponse.success(res, 'City removed from state successfully', location);
});

/**
 * Seed Initial Default States & Cities (Chhattisgarh, Delhi, Maharashtra, etc.)
 */
export const seedDefaultLocations = asyncHandler(async (req, res) => {
  let seededCount = 0;
  for (const item of DEFAULT_LOCATIONS_DATA) {
    const existing = await Location.findOne({ stateName: item.stateName });
    if (!existing) {
      await Location.create(item);
      seededCount++;
    }
  }

  const allLocations = await Location.find().sort({ stateName: 1 });
  return ApiResponse.success(res, `Seeded ${seededCount} new states with nested cities successfully`, allLocations);
});

