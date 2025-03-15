import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Menu,
  Beaker,
  Laptop,
  CheckCircle,
  UserIcon,
  Github,
} from "lucide-react";
import { Footer } from "../components/Footer";

const FeatureCard = ({ icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        {icon}
        <h3 className="text-xl font-bold mb-4 text-green-600">{title}</h3>
        <p className="text-gray-700 text-xs sm:text-sm text-justify">
          {description}
        </p>
      </div>
    </div>
  );
};

export function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const groupMembersRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "About", ref: aboutRef },
    { name: "Features", ref: featuresRef },
    { name: "Developers", ref: groupMembersRef },
  ];

  const loginHandler = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole && localStorage.getItem("token")) {
      if (userRole == "Teacher") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <header className="bg-green-600 text-white shadow-lg fixed w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center justify-center">
              <Link
                to="/"
                className="text-3xl font-extrabold hover:text-gray-200"
                aria-label="Home"
              >
                {"</>"}
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 lg:ml-32 w-full flex items-baseline justify-evenly space-x-4">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.ref)}
                      className="px-3 py-2 rounded-md text-lg font-medium text-white hover:text-gray-300"
                      aria-label={`Scroll to ${item.name} section`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={loginHandler}
                      className="ml-4 py-2 px-4 rounded-full bg-white text-green-600 hover:bg-gray-100 transition-colors flex items-center"
                    >
                      <UserIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Login</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                className="bg-green-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
              >
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
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    scrollToSection(item.ref);
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-500 w-full text-left"
                  aria-label={`Scroll to ${item.name} section`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-green-500">
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={loginHandler}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-500 w-full text-left"
                  aria-label="Login"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-16 bg-white">
        <div className="h-screen flex justify-center items-center bg-gray-50">
          <section
            className={`w-full py-20 md:py-32 lg:py-48 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center space-y-8 text-center">
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none animate-fadeIn text-green-600">
                    Modernizing Laboratory Assessment
                  </h1>
                  <br />
                  <p className="mx-auto max-w-[700px] text-gray-500 text-sm md:text-xl animate-slideUp">
                    Transforming traditional lab test systems with our
                    comprehensive online platform to Enhance efficiency and
                    accessibility in education.
                  </p>
                </div>
                <button
                  className="px-6 py-3 sm:px-8 sm:py-4 text-white bg-green-600 hover:bg-green-700 rounded-full sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  onClick={loginHandler}
                  aria-label="Get Started"
                >
                  Get Started
                </button>
              </div>
            </div>
          </section>
        </div>

        <section
          ref={aboutRef}
          className="w-full py-20 md:py-32 flex justify-center items-center h-screen"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-green-600">
              About the Project
            </h2>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-500 text-sm md:text-lg text-justify">
              <p>
                Our project aims to transform traditional lab test systems by
                developing a comprehensive online platform. Utilizing JavaScript
                for both front-end and back-end development, we provide a
                robust, user-friendly interface that includes separate login
                modes for faculty and students.
              </p>
              <p>
                This modernization effort not only streamlines the assessment
                process but also aligns with contemporary educational needs,
                promoting a more efficient and effective learning environment.
                By integrating innovative educational technologies, we seek to
                empower both faculty and students, making the learning process
                more engaging, responsive, and adaptable to the evolving demands
                of the digital age.
              </p>
            </div>
          </div>
        </section>

        <section
          ref={featuresRef}
          className="w-full py-20 mt-44 sm:mt-0 md:py-32 bg-gray-50 flex justify-center items-center h-screen"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16 text-green-600">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <FeatureCard
                icon={<Beaker className="h-12 w-12 mb-6 text-green-600" />}
                title="Role-Based Platform"
                description="Create distinct user roles with tailored features. Students access lab assignments, track progress, and receive feedback, while faculty design, manage, and evaluate tests with tools to monitor performance effectively."
                delay={0}
              />
              <FeatureCard
                icon={<Laptop className="h-12 w-12 mb-6 text-green-600" />}
                title="Integrated Coding Platform"
                description="Provide students with an integrated online text editor that supports code submission and enables them to write and execute their solutions directly on the platform."
                delay={200}
              />
              <FeatureCard
                icon={<CheckCircle className="h-12 w-12 mb-6 text-green-600" />}
                title="Streamline Grading"
                description="Enhance learning and streamline grading by providing immediate feedback to students for a more engaging and interactive learning experience, while automating the assessment process to reduce instructors' workload and ensure consistent evaluation."
                delay={400}
              />
            </div>
          </div>
        </section>

        <section
          ref={groupMembersRef}
          className="w-full py-20 md:py-32 bg-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-20 sm:my-0">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16 text-green-600">
              Developers
            </h2>
            <div className="flex flex-col items-center space-y-8">
              <p className="text-xl sm:text-2xl font-semibold text-green-600 text-center">
                Siddaganaga Institute of Technology
              </p>
              <div className="flex flex-col justify-center items-center sm:grid sm:grid-cols-3 gap-8 w-56 sm:w-full max-w-4xl">
                {[
                  {
                    name: "RANJAN N",
                    branch: "CSE-AIML",
                    usn: "1SI22CI064",
                    github: "https://github.com/Ranjan-n",
                  },
                  {
                    name: "VIKRAM R",
                    branch: "CSE-AIML",
                    usn: "1SI22CI063",
                    github: "https://github.com/Vikram-0401",
                  },
                  {
                    name: "AMOGH S",
                    branch: "CSE",
                    usn: "1SI22CS016",
                    github: "https://github.com/AmoghS30",
                  },
                ].map((member, index) => (
                  <div
                    key={member.usn}
                    className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center sm:text-left w-full sm:w-auto"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <p className="font-bold text-sm sm:text-lg mb-2 text-green-800">
                      {member.name}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm font-semibold">
                      {member.branch}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">
                      {member.usn}
                    </p>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors duration-200"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      <span className="text-xs sm:text-sm">GitHub</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
