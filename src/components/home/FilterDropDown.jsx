import { ChevronDown,SlidersHorizontal,X } from 'lucide-react'
import {useState} from "react";
import React from 'react'



const FilterDropDown = ({label}) => {
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
   <button className="flex min-w-[105px] items-center justify-between gap-4 rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-white">
    {label}
    <ChevronDown size={16}/>
   </button>
  );
}

export default FilterDropDown