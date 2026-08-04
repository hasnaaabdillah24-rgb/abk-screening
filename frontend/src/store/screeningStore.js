import { create } from 'zustand';

const useScreeningStore = create((set) => ({
  session: null,
  currentQuestion: null,
  responses: [],
  setSession: (session) => set({ session }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  addResponse: (response) => set((state) => ({
    responses: [...state.responses, response],
  })),
  resetScreening: () => set({ session: null, currentQuestion: null, responses: [] }),
}));

export { useScreeningStore };