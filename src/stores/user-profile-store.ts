import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserPersonalInfo = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ligne1: string;
  ligne2: string;
  codePostal: string;
  ville: string;
  pays: string;
  /** State / province (profile & checkout). */
  region: string;
};

const emptyProfile: UserPersonalInfo = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  ligne1: "",
  ligne2: "",
  codePostal: "",
  ville: "",
  pays: "",
  region: "",
};

function normalizePersonal(p: Partial<UserPersonalInfo>): UserPersonalInfo {
  return {
    ...emptyProfile,
    ...p,
    region: typeof p.region === "string" ? p.region : "",
  };
}

type UserProfileState = {
  personal: UserPersonalInfo;
  setPersonal: (partial: Partial<UserPersonalInfo>) => void;
  resetPersonal: () => void;
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      personal: { ...emptyProfile },
      setPersonal: (partial) =>
        set((s) => ({
          personal: normalizePersonal({ ...s.personal, ...partial }),
        })),
      resetPersonal: () => set({ personal: { ...emptyProfile } }),
    }),
    {
      name: "gaviom-user-profile",
      partialize: (s) => ({ personal: s.personal }),
      merge: (persisted, current) => ({
        ...current,
        personal: normalizePersonal({
          ...(persisted as UserProfileState)?.personal,
        }),
      }),
    }
  )
);
