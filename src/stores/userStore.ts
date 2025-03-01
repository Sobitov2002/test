import { defineStore } from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
      count: 2,
      currentRole: localStorage.getItem('role') || 'general',
      userInfo: null
    }),
    actions: {
      setUserInfo(data: any) {
        this.userInfo = data
      },
      setCurrentRole(role: string) {
        this.currentRole = role
      }
    },
    getters: {
      doubleCount(state) {
        return state.count * 2
      },
      doublePlusOne(): number {
        return this.doubleCount + 1
      },

      getUserInfo(state) {
        return state.userInfo
      }
    },
})