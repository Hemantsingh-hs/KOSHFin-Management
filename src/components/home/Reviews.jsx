

import Slider from 'react-slick';
import { ReviewCard } from './ReviewCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Reviews = () => {
    const rating=[
     {
        value:"48+",
        label:"Happy Users",
        
    },
    {
     value:"1,200+",
     label:"PG & Rooms Listed",
    },
    {
       value:"4.8★",
       label:"Average Rating",
    },
    {
     value:"₹2Cr+",
     label:"Rent collected",
    }


];

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Shows 3 cards at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };
const UserFeedBack=[
     {    id:1,
          comment:"Found a great PG near my office in under 10 minutes. The map view with price pins is genius — I could compare 6 places at a glance. Moved in within a week.",
          name:"Aryan Mehta",
          role:"Software Engineer, Pune",
          type:"Property Discovery",


     },
     { id:2,
          comment:"KOSHFin rent reminder saved me from a late fee twice already. My landlord gets a WhatsApp automatically on the 1st — I don't even have to think about it.",
          name:"Divya Krishnan",
          role:"MBA Student, Bangalore",
          type:"Rent Reminders",

     },
     {
           id:3,
          comment:"Managing 3 PGs used to mean spreadsheets and constant follow-ups. Now I track all 18 tenants in one dashboard and send bulk reminders in one tap.",
          name:"Rohan Gupta",
          role:"PG Owner, Hyderabad",
          type:"Rent Management",

     },

     { id:4,
          comment:"I was new to the city and nervous about finding a safe place. The Verified badge and gender filter gave me confidence. Shifted into a great girls PG the same week.",
          name:"Sneha Iyer",
          role:"Fresher, Chennai",
          type:"Verified Listings",
     },
     { id:5,
          comment:"The expense tracker + rent tracking in one app is exactly what I needed. I finally know where my sal.ary goes every month. Saved ₹3,000 last month alone",
          name:"Kiran Patil",
          role:"Working Professional, Mumbai",
          type:"Expense Tracking",
     },
     { id:6,
          comment:"Listed my property in 5 minutes and got my first enquiry the same day. The enquiry form captures exactly what I need. No more random calls from unserious people.",
          name:"Meera Nair",
          role:"PG Owner, Kochi",
          type:"Property Listing",
     },
  
];
  return (
    <div className='justify-center '>
        <div className='text-center font-bold px-2'>

         <p className='text-indigo-700 mb-3'>LOVED BY THOUSANDS</p>
         <h2 className='text-3xl'>Real people,real results</h2>

        </div>
        <div className='flex gap- my-5  lg:gap-12  justify-center'>


       {rating.map((item,index)=>(
           <div  key={index} className='rounded-2xl bg-blue-50 px-6 py-4 w-full md:h-33 lg:w-70  shadow-xl justify-center text-center'>
            <span className='font-bold text-indigo-700 text-3xl'>{item.value}</span> 
             <p className='text-slate-400 mt-2 '>{item.label}</p>
        </div>
       ))}
       
        
        
        </div>

        {/* <div className='flex gap-10  my-5 lg-gap-12 '>
             
             {UserFeedBack.map((data,id)=>(
              <div className='rounded-2xl bg-blue-50 px-6 py-4 w-full md:h-33 lg:w-70  shadow-xl justify-center text-center'>
             <span className=' text-black text-xl'>{data.comment}</span> 
             {/* <p className='text-slate-400 mt-2 '>{item.label}</p> */}
               {/* </div>  */}
          {/* //    ))} */}
     {/* //    </div>  */}

{/* <div style={{ padding: '40px', background: '#f9fafb' }}>
      <Slider {...settings}>
        {UserFeedBack.map((data)=> (
          <div key={data.id}>
            <ReviewCard   reviewData={data} />
          </div>
        ))}
      </Slider>
    </div> */}
    {/* <div className="bg-gray-50 p-10">
  {UserFeedBack.map((data) => (
    <div key={data.id}>
      <ReviewCard reviewData={data} />
    </div>
  ))}
</div> */}
<div className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-10 rounded-2xl">
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {UserFeedBack.map((data) => (
      <ReviewCard key={data.id} reviewData={data} />
    ))}
  </div>
</div>

    </div>
  )
}

export default Reviews