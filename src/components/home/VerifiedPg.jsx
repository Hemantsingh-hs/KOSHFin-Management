import React from 'react'
import { Dot } from 'lucide-react';
const VerifiedPg = () => {
  return (
    <div className='flex rounded-full mt-5 bg-indigo-100 w-50 font-semibold  text-sm py-1 px-2 text-indigo-800 shadow-md/15'>
      <Dot/> <p>  <span>2,400</span>+ verified places</p>
    </div>
  )
}

export default VerifiedPg