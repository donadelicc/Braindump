import React from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="py-4">
      <div className="flex justify-between items-center border-b border-deep-sea">
        <div className="flex items-center bg-transparent">
          <Link href="/">
            <Image src="/logo2.png" alt="Logo" width={75} height={50} />
          </Link>
        </div>
        {/* Company link on the right */}
        <div className="relative">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-2 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-2 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

          {/* Company link content */}
          <div className="relative px-6 py-3 flex items-center space-x-4">
            <a
              href="https://juvosolutions.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-deep-sea hover:text-kimchi font-poppins text-sm transition-colors duration-300 hover:scale-105"
            >
              <span>juvosolutions.co</span>
            </a>
            <span className="text-deep-sea">|</span>
            <a
              href="https://www.linkedin.com/company/juvosolutions/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-deep-sea hover:text-kimchi font-poppins text-sm transition-colors duration-300 hover:scale-105"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
