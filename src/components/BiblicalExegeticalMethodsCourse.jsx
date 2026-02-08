import React from 'react';
import ComprehensiveCourse from './ComprehensiveCourse';
import courseData from '../data/courses/biblicalExegeticalMethods';

const BiblicalExegeticalMethodsCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => (
  <ComprehensiveCourse
    courseData={courseData}
    progressKey="biblicalExegeticalMethodsProgress"
    onCompleteCourseId="biblicalExegeticalMethods"
    onComplete={onComplete}
    onCancel={onCancel}
    userId={userId}
    userData={userData}
    setUserData={setUserData}
  />
);

export default BiblicalExegeticalMethodsCourse;
