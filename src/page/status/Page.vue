<script setup lang="ts">
import { CreditCard, UserCheck, UserX } from 'lucide-vue-next'

import router from '@/router';

import { studentActive, studentInActive, studentDebt, studentGraduated } from './service'
import { computed, ref, onMounted } from 'vue'


const status = ref({ count: 0 })
const isLoading = ref(true)


const activeCount = ref()
const inactiveCount = ref()
const debtStudent = ref()
const gradut = ref()
onMounted(async () => {
    try {
        const active = await studentActive();
        const debt = await studentDebt();
        const inactive = await studentInActive();
        const gratuated = await studentGraduated()

        activeCount.value = active.length;
        debtStudent.value = debt.length
        inactiveCount.value = inactive.length; 
        gradut.value = gratuated.length;

        console.log("sa", debtStudent);
        

     
        



    } catch (error) {
        console.error('Xatolik:', error);
    } finally {
        isLoading.value = false;
    }
});

const nextActive = () => router.push('/status/active');
const nextInActive = () => router.push('/status/inactive');
const nextBedit = () => router.push('/status/debit');
const GraaduatedStudent = () => router.push('/status/gradeated');




</script>

<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div @click="nextActive()"
            class="flex flex-col items-center justify-center rounded-lg bg-slate-800 p-6 text-white shadow-md">
            <div class="mb-4 rounded-full bg-slate-950 p-3">
                <UserCheck class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-bold">Faol O'quvchilar</h3>
            <span v-if="isLoading">Loading...</span>
            <p class="mt-2 text-3xl font-bold">{{ activeCount }}</p>
        </div>


        <div @click="nextBedit()"
            class="flex flex-col items-center justify-center rounded-lg bg-slate-800 p-6 text-white shadow-md">
            <div class="mb-4 rounded-full bg-slate-950 p-3">
                <CreditCard class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-medium">Qarzdor o'quvchilar</h3>
            <p class="mt-2 text-lg font-bold">
                <span v-if="isLoading">Loading...</span>
                <span class="mt-2 text-3xl font-bold" v-else>{{ debtStudent }}</span>
            </p>
        </div>
        
        <div @click="nextInActive()"
            class="flex flex-col items-center justify-center rounded-lg bg-slate-800 p-6 text-white shadow-md">
            <div class="mb-4 rounded-full bg-slate-950 p-3">
                <UserX class="h-6 w-6" />
            </div>
            <h3 class="text-lg  font-bold">No Faol o'quvchilar</h3>
            <span v-if="isLoading">Loading...</span>
            <p class="mt-2 text-3xl font-bold">{{ inactiveCount }}</p>
        </div>
        <div @click="GraaduatedStudent()"
            class="flex flex-col items-center justify-center rounded-lg bg-slate-800 p-6 text-white shadow-md">
            <div class="mb-4 rounded-full bg-slate-950 p-3">
                <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                </svg>
            </div>
            <h3 class="text-lg font-medium">Bitirgan o'quvchilar</h3>
            <p class="mt-2 text-lg font-bold">
                <span v-if="isLoading">Loading...</span>
                <span class="mt-2 text-3xl font-bold" v-else> {{ gradut }}</span>
            </p>
        </div>


    </div>
</template>