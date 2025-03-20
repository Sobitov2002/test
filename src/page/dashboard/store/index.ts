import { defineStore } from 'pinia'

function getCurrentMonthStartEnd() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]; // Oy boshi
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]; // Oy oxiri
  return { startOfMonth, endOfMonth };
}

export const useDateStore = defineStore('dateStore', {
  state: () => {
    const { startOfMonth, endOfMonth } = getCurrentMonthStartEnd();
    return {
      startDate: startOfMonth,  
      endDate: endOfMonth     
    };
  },
  getters: {
    getStartDate: (state) => state.startDate || getCurrentMonthStartEnd().startOfMonth,
    getEndDate: (state) => state.endDate || getCurrentMonthStartEnd().endOfMonth
  },
  actions: {
    setStartDate(date: string) {
      this.startDate = date || getCurrentMonthStartEnd().startOfMonth;
    },
    setEndDate(date: string) {
      this.endDate = date || getCurrentMonthStartEnd().endOfMonth;
    }
  }
});
