import React from 'react';
import ComprehensiveCourse from './ComprehensiveCourse';
import courseData from '../data/courses/argumentation';

const ArgumentationCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => (
  <ComprehensiveCourse
    courseData={courseData}
    progressKey="argumentationProgress"
    onCompleteCourseId="argumentation"
    onComplete={onComplete}
    onCancel={onCancel}
    userId={userId}
    userData={userData}
    setUserData={setUserData}
  />
);

export default ArgumentationCourse;
