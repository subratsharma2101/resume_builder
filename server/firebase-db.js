// Firebase Admin SDK Configuration for Server
import admin from 'firebase-admin';

// Initialize Firebase Admin with service account
// For production, use environment variables
const firebaseConfig = {
    projectId: "resume-builder-bba65",
    // Note: In production, set GOOGLE_APPLICATION_CREDENTIALS environment variable
    // or use service account JSON
};

// Initialize only if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: firebaseConfig.projectId
    });
}

const db = admin.firestore();

// ============================================
// DATABASE OPERATIONS
// ============================================

// Save Resume
export const saveResume = async (userId, resumeData) => {
    try {
        const docRef = db.collection('resumes').doc(userId);
        await docRef.set({
            ...resumeData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        return { success: true, id: userId };
    } catch (error) {
        console.error('Error saving resume:', error);
        throw error;
    }
};

// Get Resume
export const getResume = async (userId) => {
    try {
        const doc = await db.collection('resumes').doc(userId).get();
        if (doc.exists) {
            return { success: true, data: doc.data() };
        }
        return { success: false, message: 'Resume not found' };
    } catch (error) {
        console.error('Error getting resume:', error);
        throw error;
    }
};

// Save Cover Letter
export const saveCoverLetter = async (userId, coverLetterData) => {
    try {
        const docRef = db.collection('coverLetters').doc();
        await docRef.set({
            userId,
            ...coverLetterData,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error saving cover letter:', error);
        throw error;
    }
};

// Get User's Cover Letters
export const getCoverLetters = async (userId) => {
    try {
        const snapshot = await db.collection('coverLetters')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();

        const letters = [];
        snapshot.forEach(doc => {
            letters.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: letters };
    } catch (error) {
        console.error('Error getting cover letters:', error);
        throw error;
    }
};

// Save ATS Analysis
export const saveATSAnalysis = async (userId, analysisData) => {
    try {
        const docRef = db.collection('atsAnalyses').doc();
        await docRef.set({
            userId,
            ...analysisData,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error saving ATS analysis:', error);
        throw error;
    }
};

// User Profile
export const saveUserProfile = async (userId, profileData) => {
    try {
        const docRef = db.collection('users').doc(userId);
        await docRef.set({
            ...profileData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            return { success: true, data: doc.data() };
        }
        return { success: false, message: 'User not found' };
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

export { db, admin };
