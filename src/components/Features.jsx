import React from "react";
import Slider from "react-slick";
import { MapPin, Package, ThumbsUp, Phone, Heart } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

// Custom orange arrow buttons
const NextArrow = (props) => (
  <div
    {...props}
    className="!text-orange-500 !right-2 !z-10 absolute top-1/2 -translate-y-1/2 cursor-pointer"
  >
    <i className="fas fa-chevron-right text-orange-500 text-lg"></i>
  </div>
);

const PrevArrow = (props) => (
  <div
    {...props}
    className="!text-orange-500 !left-2 !z-10 absolute top-1/2 -translate-y-1/2 cursor-pointer"
  >
    <i className="fas fa-chevron-left text-orange-500 text-lg"></i>
  </div>
);

export default function Features() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      {/* Desktop View */}
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

      {/* Mobile View */}
      <div className="md:hidden bg-[#0B0320] text-white rounded-full px-6 py-6 shadow relative">
        <Slider {...settings}>
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 justify-center h-20">
              {f.icon}
              <div>
                <h4 className="font-semibold text-sm">{f.title}</h4>
                <p className="text-gray-300 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
