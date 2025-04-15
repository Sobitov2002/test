<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { studentGraduated } from '../service'


const activeCount = ref<any[]>([])

const searchQuery = ref('')

onMounted(async () => {
    try {
        const response = await studentGraduated()
        activeCount.value = response
        console.log(activeCount.value)
    } catch (error) {
        console.error(error)
    }
})


const filteredStudents = computed(() => {
    if (!searchQuery.value) {
        return activeCount.value
    }
    return activeCount.value.filter((student) =>
        student.full_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})
</script>
<template>

    <transition name="fade">
    </transition>


    <div
        class="p-6 rounded-xl w-full mx-auto bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl border border-slate-700">

        <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-700">
            <div>
                <h3 class="text-2xl md:text-3xl font-bold text-white">Bitirgan O'quvchilar</h3>
            </div>
            <div class="relative w-full sm:w-auto">
                <input v-model="searchQuery" type="text" placeholder="Qidirish..."
                    class="bg-[#111633] text-white px-4 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10" />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>

        <!-- Loading State -->
        <!-- <div  class="flex justify-center items-center py-20">
            <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div> -->

        <!-- Students Table - 100% width with horizontal scroll -->
        <div class="w-full rounded-xl border border-slate-700 shadow-lg overflow-hidden">

            <div class="table-scroll-container">
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-800 text-slate-300 uppercase text-xs tracking-wider">
                        <tr>
                            <th class="px-6 py-4 whitespace-nowrap">O'quvchilar</th>
                            <th class="px-6 py-4 text-center whitespace-nowrap">Telefon raqam</th>
                            <th class="px-6 py-4 text-center whitespace-nowrap hidden sm:block">Summa</th>

                            <th class="px-6 py-4 text-center whitespace-nowrap">Chegirma</th>
                            <th class="px-6 py-4 text-center whitespace-nowrap">Holat</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-700">
                        <tr v-for="(item, index) in filteredStudents"
                            class="bg-slate-800/30 hover:bg-slate-700/50 transition-colors text-white">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden hidden lg:block border border-slate-600">
                                        <img class="w-full h-full object-cover"
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                                            alt="" />
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ item.full_name }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-slate-300 text-center whitespace-nowrap  ">{{ item.phone_number }}
                            </td>
                            <td class="px-6 py-4 text-slate-300 text-center whitespace-nowrap hidden sm:block">{{
                                item.payment_amount.toLocaleString() }}
                            </td>
                            <td class="px-6 py-4 text-slate-300 text-center whitespace-nowrap">
                                {{ item.discount }} %
                            </td>
                            <td class="px-6 py-4 text-slate-300 text-center whitespace-nowrap">{{ item.status }}
                            </td>

                        </tr>

                        <!-- Empty State -->
                        <tr>
                            <!-- <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-4 text-slate-600"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p class="text-lg font-medium">O'quvchilar topilmadi</p>
                                    <p class="mt-1">Hozircha o'quvchilar ro'yxati bo'sh</p>
                                </div>
                            </td> -->
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.table-scroll-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    position: relative;
    display: block;
}


.table-scroll-container::-webkit-scrollbar {
    height: 6px;
}

.table-scroll-container::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.2);
    border-radius: 10px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.5);
    border-radius: 10px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.7);
}


table {
    width: 100%;
    min-width: 100%;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;
}


.whitespace-nowrap {
    white-space: nowrap;
}

@media (max-width: 768px) {
    .table-scroll-container {
        width: 100%;
        max-width: 100vw;
    }

    table {
        min-width: 800px;

    }
}
</style>