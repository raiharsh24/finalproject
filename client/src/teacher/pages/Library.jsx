import React from 'react';
import CourseCard from '../components/CourseCard';
import { courses } from '../data/library';

export default function Library() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}
