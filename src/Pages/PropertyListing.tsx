import { useMemo, useState, useEffect, type FC } from "react";
import { CircleLoader } from "react-spinners";
import Button from "../Components/Universal/Button";
import Pagination from "../Components/Universal/Pagination";
import PropertyHeader from "../Components/PropertyListing/PropertyHeader";
import Sort from "../Components/PropertyListing/Sort";
import { useNavigate } from "react-router-dom";
import size from "/src/assets/sqaure.png";
import location from "/src/assets/location.png";
import bed from "/src/assets/bed.png";
import bath from "/src/assets/bath.png";
import home from "/src/assets/houseline.png";
import listing from "/src/assets/listing.png";
import price from "/src/assets/price.png";
import clear from "/src/assets/clear.png";

// ---- BACKEND: imported getProperties from api service ----
import { getProperties } from "../services/api";

// ---- BACKEND REMOVED: useFetch hook no longer needed for properties ----
// import { useFetch } from '../Hooks/useFetch';

// ---- BACKEND ADDED: imported all 36 Nigeria states ----
import { allStates } from "../data/nigeriaStates";

// ---- BACKEND UPDATED: Property type now matches backend model ----
// ---- BACKEND REMOVED: old Property type with id, image, details fields ----
interface Property {
  _id: string;
  propertyName: string;
  images: string[];
  location: { fullAddress: string };
  propertyDetails: {
    size: number;
    bedrooms: number;
    bathroom: number;
  };
  price: number;
  discount: string;
  sale: string;
  propertyType: string;
}

interface Filter {
  location: { fullAddress: string };
  propertyType: string;
  details: { bedrooms: string };
  listing: string;
  minPrice: string;
  maxPrice: string;
}

interface PropertyProps {
  isLoggedIn: boolean;
  setShowModal: (show: boolean) => void;
}

const PropertyPage: FC<PropertyProps> = ({ isLoggedIn, setShowModal }) => {
  const navigate = useNavigate();

  // ---- BACKEND UPDATED: replaced useFetch with useEffect + getProperties ----
  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [applyFilter, setApplyFilter] = useState<Filter | null>();
  const [filter, setFilter] = useState<Filter>({
    location: { fullAddress: "" },
    propertyType: "",
    details: { bedrooms: "" },
    listing: "",
    minPrice: "",
    maxPrice: "",
  });
  const [sortBy, setSortBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, _setPostPerPage] = useState(12);

  // ---- BACKEND ADDED: fetch properties from real backend ----
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        // ---- BACKEND CALL: fetch all published properties ----
        // ---- BACKEND REMOVED: useFetch('/data/properties.json') ----
        const data = await getProperties();
        if (data.success) {
          setResults(data.properties);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredResults = useMemo(() => {
    if (!results) return [];
    if (!applyFilter) return results;

    return results
      .filter((filtered) => {
        const locationMatch = applyFilter.location.fullAddress
          ? filtered.location.fullAddress
              .toLowerCase()
              .includes(applyFilter.location.fullAddress.toLowerCase())
          : true;

        // ---- BACKEND UPDATED: propertyType instead of PropertyType ----
        const property = applyFilter.propertyType
          ? filtered.propertyType === applyFilter.propertyType
          : true;

        // ---- BACKEND UPDATED: propertyDetails.bedrooms instead of details.bedrooms ----
        const bedrooms = applyFilter.details.bedrooms
          ? filtered.propertyDetails.bedrooms === Number(applyFilter.details.bedrooms)
          : true;

        const sale = applyFilter.listing
          ? filtered.sale === applyFilter.listing
          : true;

        const priceNum = Number(filtered.price);
        const minPrice = applyFilter.minPrice
          ? priceNum >= Number(applyFilter.minPrice)
          : true;
        const maxPrice = applyFilter.maxPrice
          ? priceNum <= Number(applyFilter.maxPrice)
          : true;

        return locationMatch && property && bedrooms && sale && minPrice && maxPrice;
      })
      .sort((a, b) => {
        if (sortBy === "lowToHigh") return Number(a.price) - Number(b.price);
        if (sortBy === "highToLow") return Number(b.price) - Number(a.price);
        if (sortBy === "Discounted") {
          // ---- BACKEND UPDATED: discount is a string like "10%" ----
          return (
            Number(b.discount.replace(/[^0-9]/g, "")) -
            Number(a.discount.replace(/[^0-9]/g, ""))
          );
        }
        return 0;
      });
  }, [results, applyFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="flex justify-center font-bold h-screen items-center">
        <CircleLoader size={40} color={"green"} />
      </div>
    );
  }

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentProperty = filteredResults?.slice(firstPostIndex, lastPostIndex);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "location") {
      setFilter({ ...filter, location: { fullAddress: value } });
    } else if (name === "bedrooms") {
      setFilter({ ...filter, details: { ...filter.details, bedrooms: value } });
    } else {
      const inputFieldName = name as keyof Filter;
      setFilter({ ...filter, [inputFieldName]: value });
    }
  };

  const handleClear = () => {
    setFilter({
      location: { fullAddress: "" },
      propertyType: "",
      details: { bedrooms: "" },
      listing: "",
      minPrice: "",
      maxPrice: "",
    });
    setSortBy("");
    setApplyFilter(null);
  };

  return (
    <div>
      <div className="font-Manrope">
        <PropertyHeader />
      </div>

      <div className="flex flex-col items-center justify-center md:max-w-[1200px] w-full mx-auto container">
        <div className="flex flex-col relative z-10 items-center justify-center">

          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row shadow-2xl lg:h-[123px] lg:max-w-[1200px] lg:py-[27px] lg:px-[16px] gap-[21px] w-full mb-9 mt-9 items-center rounded-[10px] max-w-[399px] h-[463px] py-[12px] px-[19px] text-[#656565] selectdiv">

            {/* Location Filter */}
            <div className="w-[366px] lg:w-[183px] h-[69px] select">
              <label htmlFor="location" className="flex items-center gap-1">
                <img src={location} alt="" />
                Location
              </label>
              {/* ---- BACKEND UPDATED: now shows all 36 Nigeria states ---- */}
              {/* ---- BACKEND REMOVED: hardcoded 6 state options ---- */}
              <select
                name="location"
                id="location"
                value={filter.location.fullAddress}
                onChange={handleChange}
                className="w-full lg:w-[183px] h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px] select">
                <option value="">All States</option>
                {allStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-[13px] w-full items-center max-w-[366px] justify-center selectdiv">
              {/* Property Type Filter */}
              <div className="w-full h-[69px] select">
                <label htmlFor="propertyType" className="flex items-center gap-1">
                  <img src={home} alt="" />
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={filter.propertyType}
                  onChange={handleChange}
                  id="propertyType"
                  className="lg:w-[183px] w-[162px] h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px] select">
                  <option value="">Property type</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Residential">Residential</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>

              {/* Bedrooms Filter */}
              <div className="w-full lg:w-[183px] h-[69px] select">
                <label htmlFor="bedrooms" className="flex items-center gap-1">
                  <img src={bed} alt="" />
                  No of Bedrooms
                </label>
                {/* ---- BACKEND UPDATED: now shows 1-50 bedroom options ---- */}
                {/* ---- BACKEND REMOVED: hardcoded 1-4 options ---- */}
                <select
                  name="bedrooms"
                  value={filter.details.bedrooms}
                  onChange={handleChange}
                  className="lg:w-[183px] w-[162px] h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px] select">
                  <option value="">Bedrooms</option>
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={String(num)}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Listing Status Filter */}
            <div className="w-full lg:w-[183px] h-[69px] select">
              <label htmlFor="listing" className="flex items-center gap-1">
                <img src={listing} alt="" />
                Status list
              </label>
              <select
                name="listing"
                onChange={handleChange}
                value={filter.listing}
                className="w-[366px] lg:w-[183px] h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px] select">
                <option value="">Status</option>
                <option value="For Rent">For Rent</option>
                <option value="For Sale">For Sale</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="w-full lg:w-[183px] h-[69px] items-center">
              <label htmlFor="price" className="flex items-center gap-1">
                <img src={price} alt="" />
                Price
              </label>
              <div className="flex gap-[6px]">
                <input
                  type="number"
                  placeholder="min"
                  className="w-full lg:w-[96px] h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px]"
                  name="minPrice"
                  min="1000000"
                  step="1000000"
                  max="8000000"
                  onChange={handleChange}
                  value={filter.minPrice}
                />
                <input
                  type="number"
                  placeholder="max"
                  className="w-full lg:w-[96px] h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px]"
                  name="maxPrice"
                  min="1000000"
                  step="1000000"
                  max="8000000"
                  onChange={handleChange}
                  value={filter.maxPrice}
                />
              </div>
            </div>

            <button
              onClick={() => setApplyFilter(filter)}
              className="w-full lg:w-[95px] h-[49px] bg-[#1A3C34] rounded-[10px] py-[12px] px-[24px] mt-2 text-white">
              Apply
            </button>
          </div>

          <div className="w-full px-6">
            <Sort
              allPosts={results?.length}
              filteredPosts={filteredResults?.length}
              setSortBy={setSortBy}
              sortBy={sortBy}
              setApplyFilter={setApplyFilter}
              filter={filter}
            />
          </div>

          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-[55px] gap-x-[20px] w-full middle px-6">
              {currentProperty.map((result) => (
                <div
                  key={result._id}
                  className="w-full max-w-[387px] min-h-[549px] shadow-2xl text-start flex flex-col items-center justify-center rounded-bl-[20px] rounded-br-[20px] relative mx-auto container">

                  {/* ---- BACKEND UPDATED: images array, use images[0] ---- */}
                  {/* ---- BACKEND REMOVED: result.image single string ---- */}
                  <img
                    className="h-[322px] w-full object-cover"
                    src={result.images[0] || "/src/assets/housing.jpg"}
                    alt={result.propertyName}
                  />

                  <div className="h-[227px] p-5 flex flex-col gap-[19px]">
                    <h3 className="text-[#0A1916] font-bold text-[20px]">
                      {result.propertyName}
                    </h3>
                    <div className="flex items-center gap-1">
                      <img className="h-4 w-3" src={location} alt="" />
                      <p>{result.location.fullAddress}</p>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <div className="flex items-center gap-1">
                        <img className="h-4 w-4" src={size} alt="" />
                        {/* ---- BACKEND UPDATED: propertyDetails.size ---- */}
                        <p>{result.propertyDetails.size} sqm</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <img className="h-4 w-4" src={bed} alt="" />
                        {/* ---- BACKEND UPDATED: propertyDetails.bedrooms ---- */}
                        <p>{result.propertyDetails.bedrooms} <span>Beds</span></p>
                      </div>
                      <div className="flex items-center gap-1">
                        <img className="h-4 w-4" src={bath} alt="" />
                        {/* ---- BACKEND UPDATED: propertyDetails.bathroom ---- */}
                        <p>{result.propertyDetails.bathroom} Baths</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[53px]">
                      {/* ---- BACKEND UPDATED: _id instead of id ---- */}
                      <Button
                        onClick={() => isLoggedIn ? navigate(`/property/${result._id}`) : setShowModal(true)}
                      />
                      <p className="text-[25px]">
                        <span>₦</span>{result.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* ---- BACKEND UPDATED: discount is now a string ---- */}
                  {result.discount && (
                    <div className={`absolute w-[112px] h-[49px] px-[24px] py-[12px] rounded-[10px] text-white top-2 right-2
                      ${Number(result.discount.replace(/[^0-9]/g, "")) <= 20 ? "bg-green-500" :
                        Number(result.discount.replace(/[^0-9]/g, "")) <= 30 ? "bg-[#F4A261]" : "bg-red-500"}`}>
                      {result.discount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 h-[803.69px]">
              <div className="flex flex-col items-center justify-center gap-[82px]">
                <img className="w-[714px] h-[578.69px]" src={clear} alt="" />
                <div className="flex items-center flex-col">
                  <div className="flex items-center gap-1">
                    <img src="/src/assets/error.svg" alt="" />
                    <p className="text-[#FF0000]">
                      We couldn't find any properties matching your search criteria
                    </p>
                  </div>
                  <p>Try other filters</p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="w-[146px] h-[49px] rounded-[10px] py-[12px] px-[24px] bg-[#1A3C34] text-white">
                Clear Filters
              </button>
            </div>
          )}

          <div className="w-full">
            <Pagination
              totalPosts={filteredResults.length}
              postPerPage={postPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;