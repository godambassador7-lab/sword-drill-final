import React from 'react';
import ComprehensiveCourse from './ComprehensiveCourse';
import courseData from '../data/courses/hebrewII';

const HebrewIICourse = ({ onComplete, onCancel, userId, userData, setUserData }) => (
  <ComprehensiveCourse
    courseData={courseData}
    progressKey="hebrewIIProgress"
    onCompleteCourseId="hebrewII"
    onComplete={onComplete}
    onCancel={onCancel}
    userId={userId}
    userData={userData}
    setUserData={setUserData}
  />
);

export default HebrewIICourse;
