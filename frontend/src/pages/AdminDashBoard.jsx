import React from "react";
import { ReactTyped } from "react-typed";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const Card = ({ title, children }) => (
  <div className="rounded-lg bg-white p-6 text-sm sm:text-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <h3 className="mb-4 text-lg sm:text-xl font-semibold text-green-600">
      {title}
    </h3>
    {children}
  </div>
);

const ListItem = ({ children }) => (
  <li className="mb-2 flex items-center">
    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
    {children}
  </li>
);

export function AdminDashBoard() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header userRole="Teacher" />

      <div className="flex min-h-screen justify-center items-center py-16">
        <main className="container mx-auto px-4 py-8">
          <h1 className="mb-28 text-xl sm:text-4xl md:text-5xl text-center font-bold text-gray-800">
            <ReactTyped
              strings={["Streamline Your Lab Assessments"]}
              typeSpeed={40}
              backSpeed={40}
              className="text-green-600"
            />
          </h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Getting Started">
              <p className="mb-4 text-gray-600">
                Our platform streamlines your programming lab assessments,
                making it easier to evaluate student performance and manage
                coursework efficiently:
              </p>
              <ul className="space-y-2 text-gray-700">
                <ListItem>
                  Access comprehensive tools for managing programming
                  assignments and assessments
                </ListItem>
                <ListItem>
                  Create and schedule automated code evaluations for multiple
                  batches
                </ListItem>
                <ListItem>
                  Monitor student progress in real-time with detailed
                  performance analytics
                </ListItem>
                <ListItem>
                  Generate insightful reports to track learning outcomes and
                  identify areas for improvement
                </ListItem>
              </ul>
            </Card>

            <Card title="Assessment Workflow">
              <ol className="space-y-2 text-gray-700">
                <ListItem>
                  Configure assessment settings by selecting the target batch,
                  year, and branch
                </ListItem>
                <ListItem>
                  Choose from your existing course materials or create new
                  programming assignments
                </ListItem>
                <ListItem>
                  Design comprehensive evaluations by adding coding challenges
                  and viva questions
                </ListItem>
                <ListItem>
                  Set up automated assessment schedules with flexible timing
                  options
                </ListItem>
                <ListItem>Add testcases for automated evaluation</ListItem>
                <ListItem>
                  Review detailed performance analytics and provide targeted
                  feedback to students
                </ListItem>
              </ol>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
