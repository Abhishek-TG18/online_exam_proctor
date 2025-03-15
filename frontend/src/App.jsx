import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Landing } from "./pages/Landing";
import { UserDashBoard } from "./pages/UserDashBoard";
import { Tests } from "./pages/Tests";
import { Test } from "./pages/Test";
import { CodeEditor } from "./pages/CodeEditor";
import { Viva } from "./pages/Viva";
import { TestResult } from "./pages/TestResult";
import { Results } from "./pages/Results";
import AuthPage from "./pages/AuthPage";
import { AdminDashBoard } from "./pages/AdminDashBoard";
import ScheduleTest from "./pages/ScheduleTest";
import CreateCourse from "./pages/CreateCourse";
import { Evaluate } from "./pages/Evaluate";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/dashboard" element={<UserDashBoard />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/test/:id" element={<Test />} />
          <Route path="/question/:id" element={<CodeEditor />} />
          <Route path="/viva/:id" element={<Viva />} />
          <Route path="/result/:id" element={<TestResult />} />
          <Route path="/results" element={<Results />} />
          <Route path="/admin/dashboard" element={<AdminDashBoard />} />
          <Route path="/admin/tests" element={<ScheduleTest />} />
          <Route path="/admin/course" element={<CreateCourse />} />
          <Route path="/admin/evaluate" element={<Evaluate />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
