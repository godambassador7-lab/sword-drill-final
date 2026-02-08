import React from 'react';
import ComprehensiveCourse from './ComprehensiveCourse';
import courseData from '../data/courses/biblicalHermeneutics';

const BiblicalHermeneuticsCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => (
  <ComprehensiveCourse
    courseData={courseData}
    progressKey="biblicalHermeneuticsProgress"
    onCompleteCourseId="biblicalHermeneutics"
    onComplete={onComplete}
    onCancel={onCancel}
    userId={userId}
    userData={userData}
    setUserData={setUserData}
  />
);

export default BiblicalHermeneuticsCourse;
