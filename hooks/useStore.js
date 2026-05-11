import theme from '@/theme'
import { create } from 'zustand'
// import { createWithEqualityFn as create } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

import typicalZustandStoreExcludes from '@articles-media/articles-dev-box/typicalZustandStoreExcludes';
import typicalZustandStoreStateSlice from '@articles-media/articles-dev-box/typicalZustandStoreStateSlice';

import randomNicknameConfig from '@/util/randomNicknameConfig';

export const useStore = create()(
  persist(
    (set, get) => ({

      ...typicalZustandStoreStateSlice(
        set,
        get,
        randomNicknameConfig,
      ),

      // rehydrated: false,
      // setRehydrated: (value) => set({ rehydrated: value }),

      // _hasHydrated: false,
      // setHasHydrated: (state) => {
      //   set({
      //     _hasHydrated: state
      //   });
      // },

      // darkMode: true,
      // toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      // theme: null,
      // setTheme: (theme) => set({ theme }),

      // nickname: '',
      // setNickname: (nickname) => set({ nickname }),

      renderMode: '3D',
      setRenderMode: (mode) => set({ renderMode: mode }),

      // showCreditsModal: false,
      // setShowCreditsModal: (value) => set({ showCreditsModal: value }),

      // showInfoModal: false,
      // setShowInfoModal: (value) => set({ showInfoModal: value }),

      // showSettingsModal: false,
      // setShowSettingsModal: (value) => set({ showSettingsModal: value }),

      // showInviteModal: false,
      // setShowInviteModal: (value) => set({ showInviteModal: value }),

      touchControlsEnabled: false,
      setTouchControlsEnabled: (value) => set({ touchControlsEnabled: value }),

      cameraShakeEnabled: true,
      setCameraShakeEnabled: (value) => set({ cameraShakeEnabled: value }),

      cameraLocked: false,
      setCameraLocked: (value) => set({ cameraLocked: value }),

      gameState: {
        status: null,
        insectTrack: [],
        powerups: [],
        bugs: [],
      },
      setGameState: (gameState) => set({ gameState }),

      // debug: false,
      // toggleDebug: () => set({ debug: !get().debug }),

      debugTab: 'Players',
      setDebugTab: (tab) => set({ debugTab: tab }),

      devDebugPanel: false,
      setDevDebugPanel: (value) => set({ devDebugPanel: value }),

    }),
    {
      name: `${process.env.NEXT_PUBLIC_GAME_KEY}-site-storage`,
      version: 2,
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true)
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![
            ...typicalZustandStoreExcludes,
          ].includes(key))
        ),
    },
  ),
)