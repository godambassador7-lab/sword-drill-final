import React from 'react';
import ComprehensiveCourse from './ComprehensiveCourse';
import courseData from '../data/courses/demonology';

const DemonologyCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => (
  <ComprehensiveCourse
    courseData={courseData}
    progressKey="demonologyProgress"
    onCompleteCourseId="demonology"
    onComplete={onComplete}
    onCancel={onCancel}
    userId={userId}
    userData={userData}
    setUserData={setUserData}
  />
);

export default DemonologyCourse;
