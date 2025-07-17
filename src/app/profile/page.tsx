"use client";

import { useAuth } from "../../contexts/AuthContext";
import { sessionService, SavedSession } from "../../lib/sessionService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [sessionsError, setSessionsError] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;

      try {
        setIsLoadingSessions(true);
        setSessionsError("");
        const userSessions = await sessionService.getUserSessions(user.uid);
        setSessions(userSessions);
      } catch (err) {
        console.error("Error loading sessions:", err);
        setSessionsError("Kunne ikke laste økter. Prøv igjen.");
      } finally {
        setIsLoadingSessions(false);
      }
    };

    if (user) {
      loadSessions();
    }
  }, [user]);

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Er du sikker på at du vil slette denne økten?")) {
      return;
    }

    try {
      await sessionService.deleteSession(sessionId);
      setSessions(sessions.filter((session) => session.id !== sessionId));
    } catch (err) {
      console.error("Error deleting session:", err);
      alert("Kunne ikke slette økt. Prøv igjen.");
    }
  };

  const handleNewSession = () => {
    router.push("/brain-dump");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Profile Section */}
        <div className="p-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4 mb-6">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xl">👤</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.displayName || "User"}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Sessions Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mine DUMPS</h2>
            <button
              onClick={handleNewSession}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              +
            </button>
          </div>

          {sessionsError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{sessionsError}</p>
            </div>
          )}

          {isLoadingSessions ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Laster DUMPS...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg mb-4">
                Du har ingen lagrede DUMPS ennå.
              </div>
              <button
                onClick={handleNewSession}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Start din første DUMP
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {session.sessionData.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-1">
                        {session.sessionData.description}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        <strong>Mål:</strong> {session.sessionData.objective}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.createdAt.toLocaleDateString()}{" "}
                        {session.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Slett økt"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="border-t pt-3">
                    <div className="mb-3">
                      <p className="text-gray-700 text-sm">
                        <strong>Sammendrag:</strong>{" "}
                        {session.structuredOutput.summary}
                      </p>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>
                          Kategorier (
                          {session.structuredOutput.categories.length}):
                        </strong>
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {session.structuredOutput.categories.map(
                          (category, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {category.title}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    <details className="text-sm">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                        Vis alle innsikter
                      </summary>
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <div className="space-y-2">
                          {session.structuredOutput.categories.map(
                            (category, index) => (
                              <div key={index}>
                                <h4 className="font-medium text-gray-800">
                                  {category.title}
                                </h4>
                                <p className="text-gray-600 mb-1">
                                  {category.description}
                                </p>
                                <ul className="text-gray-700 space-y-1">
                                  {category.insights.map(
                                    (insight, insightIndex) => (
                                      <li
                                        key={insightIndex}
                                        className="flex items-start"
                                      >
                                        <span className="text-blue-500 mr-1">
                                          •
                                        </span>
                                        {insight}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
