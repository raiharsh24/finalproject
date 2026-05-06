import React from 'react';

export default function CourseCard({ course }) {
  return (
    <div className="bg-card-bg rounded-lg shadow p-4 flex flex-col">
      <div className="h-32 bg-gradient-to-r from-indigo-200 to-purple-200 rounded mb-3" />
      <h3 className="font-medium text-lg mb-1">{course.title}</h3>
      <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mb-2 inline-block">{course.subject}</span>
      <p className="text-sm text-gray-600">{course.students} students</p>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">{course.progress}% completed</p>
    </div>
  );
}
