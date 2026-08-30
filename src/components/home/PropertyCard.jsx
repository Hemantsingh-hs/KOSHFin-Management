import { Dot, Heart, Star,MapPin } from 'lucide-react'


const PropertyCard = ({property}) => {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transtion-all duration-300 hover:-translate-y-1 hover:shadow-lg">

        <div className="relative h-64 overflow-hidden">
          <img src={property.image} alt={property.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

        <div className='absolute left-4 top-4 flex gap-2'>
            <span className='rounded-full bg-white px-3 py-1.5 text-xs font-bold text-indigo-600 shadow-sm'>{property.type}</span>

            {property.food && (<span className='rounded-full bg-white px-3 py-1.5 text-xs font-semibold '>Food</span>)}
            </div>  

            <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-400 shadow-sm transition hover:text-red-500"> <Heart size={20}/></button>

            <div className="abosulte bottom-4 left-4 text-white">
                <p className="text-2xl font-bold drop-shadow-md">{property.price}</p>
                <p className='text-sm font-medium'>per month</p>

            </div>
            <span className='absolute bottom-4 right-4 rounded-full bg-emerald-500 px-3 py-1.4 text-xs font-semibold text-white'> Avaiable</span>
        </div>

        <div className='p-5'>
            <h3 className='text-lg font-semibold text-[#11182b]'>{property.name}</h3>

            <div className='mt-2 flex items-center gap-1.5 text-sm text-slate-400'>
                <MapPin size={15} />

                <span>{property.location}<Dot className='inline-flex'/>{property.distance}</span>

            </div>

            <div className='mt-5 flex items-center justify-between gap-3'>

                <div className='flex items-center gap-1.5'>
                    <Star size={15} className='fill-yellow-400 text-yellow-400'/>
                    <span className='font-semiBold  text-slate-700'>{property.rating}</span>
                <span  className='text-sm text-slate-400'>({property.reviews})</span>
                </div>
         <div className='flex flex-wrap justify-end gap-1.5'>
             {property.amenities.map((item)=>(
                <span key={item} className='rounded-full bg-slate-50 px-2.5 text-xs font-medium text-slate-500'> {item}</span>
             ))}
         </div>

            </div>
        </div>
    </article>
  )
}

export default PropertyCard