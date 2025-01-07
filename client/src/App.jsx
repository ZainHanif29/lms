import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/login";
import MainLayout from "./Layout/MainLayout";
import HeroSection from "./pages/student/HeroSection";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";

const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroSection />
              <Courses />
            </>
          ),
        },
        {
          path: "/my-learning",
          element: <MyLearning />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        // Admin routes start from here
        {
          path: "admin",
          element: <Sidebar />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "course",
              element: <CourseTable />,
            },
            {
              path: "course/create",
              element: <AddCourse />,
            },
            {
              path: "course/:courseId",
              element: <EditCourse />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
};

export default App;
