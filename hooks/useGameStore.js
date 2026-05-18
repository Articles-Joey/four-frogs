"use client"
import { createWithEqualityFn as create } from 'zustand/traditional'

export const useGameStore = create((set, get, store) => ({

    gameState: {},
    setGameState: (newValue) => {
        set((prev) => ({
            gameState: newValue
        }))
    },

    reset: () => {

        // set((prev) => ({
        //     obstacles: [],
        //     gameOver: 0,
        //     distance: 0,
        // }))

        // const { generateInitialObstacles } = get();

        // generateInitialObstacles()

    }

}))