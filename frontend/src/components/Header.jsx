import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";

export function Header({ userRole }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  var userName = localStorage.getItem("name") || "anonymous";
  userName = userName[0].toUpperCase() + userName.substring(1);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const navItems = {
    Student: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Tests", path: "/tests" },
      { name: "Results", path: "/results" },
    ],
    Teacher: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Schedule Tests", path: "/admin/tests" },
      { name: "Evaluate Tests", path: "/admin/evaluate" },
    ],
  };

  const currentNavItems = userRole ? navItems[userRole] : [];

  return (
    <>
      <header className="bg-green-600 text-white shadow-lg fixed top-0 left-0 right-0 w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center justify-center">
              <Link
                to="/"
                className="text-3xl font-extrabold hover:text-gray-200"
              >
                {"</>"}
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 lg:ml-32 w-full flex items-baseline justify-evenly space-x-4">
                  {currentNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="px-3 py-2 rounded-md text-lg font-medium text-white hover:text-gray-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={toggleUserMenu}
                      className="max-w-xs bg-green-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white"
                    >
                      <span className="sr-only">Open user menu</span>
                      <User className="h-6 w-6 rounded-full" />
                      <span className="ml-2 text-lg">{userName}</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <button
                        onClick={logout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="inline-block mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                className="bg-green-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {currentNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-500"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-green-500">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <User className="h-10 w-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {userName}
                  </div>
                  <div className="text-sm font-medium leading-none text-green-300">
                    {userRole}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={logout}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-500 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      <div className="h-16"></div>
    </>
  );
}
