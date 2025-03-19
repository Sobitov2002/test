import { defineStore } from 'pinia'

export const useDateStore = defineStore('dateStore', {
  state: () => ({
    startDate: '',  
    endDate: ''     
  }),
  actions: {
    setStartDate(date: string) {
      this.startDate = date
    },
    setEndDate(date: string) {
      this.endDate = date
    }
  }
})
