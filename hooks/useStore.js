import theme from '@/theme'
import { create } from 'zustand'
// import { createWithEqualityFn as create } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get) => ({

      // rehydrated: false,
      // setRehydrated: (value) => set({ rehydrated: value }),

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },

      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      theme: null,
      setTheme: (theme) => set({ theme }),

      nickname: '',
      setNickname: (nickname) => set({ nickname }),

      renderMode: '3D',
      setRenderMode: (mode) => set({ renderMode: mode }),

      showCreditsModal: false,
      setShowCreditsModal: (value) => set({ showCreditsModal: value }),

      showInfoModal: false,
      setShowInfoModal: (value) => set({ showInfoModal: value }),

      showSettingsModal: false,
      setShowSettingsModal: (value) => set({ showSettingsModal: value }),

      showInviteModal: false,
      setShowInviteModal: (value) => set({ showInviteModal: value }),

      touchControlsEnabled: false,
      setTouchControlsEnabled: (value) => set({ touchControlsEnabled: value }),

      cameraShakeEnabled: true,
      setCameraShakeEnabled: (value) => set({ cameraShakeEnabled: value }),

      gameState: {
        status: null,
        insectTrack: [],
        powerups: [],
        bugs: [],
      },
      setGameState: (gameState) => set({ gameState }),

      debug: false,
      toggleDebug: () => set({ debug: !get().debug }),

      debugTab: 'Players',
      setDebugTab: (tab) => set({ debugTab: tab }),

      devDebugPanel: false,
      setDevDebugPanel: (value) => set({ devDebugPanel: value }),

    }),
    {
      name: 'four-frogs-storage', // name of the item in the storage (must be unique)
      version: 1,
      // onRehydrateStorage: () => (state) => {

      //   console.log('Rehydrated state:', state)

      //   if (state) {
      //     // setRehydrated(true)
      //     set({ rehydrated: true })
      //     return
      //   }

      // },
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
      partialize: (state) => ({
        darkMode: state.darkMode,
        theme: state.theme,
        nickname: state.nickname,
        renderMode: state.renderMode,

        touchControlsEnabled: state.touchControlsEnabled,
        cameraShakeEnabled: state.cameraShakeEnabled,

        debug: state.debug,
        devDebugPanel: state.devDebugPanel,
        debugTab: state.debugTab,
      }),
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)