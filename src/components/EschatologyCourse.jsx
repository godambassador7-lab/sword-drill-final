import React from 'react';
import ComprehensiveCourse from './ComprehensiveCourse';
import courseData from '../data/courses/eschatology';

const EschatologyCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => (
  <ComprehensiveCourse
    courseData={courseData}
    progressKey="eschatologyProgress"
    onCompleteCourseId="eschatology"
    onComplete={onComplete}
    onCancel={onCancel}
    userId={userId}
    userData={userData}
    setUserData={setUserData}
  />
);

export default EschatologyCourse;
