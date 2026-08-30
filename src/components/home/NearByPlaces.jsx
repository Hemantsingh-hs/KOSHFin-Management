import {useState} from "react";
import {ArrowRight,ChevronDown,Dot,Heart,MapPin,Star} from "lucide-react";
import FilterDropDown from "./FilterDropDown";
import PropertyCard from "./PropertyCard";
const properties = [
  {
    id: 1,
    type: "PG",
    name: "Sunrise PG for Girls",
    location: "Koramangala, Bangalore",
    distance: "0.3 km",
    price: "₹7,500",
    rating: "4.8",
    reviews: "124",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
    amenities: ["WiFi", "AC", "+2"],
    food: true,
  },
  {
    id: 2,
    type: "Room",
    name: "Tranquil Stay",
    location: "HSR Layout, Bangalore",
    distance: "0.6 km",
    price: "₹9,200",
    rating: "4.6",
    reviews: "88",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
    amenities: ["WiFi", "Parking", "+2"],
    food: false,
  },
  {
    id: 3,
    type: "Hostel",
    name: "Green Leaf Hostel",
    location: "Indiranagar, Bangalore",
    distance: "1.1 km",
    price: "₹5,500",
    rating: "4.3",
    reviews: "206",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
    amenities: ["WiFi", "Mess", "+2"],
    food: true,
  },
];

const filter=["Any","Any","Any","Any"];

const propertyTypes=["PG","Room","Mess","Hostel"];

const NearByPlaces = () => {
  const [activeType,setActiveType]=useState("PG");

  const filteredProperties=properties.filter((property)=>property.type===activeType);

  
  return (
    <section className="w-full bg-[#f8f9fc] px-4 py-12 sm:px-6 lg:px-8 rounded-3xl">

      <div className="mx-auto max-w-7xl">

        <div className="flex items-end justify-between">

          <div>
            <p className="text-sm font-bold tracking-[0.18em] text-indigo-600">NEARBY</p>
            <h2 className="mt-text-3xl font-bold text-[#11182b] sm:text-4xl">
              Places Near You
            </h2>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 sm:text-base">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Update live  KIET, Ghaziabad</span>
            </div>
          </div>

          <button className="hidden items-center gap-2 font-semibold text-indigo-600 transition hover:text-indigo-800 sm:flex">View All

          <ArrowRight size={18}/>
          </button>

        
        </div> 

        <div className="mt-8 rounded-3xl border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap item-center gap-2">

              <span className="mr-1 text-sm font-semibold text-slate-400">FILTER:</span>

              {filter.map((filter,index)=>(<FilterDropDown key={index} label={filter}/>))}
            </div>

            <div className="flex w-full gap-1 overflow-x-auto rounded-full bg-slate-50 p-1 xl:w-auto">
              {propertyTypes.map((type)=>(
                <button key={type} onClick={()=>setActiveType(type)} className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semiBold transition ${activeType===type?"bg-indigo-600 text-white shadow-sm":"text-slate-500 hover:bg-white hover:text-indigo-600"}`}>{type}</button>
              ))}
            </div>
          </div>
        </div>
   

   {/* cards */}

   <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {filteredProperties.map((property)=>(<PropertyCard key={property.id} property={property}/>))}
   </div>

   {filteredProperties.length===0 && (<div className="mt-10 rounded-3xl border border-slate-200 bg-white py-16 text-center"> 
    <p className="text-lg font-semibold text-slate-600">No {activeType} found nearBy</p>

    <p className="mt-2 text-sm text-slate-400">
      Try another property type or location.
    </p>
   </div>)}
      </div>

    </section>
  )
}

export default NearByPlaces