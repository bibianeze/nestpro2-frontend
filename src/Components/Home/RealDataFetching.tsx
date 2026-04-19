import size from "/src/assets/sqaure.png"
import location from "/src/assets/location.png"
import bed from "/src/assets/bed.png"
import bath from "/src/assets/bath.png"
import { useEffect, useState, type FC } from 'react';
import { RingLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import Button from '../Universal/Button';

// ---- BACKEND: imported getProperties from api service ----
import { getProperties } from '../../services/api';

// ---- BACKEND UPDATED: type now matches backend Property model ----
// ---- BACKEND REMOVED: old type with id, image, details fields ----
type Property = {
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
  isFeatured: boolean;
};

interface RealDataFetchingProps {
  isLoggedIn: boolean;
  setShowModal: (show: boolean) => void;
}

const RealDataFetching: FC<RealDataFetchingProps> = ({ isLoggedIn, setShowModal }) => {
  const navigate = useNavigate();

  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);

        // ---- BACKEND CALL: fetch properties from real backend ----
        // ---- BACKEND REMOVED: fetch('/data/properties.json') ----
        const data = await getProperties();

        if (data.success) {
          setResults(data.properties);
        } else {
          setError("Failed to load properties");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <RingLoader color='#1A3C34' size={100} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center py-20'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#E4F0ED] px-8 flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-[18px] py-[73px]">
        <h1 className="font-Manrope font-[700] text-[20px] md:text-[42px] text-center text-[#131817]">
          Discover Our Featured Properties
        </h1>
        <p className="font-Inter w-full font-[400] text-[14px] md:text-[18px] leading-[30px] text-center text-[#535353] w-[23rem] md:w-[40rem]">
          Dive into our exquisite collection of our featured properties at Nest Finder Pro,
          every corner whispers comfort and every detail is crafted with perfection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-[41px] md:gap-y-[47px] lg:gap-y-[55px] gap-x-[20px] w-full lg:max-w-[1201px] md:mr-4 lg:mr-0 lg:ml-0 items-center justify-center">
        {results?.slice(0, 6).map((result) => (
          <div key={result._id} className="w-full max-w-[387px] min-h-[549px] flex flex-col shadow-2xl text-start mx-auto rounded-bl-[20px] rounded-br-[20px] relative">

            {/* ---- BACKEND UPDATED: images is now an array, use images[0] ---- */}
            <img
              className="h-[322px] w-full max-w-[365px] md:max-w-[387px] rounded-tl-[10px] rounded-tr-[10px]"
              src={result.images[0] || "/src/assets/housing.jpg"}
              alt={result.propertyName}
            />

            <div className="h-[227px] p-5 flex flex-col gap-[19px] bg-[#FFFFFF] rounded-bl-[20px] rounded-br-[20px]">
              <h3 className="text-[#0A1916] font-bold md:text-[20px] text-[16px]">
                {result.propertyName}
              </h3>
              <div className="flex items-center gap-1">
                <img className="h-4 w-3" src={location} alt="" />
                <p className="md:text-[16px] text-[14px]">{result.location.fullAddress}</p>
              </div>
              <div className="flex items-center gap-[10px] md:text-[16px] text-[12px]">
                <div className="flex items-center gap-1">
                  <img className="h-4 w-4" src={size} alt="" />
                  {/* ---- BACKEND UPDATED: propertyDetails.size instead of details.size ---- */}
                  <p>{result.propertyDetails.size} sqm</p>
                </div>
                <div className="flex items-center gap-1">
                  <img className="h-4 w-4" src={bed} alt="" />
                  {/* ---- BACKEND UPDATED: propertyDetails.bedrooms instead of details.bedrooms ---- */}
                  <p>{result.propertyDetails.bedrooms} <span>Beds</span></p>
                </div>
                <div className="flex items-center gap-1">
                  <img className="h-4 w-4" src={bath} alt="" />
                  {/* ---- BACKEND UPDATED: propertyDetails.bathroom instead of details.bathrooms ---- */}
                  <p>{result.propertyDetails.bathroom} Baths</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {/* ---- BACKEND UPDATED: _id instead of id ---- */}
                <Button onClick={() => isLoggedIn ? navigate(`/property/${result._id}`) : setShowModal(true)} />
                <p className="md:text-[25px] text-[17px]">
                  <span>₦</span>{result.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* ---- BACKEND UPDATED: discount is now a string field ---- */}
            {result.discount && (
              <div className="absolute w-[112px] h-[49px] px-[24px] py-[12px] rounded-[10px] bg-[#F4A261] text-white top-2 right-2">
                {result.discount}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-start justify-start lg:justify-center lg:items-center bg-[#1A3C34] py-[12px] px-[24px] my-[70px] w-[201px] rounded-[10px] font-Manrope font-[400] text-[#FFFFFF] text-[18px]">
        <button onClick={() => isLoggedIn ? navigate("/property") : setShowModal(true)}>
          View All Properties
        </button>
      </div>
    </div>
  );
};

export default RealDataFetching;