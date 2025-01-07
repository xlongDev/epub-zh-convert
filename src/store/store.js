import create from 'zustand';

const useStore = create((set) => ({
  files: [],
  setFiles: (files) => set({ files }),
  isFileSelected: false,
  setIsFileSelected: (isFileSelected) => set({ isFileSelected }),
}));

export default useStore;