import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 mt-10 ">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & About */}
        <div>
          
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-white">Aljadeed</span>
            <span className="text-orange-500">Electronics</span>
          </h2>

          <p className="text-sm leading-6">
            Al-jadeed Electronics delivers best Photography & videography equipments all over Pakistan, Since 2005!
          </p>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4">
            <a href="https://www.facebook.com/AlJadeedElectronics/" target="_blank" rel="noreferrer">
              <FaFacebookF className="h-5 w-5 hover:text-orange-500 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter className="h-5 w-5 hover:text-orange-500 transition" />
            </a>
            <a href="https://instagram.com/aljadeedelectronics/" target="_blank" rel="noreferrer">
              <FaInstagram className="h-5 w-5 hover:text-orange-500 transition" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedinIn className="h-5 w-5 hover:text-orange-500 transition" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-orange-500">Home</a></li>
            <li><a href="/shop" className="hover:text-orange-500">Shop Page</a></li>
            <li><a href="/products" className="hover:text-orange-500">Products</a></li>
            <li><a href="/contact" className="hover:text-orange-500">Contact</a></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/faq" className="hover:text-orange-500">FAQ</a></li>
            <li><a href="/privacy" className="hover:text-orange-500">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-orange-500">Terms & Conditions</a></li>
            <li><a href="/support" className="hover:text-orange-500">Help Center</a></li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">We Accept</h3>
          <div className="flex space-x-4">
            <FaCcVisa className="h-8 w-8" />
            <FaCcMastercard className="h-8 w-8" />
            <FaCcPaypal className="h-8 w-8" />
          </div>
          <p className="text-xs mt-3 text-gray-400">
            Secure payments powered by trusted gateways.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Aljadeed Electronics. All Rights Reserved.
      </div>
    </footer>
  );
}
