import { Button } from "@/components/ui/button";
import React from "react";

const CourseProgress = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Display course name */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Course Title</h1>
        <Button>Completed</Button>
      </div>
      {/*  */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:3/5 h-fit rounded-lg shadow-lg p-4">
          {/* Video Section */}
          <div>{/* <video src=""></video> */}</div>
          {/* Display current watching lecture title */}
          <div className="mt-2">
            <h3 className="font-medium text-lg">Lecture-1: Introduction </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
