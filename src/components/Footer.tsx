"use client";

import React from "react";
import { Globe, Linkedin, Copyright, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <div className="mx-auto border-t border-deep-sea">
        <div className="py-6 flex items-center justify-between max-w-5xl mx-auto px-4">
          {/* Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://juvosolutions.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-deep-sea hover:text-kimchi font-poppins text-sm transition-colors duration-300 hover:scale-105"
            >
              <Globe size={16} />
              <span>juvosolutions.co</span>
              <span className="text-xs opacity-70">↗</span>
            </a>
            <span className="text-deep-sea/20">|</span>
            <a
              href="https://www.linkedin.com/company/juvosolutions/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-deep-sea hover:text-kimchi font-poppins text-sm transition-colors duration-300 hover:scale-105"
            >
              <Linkedin size={16} />
              <span>LinkedIn</span>
              <span className="text-xs opacity-70">↗</span>
            </a>
          </div>

          <div className="flex items-center space-x-6">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-deep-sea font-poppins text-sm">
              <Copyright size={16} />
              <span>© {currentYear} Juvo Solutions</span>
            </div>

            <div className="flex items-center space-x-2 text-deep-sea font-poppins text-sm">
              <MapPin size={16} />
              <span>Trondheim, Norway</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
