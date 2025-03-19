<script setup lang="ts">
import { getAllExpence } from './service.ts'
import { ref , onMounted , computed } from 'vue'
import api from '@/service/apiService';


const expenses = ref<any[]>([]);
const selectedFilter = ref("");
onMounted(async () =>{
    try {
        expenses.value = await getAllExpence();
        console.log(expenses.value);
        
    } catch (error) {
        console.log(error);
    }
})


const deleteExpense = async (id: number) => {
    try {
        await api.delete(`/expense/delete?ident=${id}`);
        console.log("O'chirildi", id);
        expenses.value = expenses.value.filter(expense => expense.id !== id);
        return getAllExpence()
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
};
const filterExpence = computed(() => {
    if (!selectedFilter.value) {
        return expenses.value; 
    }
    return expenses.value.filter(expense => expense.payment_type === selectedFilter.value);
});


</script>

<template >
    <div class="p-4 rounded-md max-w-[1400px] mx-auto"
        style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
        <div class="flex justify-between border-b border-gray-600 mb-4">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-gray-700 dark:text-white">Xarajatlar</h3>
                <p class="text-sm text-white text-muted-foreground">Barcha xarajatlar</p>
            </div>
            <div class="flex gap-2 items-center justify-center">
                <select class="bg-slate-900 text-white p-2 py-3 text-md rounded-md" v-model="selectedFilter">
                    <option value="">Hammasi</option>
                    <option value="click">Click</option>
                    <option value="cash">Cash</option>
                </select>
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md text-md ">+
                    Qo'shish</button>
            </div>

        </div>
        <table
            style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
            class="w-full max-xl:min-w-[550px] text-sm shadow-md sm:rounded-lg overflow-hidden text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase">
                <tr>
                    <th scope="col" class="px-2 text-white py-3 md:px-6">
                        O'qituvchilar ma'lumotlari
                    </th>
                    <th scope="col" class="px-1 text-white py-3">
                        Sana
                    </th>
                    <th scope="col" class="px-1 text-white py-3">
                        Summa
                    </th>
                    <th scope="col" class="px-0 text-white py-3 max-md:hidden">
                       To'lov turi
                    </th>
                    <th scope="col" class="px-2 text-white py-3 w-[80px]">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in filterExpence " :key="index"
                    class="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 bg-blue-950 text-gray-900 dark:text-white">
                    <th class="px-2 py-2 md:px-6 flex items-center gap-2">
                        <img class="w-14 h-14 rounded-[50%] border border-white"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                            alt=""> {{ item.category }}
                    </th>
                    <td class="px-1 py-4 ">
                        {{ item.date }}
                    </td>
                    
                    <td class="px-1 py-4">
                        {{ item.amount }}
                    </td>
                    <td class="px-0 py-4 max-md:hidden">
                        <div class="flex items-center">
                            <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"> </div> {{ item.payment_type }}
                        </div>
                    </td>
                    <td class="px-2 py-4 relative">
                        <div class="flex gap-3 h-[18px]">
                            <!-- Delete -->
                            <span @click="deleteExpense(item.id)" class="cursor-pointer">
                                <img src="../../assets/icon/trash.svg" alt="delete_icon" class="w-5 h-5 cursor-pointer">
                            </span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
