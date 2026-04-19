import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Images from '../Components/PropertiesDetails/Images';
import HousePacks from '../Components/PropertiesDetails/HousePacks';
import PropertiesDetail from '../Components/PropertiesDetails/PropertiesDetail';
import MapView from '../Components/PropertiesDetails/MapView';
import CardComponent from '../Components/PropertiesDetails/CardComponent';
import AgentForm from '../Components/PropertiesDetails/AgentForm';
import { CircleLoader } from 'react-spinners';
import Button from '../Components/Universal/Button';
import size from "/src/assets/sqaure.png"
import location from "/src/assets/location.png"
import bed from "/src/assets/bed.png"
import bath from "/src/assets/bath.png"

// ---- BACKEND: imported getPropertyById and getProperties from api service ----
import { getPropertyById, getProperties } from '../services/api';

// ---- BACKEND REMOVED: useFetch hook no longer needed ----
// import { useFetch } from '../Hooks/useFetch';

// ---- BACKEND UPDATED: Property type now matches backend model ----
// ---- BACKEND REMOVED: old Property type with id, image, details fields ----
interface Property {
  _id: string;
  propertyName: string;
  images: string[];
  location: {
    fullAddress: string;
    coordinates?: { lat: number; lng: number };
  };
  propertyDetails: {
    size: number;
    bedrooms: number;
    bathroom: number;
  };
  price: number;
  discount: string;
  agentName: string;
  agentPhone: string;
  amenities: string[];
  propertyDescription: string;
}

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // ---- BACKEND CALL: fetch single property by id ----
        // ---- BACKEND REMOVED: useFetch('/data/properties.json') + .find() ----
        const [propertyData, allData] = await Promise.all([
          getPropertyById(id!),
          getProperties(),
        ]);

        if (propertyData.success) {
          setProperty(propertyData.property);
        }

        if (allData.success) {
          setAllProperties(allData.properties);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className='flex justify-center font-bold h-screen items-center'>
        <CircleLoader size={40} color={'green'} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className='flex justify-center font-bold h-screen items-center text-4xl'>
        Property not found
      </div>
    );
  }

  return (
    <div className="md:w-[1200px] mx-auto container p-5 space-y-14">

      {/* ---- BACKEND UPDATED: pass full images array to Images component ---- */}
      {/* ---- BACKEND REMOVED: mainImage single string ---- */}
      <Images images={property.images} />

      <HousePacks
        name={property.propertyName}
        location={property.location}
        price={property.price}
        // ---- BACKEND UPDATED: propertyDetails instead of details ----
        details={property.propertyDetails}
      />

      <div className="flex-col lg:flex-row gap-10 hidden md:flex">
        <div className="flex-1">
          <PropertiesDetail property={property} />
          <MapView
            location={property.location}
            image={property.images[0] || "/src/assets/housing.jpg"}
            propertyName={property.propertyName}
          />
        </div>
        <div className="flex flex-col gap-5">
          <CardComponent agentPhone={property.agentPhone} agentName={property.agentName} />
         <AgentForm propertyId={property._id} />
        </div>
      </div>

      <div className="flex-col lg:flex-row gap-10 flex md:hidden">
        <PropertiesDetail property={property} />
        <CardComponent agentPhone={property.agentPhone} agentName={property.agentName} />
        <AgentForm propertyId={property._id} />
        <MapView
          location={property.location}
          image={property.images[0] || "/src/assets/housing.jpg"}
          propertyName={property.propertyName}
        />
      </div>

      {/* Explore More Properties */}
      <div className='mt-16 mb-11 px-5 items-center justify-center'>
        <div className='lg:text-[41px] text-[25px] mb-7 text-center md:text-start'>
          Explore More Properties
        </div>

        <div className='flex lg:flex-row flex-col gap-[20px] w-full lg:max-w-[1201px] items-center justify-center lg:items-start lg:justify-start px-12'>
          {/* ---- BACKEND UPDATED: filter by _id instead of id ---- */}
          {allProperties
            .filter((prop) => prop._id !== id)
            .slice(0, 3)
            .map((result) => (
              <div key={result._id}>
                <div className="w-full max-w-[387px] min-h-[549px] shadow-2xl text-start rounded-bl-[20px] rounded-br-[20px] relative">
                  {/* ---- BACKEND UPDATED: images[0] instead of image ---- */}
                  <img
                    className="h-[322px] w-full object-cover"
                    src={result.images[0] || "https://placehold.co/387x322?text=No+Image"}
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
                      <Button onClick={() => navigate(`/property/${result._id}`)} />
                      <p className="text-[25px]"><span>₦</span>{result.price.toLocaleString()}</p>
                    </div>
                  </div>
                  {result.discount && (
                    <div className="absolute w-[112px] h-[49px] px-[24px] py-[12px] rounded-[10px] bg-[#F4A261] text-white top-2 right-2">
                      {result.discount}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default PropertyDetails;