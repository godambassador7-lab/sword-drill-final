import ComprehensiveCourse from './ComprehensiveCourse';
import worldReligionsCourse from '../data/courses/worldReligions';

const WorldReligionsCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => (
  <ComprehensiveCourse
    courseData={worldReligionsCourse}
    progressKey="worldReligionsProgress"
    onCompleteCourseId="worldReligions"
    onComplete={onComplete}
    onCancel={onCancel}
    userId={userId}
    userData={userData}
    setUserData={setUserData}
  />
);

export default WorldReligionsCourse;
