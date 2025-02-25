// src/services/sessionsService.js

import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Adjust the path as needed

/**
 * Creates a new session document in the "sessions" collection.
 *
 * @param {string} userId - The Firebase Auth UID of the user.
 * @param {string} mode - The session mode (e.g., "free-for-all", "set-amount").
 * @returns {Promise<string>} The generated session document ID.
 */
export async function createSession(userId, mode) {
  try {
    const sessionData = {
      userId: userId,              // Firebase UID
      mode: mode,                  // e.g., "set-amount"
      startTime: serverTimestamp(),
      endTime: null,               // Will be updated when the session ends
      totalQuestions: 0,           // Aggregate data; update as needed
      correctAnswers: 0,           // Aggregate data; update as needed
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "sessions"), sessionData);
    console.log("Session created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

/**
 * Adds an interaction to the "interactions" subcollection of a session.
 *
 * @param {string} sessionId - The ID of the session document.
 * @param {object} interactionData - Data for the interaction.
 *   Expected fields:
 *     - questionId {string}
 *     - questionText {string}
 *     - answerProvided {string}
 *     - isCorrect {boolean}
 *     - responseTime {number} (in seconds)
 * @returns {Promise<string>} The generated interaction document ID.
 */
export async function addInteraction(sessionId, interactionData) {
  try {
    const sessionDocRef = doc(db, "sessions", sessionId);
    const interactionsCollectionRef = collection(sessionDocRef, "interactions");

    // Add a timestamp to the interaction
    interactionData.timestamp = serverTimestamp();

    const docRef = await addDoc(interactionsCollectionRef, interactionData);
    console.log("Interaction added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding interaction:", error);
    throw error;
  }
}

/**
 * Ends a session by updating aggregate metrics and setting the end time.
 *
 * @param {string} sessionId - The ID of the session document.
 * @param {number} totalQuestions - Total number of questions answered in the session.
 * @param {number} correctAnswers - Total number of correctly answered questions.
 * @returns {Promise<void>}
 */
export async function endSession(sessionId, totalQuestions, correctAnswers) {
  try {
    const sessionDocRef = doc(db, "sessions", sessionId);
    await updateDoc(sessionDocRef, {
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      endTime: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Session ended for ID:", sessionId);
  } catch (error) {
    console.error("Error ending session:", error);
    throw error;
  }
}
