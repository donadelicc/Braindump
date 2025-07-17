import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

export interface SessionData {
  name: string;
  description: string;
  objective: string;
}

export interface CategoryOutput {
  title: string;
  description: string;
  insights: string[];
}

export interface BrainstormingOutput {
  summary: string;
  categories: CategoryOutput[];
  keyTakeaways?: string[];
}

export interface SavedSession {
  id: string;
  userId: string;
  sessionData: SessionData;
  structuredOutput: BrainstormingOutput;
  transcription: string;
  createdAt: Date;
  updatedAt: Date;
}

export const sessionService = {
  async saveSession(
    userId: string,
    sessionData: SessionData,
    structuredOutput: BrainstormingOutput,
    transcription: string,
  ): Promise<string> {
    try {
      const sessionToSave = {
        userId,
        sessionData,
        structuredOutput,
        transcription,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "sessions"), sessionToSave);
      return docRef.id;
    } catch (error) {
      console.error("Error saving session:", error);
      throw new Error("Failed to save session");
    }
  },

  async getUserSessions(userId: string): Promise<SavedSession[]> {
    try {
      const q = query(
        collection(db, "sessions"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
      );

      const querySnapshot = await getDocs(q);
      const sessions: SavedSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          userId: data.userId,
          sessionData: data.sessionData,
          structuredOutput: data.structuredOutput,
          transcription: data.transcription,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        });
      });

      return sessions;
    } catch (error) {
      console.error("Error getting user sessions:", error);
      throw new Error("Failed to load sessions");
    }
  },

  async deleteSession(sessionId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "sessions", sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
      throw new Error("Failed to delete session");
    }
  },
};
