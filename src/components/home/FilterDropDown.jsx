import { ChevronDown,SlidersHorizontal,X } from 'lucide-react'
import {useState} from "react";

const FilterDropDown = ({onApply}) => {

  const [filters, setFilters] = useState({
    budget: "Any",
    distance: "Any",
    gender: "Any",
    food: "Any",
  });
  const budgetOptions = [
  "Any",
  "Under ₹5K",
  "₹5K-8K",
  "₹8K-12K",
  "₹12K+",
];

const distanceOptions = [
  "Any",
  "< 0.5 km",
  "< 1 km",
  "< 2 km",
];

const genderOptions = [
  "Any",
  "Boys",
  "Girls",
];

const foodOptions = [
  "Any",
  "Food",
  "Without Food",
];

const [isOpen,setIsOpen]=useState(false);

const handleChange=(category,value)=>{
  setFilters((prev)=>({
    ...prev,[category]:value,
  }));
};

const handleClear=()=>{
  setFilters({
    budget:"Any",
    distance:"Any",
    gender:"Any",
    food:"Any"
  })
}

const handleApply=()=>{
  console.log("Selected Filters:",filters);

  if(onApply){
    onApply(filters);
  }
  setIsOpen(false);
}



  return (

    <div className='relative '>
     


    <button type='button' className="flex min-w-[105px] items-center justify-between gap-4 rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-white" onClick={()=>setIsOpen((prev)=>!prev)}>
    
    <SlidersHorizontal size={17}/>

    <span>FILTER</span>
    <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180":""}`}/>
   </button>

   {isOpen && ( <div className='absolute left-0 top-full z-50 mt-3   md:w-90 w-61.5 max-w-[calc(100vw-32px)] rounded-2xl border border-slate-200 shadow-xl bg-indigo-50 '> 

    <div className='flex items-center justify-between border-b border-slate-100  px-5 py-4'>

      <div>
        <h3 className='font-bold text-slate-900'>Filters</h3>
        <p>Refine your search</p>
      </div>

      <button  type="button" onClick={()=>setIsOpen(false)}
        className='rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700'>
          <X size={18}/>
        </button>

    </div>

    <div className='max-h-[60vh] overflow-y-auto md:px-5 px-3'>

      
      <FilterGroup  title="Budget" options={budgetOptions} selected={filters.budget} onChange={(value)=> handleChange("budget",value)}/>

      
        <FilterGroup  title="Distance" options={distanceOptions} selected={filters.distance} onChange={(value)=> handleChange("distance",value)}/>

  

        <FilterGroup  title="Gender" options={genderOptions} selected={filters.gender} onChange={(value)=> handleChange("gender",value)}/>

         
        <FilterGroup  title="Food" options={foodOptions} selected={filters.food} onChange={(value)=> handleChange("food",value)}/>


    </div>

    <div  className='flex items-center justify-between border-t border-slate-100 px-5 py-4'>

      <button type='button' onClick={handleClear} 
      className='text-sm font-semibold text-slate-500 hover:text-red-500'>Clear All</button>

      <button type='button' onClick={handleApply} className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Apply Filters</button>

    </div>

   </div>)}
    </div>

   
  );
};

function FilterGroup({title,options,selected,onChange}){
return (
<div className='border-b border-slate-100 md:py-4'>
  <h4 className='mb-3 text-sm font-semibold text-slate-800'>{title}</h4>
<div className='flex flex-wrap gap-2'>
  {options.map((option)=>(
    <button key={option} type='button' onClick={()=>onChange(option)}
    className={`rounded-lg border px-3 py-2 text-sm transition ${selected===options?"border-indigo-600 bg-indigo-50 font-semibold text-indigo-600":"border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:text-indigo-600"}`}>{option}</button>
  ))}
</div>
</div>
)

}

export default FilterDropDown;