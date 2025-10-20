import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Dji RS3",
    subtitle: "SALE UP TO 20% OFF",
    description:
      "The most advanced and capable camera gimbal for professional videographers.",
    // 👇 ImgBB hosted image
    image: "https://i.ibb.co/DgVLqxVF/rs3.jpg",
    // 👇 link to relevant product page (use real _id from your DB)
    link: "/product/68eded639f0088fca6545775",
  },
  {
    id: 2,
    title: "Sony Mirrorless - Alpha Series",
    subtitle: "NEW ARRIVAL",
    description: "Capture stunning professional photos and 4K videos effortlessly.",
    image: "https://i.ibb.co/4RwBqdHZ/a7.jpg",
    link: "/product/68edeca29f0088fca6545761",
  },
  {
    id: 3,
    title: "Dji Mini 4 Pro",
    subtitle: "Compact Drone Camera",
    description: "Fly high and capture breathtaking aerial shots in 4K resolution.",
    image: "https://i.ibb.co/ynJYn3zW/djibanner.jpg",
    link: "/product/68edeefb9f0088fca65457b1",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative w-full overflow-hidden sm:pt-0">
      {/* Desktop / Tablet View */}
      <div className="hidden sm:block max-w-7xl w-[95%] mx-auto my-8 border border-gray-300 shadow-xl rounded-2xl overflow-hidden relative">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-[90vh] object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-start px-10 md:px-20 text-white">
          <p className="text-sm font-medium text-orange-400">{slide.subtitle}</p>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">{slide.title}</h2>
          <p className="mt-3 max-w-xl text-gray-200">{slide.description}</p>

          <div className="mt-6 flex gap-3">
            <Link
              to={slide.link}
              className="bg-orange-500 text-white px-5 py-2 rounded-md shadow cursor-pointer transition hover:bg-orange-600 hover:shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              to={slide.link}
              className="bg-white text-black px-5 py-2 rounded-md cursor-pointer transition hover:bg-gray-100 hover:shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition cursor-pointer ${
                i === index ? "bg-orange-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden w-[95%] mx-auto my-6 border border-gray-300 shadow-lg rounded-2xl overflow-hidden relative">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-auto object-contain"
        />

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition cursor-pointer ${
                i === index ? "bg-orange-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
