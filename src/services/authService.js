import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const signUp = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      createdAt: new Date(),
      selectedTranslation: 'KJV',
      includeApocrypha: false
    });
    
    // Initialize user progress
    await setDoc(doc(db, 'userProgress', user.uid), {
      versesMemorized: [],
      quizzesCompleted: 0,
      currentStreak: 0,
      lastActiveDate: new Date(),
      totalPoints: 0,
      achievements: [],
      quizHistory: []
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName || '',
        email: user.email,
        createdAt: new Date(),
        selectedTranslation: 'KJV',
        includeApocrypha: false
      });
    }

    const progressDocRef = doc(db, 'userProgress', user.uid);
    const progressDoc = await getDoc(progressDocRef);

    if (!progressDoc.exists()) {
      await setDoc(progressDocRef, {
        versesMemorized: [],
        quizzesCompleted: 0,
        currentStreak: 0,
        lastActiveDate: new Date(),
        totalPoints: 0,
        achievements: [],
        quizHistory: []
      });
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
