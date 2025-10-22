import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const categories = [
  { name: "Cameras", img: "/images/cam.jpg" },
  { name: "Lenses", img: "/images/lens.jpg" },
  { name: "Audio", img: "/images/audio.jpg" },
  { name: "Lighting", img: "/images/lights.jpg" },
  { name: "Accessories", img: "/images/accessories.jpg" },
  { name: "Drones", img: "/images/drone1.jpg" },
];

export default function Categories() {
  const navigate = useNavigate();

  const handleCategoryClick = (name) => {
    navigate(`/category/${encodeURIComponent(name)}`);
  };

  const NextArrow = ({ onClick }) => (
    <div
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full cursor-pointer 
      hover:bg-orange-500 hover:text-white transition"
      onClick={onClick}
    >
      <FiChevronRight className="text-2xl" />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full cursor-pointer 
      hover:bg-orange-500 hover:text-white transition"
      onClick={onClick}
    >
      <FiChevronLeft className="text-2xl" />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4, slidesToScroll: 2 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 640,
        settings: "unslick",
      },
    ],
  };

  return (
    <section
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-06 mb-16"
      style={{ overflow: "hidden" }} 
    >
      <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center sm:text-left">
        Trending Categories
      </h3>

      {/* 🔹 Mobile Grid Layout */}
      <div className="grid grid-cols-2 gap-4 sm:hidden">
        {categories.map((c) => (
          <div
            key={c.name}
            onClick={() => handleCategoryClick(c.name)}
            className="bg-white rounded-xl p-6 h-40 flex flex-col items-center justify-center text-center shadow-md
            hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-300 ease-out cursor-pointer"
          >
            <img
              src={c.img}
              alt={c.name}
              className="h-20 w-20 object-contain mb-3"
            />
            <div className="text-sm font-medium text-gray-700">{c.name}</div>
          </div>
        ))}
      </div>

      {/* 🔹 Desktop & Tablet Slider */}
      <div className="hidden sm:block relative pb-6"> {/* ✅ Added padding-bottom */}
        <Slider {...settings}>
          {categories.map((c) => (
            <div key={c.name} className="px-3">
              <div
                onClick={() => handleCategoryClick(c.name)}
                className="bg-white rounded-xl p-6 h-44 flex flex-col items-center justify-center text-center shadow-md
                hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-300 ease-out cursor-pointer"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="h-20 w-20 object-contain mb-3"
                />
                <div className="text-base font-medium text-gray-700">
                  {c.name}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
