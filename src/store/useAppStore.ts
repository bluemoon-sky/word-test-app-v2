import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { calculateNextState } from '../services/srsLogic';
import { RewardRequest, StudySession, UserProfile, UserWordState } from '../types';

// Use AsyncStorage for React Native / Web compatibility in Expo
// Note: You need to install @react-native-async-storage/async-storage if not present.
// For pure web MVP without extra install, we can use localStorage directly if running on web, 
// but Zustand's storage needs an adapter.
// I'll stick to a simple wrapper or just localStorage if I'm sure it's web.
// But prompt said "App: React Native".
// Let's assume standard localStorage is fine for "Web Version Only" request.

interface AppState {
    profile: UserProfile;
    wordStates: Record<string, UserWordState>; // Key: wordId
    rewardRequests: RewardRequest[];
    sessions: StudySession[];

    // Actions
    addTokens: (amount: number) => void;
    reviewWord: (wordId: string, quality: number) => void;
    requestReward: (rewardId: string, cost: number) => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            profile: {
                userId: 'student-1',
                dailyGoalMinutes: 20,
                dailyGoalWords: 30,
                tokens: 100,
                xp: 0,
                streakDays: 1,
                grade: 'Middle 2'
            },
            wordStates: {},
            rewardRequests: [],
            sessions: [],

            addTokens: (amount) => set((state) => ({
                profile: { ...state.profile, tokens: state.profile.tokens + amount }
            })),

            reviewWord: (wordId, quality) => set((state) => {
                const current = state.wordStates[wordId];
                const next = calculateNextState(current, quality);

                // Update Stats
                const earnedTokens = quality >= 3 ? 1 : 0;
                const newTokens = state.profile.tokens + earnedTokens;
                const newXp = state.profile.xp + (quality * 2);

                // Update User State
                const newState = {
                    userId: state.profile.userId,
                    wordId,
                    ...current, // retain unchecked fields if any
                    ...next
                } as UserWordState;

                return {
                    wordStates: { ...state.wordStates, [wordId]: newState },
                    profile: { ...state.profile, tokens: newTokens, xp: newXp }
                };
            }),

            requestReward: (rewardId, cost) => set((state) => {
                if (state.profile.tokens < cost) return state;
                const newRequest: RewardRequest = {
                    id: Date.now().toString(),
                    userId: state.profile.userId,
                    rewardId,
                    status: 'pending', // or 'approved' if auto-approve logic
                    requestDate: Date.now()
                };
                return {
                    profile: { ...state.profile, tokens: state.profile.tokens - cost },
                    rewardRequests: [...state.rewardRequests, newRequest]
                };
            }),

            updateProfile: (updates) => set((state) => ({
                profile: { ...state.profile, ...updates }
            })),
        }),
        {
            name: 'word-app-storage',
            storage: createJSONStorage(() => localStorage), // Native Web Storage
        }
    )
);
