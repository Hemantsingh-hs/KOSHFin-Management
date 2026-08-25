import {useState} from "react";
import {MapPin,Navigation,Search} from "lucide-react"

const PropertiesSearch = () => {

  const [activeTab,setActiveTab]=useState("PG");
  const [location,setLocation]=useState("");

  const tabs=["PG","Room","Mess","Hostel"];

 
  const popularLocations=["Govidpuri","KIET college","Gurugram Sector 18","pratap nagar"];
 
  const handleSearch=()=>{
    console.log({
      type:activeTab,
      location:location
    });
  } ;

  const handleNearMe=()=>{
    console.log("Getting current location...");
  };

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border-slate-200 bg-white shadow-sm">
<div className="grid grid-cols-4 border-b border-slate-200">
      {tabs.map((tab)=>(
        <button key={tab} onClick={()=>setActiveTab(tab)}
        className={`relative py-4 text-base font-semibold transition
          ${activeTab===tab?"bg-indigo-50 text-indigo-600":"text-slate-400 hover:text-indigo-600"}`}>

            {tab}
            {activeTab===tab && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-24 -translate-x-1/2 rounded-full bg-indigo-600"/>
            )}
          </button>
      ))}

        
    </div>

   <div className="p-3 sm:p-4">

     <div className="flex flex-col gap-3 sm:flex-row">


        <div className="flex min-h-[56x] flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-5">
          <MapPin size={22} className="shrink text-indigo-500"/>
         <input className="w-3/4 rounded-3xl border-0 text-center focus:outline-none focus:border-blue-500 font-serif text-md text-gray-800 " type="text" value={location}  onChange={(e)=>setLocation(e.target.value)}/>
        </div>

        <button onClick={handleSearch} className="flex min-h-[56x] items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 text-base font-semibold text-white shadow-md transition hover:bg-indigo-700">
          <Search size={20}/>
          <span>Search</span>
        </button>
     </div>

     <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-slate-400">
            Popular:
          </span>

          {popularLocations.map((place)=>(
            <button key={place} onClick={()=>setLocation(place)}
            className="rounded-full border-slate-200 px-3 py-1.5 text-sm text-shadow-amber-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600
            font-thin">{place}</button>
          ))}
     </div>

   </div>

   </div>
  )
}

export default PropertiesSearch