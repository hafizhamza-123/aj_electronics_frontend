import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { MapPin, Package, ThumbsUp, Phone, Heart } from "lucide-react";

const features = [
  {
    icon: <MapPin size={28} className="text-orange-500" />,
    title: "Free Cash On Delivery",
    desc: "All over Pakistan",
  },
  {
    icon: <Package size={28} className="text-orange-500" />,
    title: "Same Day Delivery",
    desc: "In Lahore upto 7000",
  },
  {
    icon: <ThumbsUp size={28} className="text-orange-500" />,
    title: "Official 3 Years Warranty",
    desc: "All Boya Products",
  },
  {
    icon: <Phone size={28} className="text-orange-500" />,
    title: "Expert Customer Service",
    desc: "Choose chat or call us",
  },
  {
    icon: <Heart size={28} className="text-orange-500" />,
    title: "Exclusive Brands",
    desc: "SONY, NIKON, BOYA, DJI",
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      {/* Desktop / Tablet View */}
      <div className="hidden md:flex justify-between items-center gap-6 bg-[#0B0320] text-white rounded-full px-8 py-6 shadow">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            {f.icon}
            <div>
              <h4 className="font-semibold text-sm">{f.title}</h4>
              <p className="text-gray-300 text-xs">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View - Swiper Slider (swipe only) */}
      <div className="md:hidden">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          className="bg-[#0B0320] text-white rounded-full px-6 py-5 shadow"
        >
          {features.map((f, i) => (
            <SwiperSlide key={i}>
              <div className="flex items-center gap-3 justify-center h-20">
                {f.icon}
                <div>
                  <h4 className="font-semibold text-sm">{f.title}</h4>
                  <p className="text-gray-300 text-xs">{f.desc}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
