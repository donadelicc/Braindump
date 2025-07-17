"use client";

import React from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <header className="py-4">
      <div className="flex justify-between items-center border-b border-deep-sea">
        <div className="flex items-center bg-transparent">
          <Link href="/">
            <Image src="/logo2.png" alt="Logo" width={75} height={50} />
          </Link>
        </div>
        {/* Auth and Company links on the right */}
        <div className="relative">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-2 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-2 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

          {/* Auth and Company link content */}
          <div className="relative px-6 py-3 flex items-center space-x-4">
            {/* Auth links */}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="hover:opacity-80 transition-opacity duration-300 hover:scale-105"
                  title="Profil"
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">👤</span>
                    </div>
                  )}
                </Link>
                <span className="text-deep-sea">|</span>
                <button
                  onClick={handleLogout}
                  className="text-deep-sea hover:text-kimchi font-poppins text-sm transition-colors duration-300 hover:scale-105"
                >
                  Logg ut
                </button>
                <span className="text-deep-sea">|</span>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-deep-sea hover:text-kimchi font-poppins text-sm transition-colors duration-300 hover:scale-105"
                >
                  Sign in
                </Link>
                <span className="text-deep-sea">|</span>
              </>
            )}

            {/* Company links */}
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
