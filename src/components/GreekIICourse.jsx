import React from 'react';
import ComprehensiveCourse from './ComprehensiveCourse';
import courseData from '../data/courses/greekII';

const GreekIICourse = ({ onComplete, onCancel, userId, userData, setUserData }) => (
  <ComprehensiveCourse
    courseData={courseData}
    progressKey="greekIIProgress"
    onCompleteCourseId="greekII"
    onComplete={onComplete}
    onCancel={onCancel}
    userId={userId}
    userData={userData}
    setUserData={setUserData}
  />
);

export default GreekIICourse;
