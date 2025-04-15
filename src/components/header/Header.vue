<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useRoute, useRouter } from 'vue-router';
import RouteName from './_components/RouterName.vue';
import api from '@/service/apiService';

const sidebarStore = useSidebarStore();
const route = useRoute();
const router = useRouter();

const token = ref(localStorage.getItem('token') || null);

const loginHandler = () => {
    localStorage.setItem('token', 'user-token');
    token.value = 'user-token';
    router.push('/');
};

interface VisitorData {
    id?: number | string;
    full_name: string;
    visit_date: string;
    phone_number: string;
    secondary_phone: string;
    source: string;
    course: string;
    free_days: string[];
    free_times: string[];
    address: string;
    status: string;
    additional_info: string;
}

// Form data
const initialFormData: VisitorData = {
    full_name: '',
    visit_date: new Date().toISOString().split('T')[0],
    phone_number: '',
    secondary_phone: '',
    source: '',
    course: '',
    free_days: [],
    free_times: [],
    address: '',
    status: '',
    additional_info: ''
};

const formData = ref<VisitorData>({ ...initialFormData });
const showFormModal = ref(false);
const submitting = ref(false);
const editMode = ref(false);

const selectedMonth = ref(new Date().toISOString().slice(0, 7)); // Default to current month (YYYY-MM format)
const availableDays = [
    'Dushanba',
    'Seshanba',
    'Chorshanba',
    'Payshanba',
    'Juma',
    'Shanba',
    'Yakshanba',
    'Har kuni'
];

const availableTimes = [
    '8:00-10:00',
    '10:00-12:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00',
];

// List data
const visitors = ref<VisitorData[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const page = ref(1);
const itemsPerPage = 10;

// Delete modal
const showDeleteModal = ref(false);
const visitorToDelete = ref<VisitorData | null>(null);
const deleting = ref(false);

// Toast notification
const toast = ref({
    show: false,
    message: '',
    type: 'info'
});

// Filter visitors based on search query
const filteredVisitors = computed(() => {
    if (!searchQuery.value) return visitors.value;

    const query = searchQuery.value.toLowerCase();
    return visitors.value.filter(visitor =>
        visitor.full_name.toLowerCase().includes(query) ||
        visitor.phone_number.toLowerCase().includes(query) ||
        visitor.course?.toLowerCase().includes(query) ||
        visitor.status?.toLowerCase().includes(query)
    );
});

// Format date for display
const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
};

const handleMonthChange = () => {
    fetchVisitors();
};

// Fetch visitors from API
const fetchVisitors = async () => {
    loading.value = true;
    try {
        const [year, month] = selectedMonth.value.split('-');
        const response = await api.get(`/reception/get?year=${year}&month=${month}`);
        visitors.value = response.data;
        console.log(visitors.value);

        loading.value = false;
    } catch (error) {
        console.error('Error fetching visitors:', error);
        showToast('Failed to load visitors', 'error');
        loading.value = false;
    }
};

const openFormModal = () => {
    resetForm();
    editMode.value = false;
    showFormModal.value = true;
};

// Close form modal
const closeFormModal = () => {
    showFormModal.value = false;
};

// Reset form
const resetForm = () => {
    formData.value = { ...initialFormData };
    formData.value.visit_date = new Date().toISOString().split('T')[0];
};

const submitForm = async () => {
    submitting.value = true;

    try {
        let response;

        if (editMode.value && formData.value.id) {
            // Update visitor - modified to match server expectations
            // Include the ID in the request body as "ident"
            const updateData = {
                ...formData.value,
                ident: formData.value.id // Add ident field with the ID value
            };

            response = await api.put(`/reception/update`, updateData, {
                headers: { "Content-Type": "application/json" }
            });

            const index = visitors.value.findIndex(v => v.id === formData.value.id);
            if (index !== -1) {
                visitors.value[index] = { ...formData.value };
            }
            showToast('Visitor updated successfully', 'success');
        } else {
            // Create new visitor
            response = await api.post(`/reception/create`, formData.value, {
                headers: { "Content-Type": "application/json" }
            });

            if (response && response.data) {
                const newVisitor = {
                    ...formData.value,
                    id: response.data.id
                };
                visitors.value.push(newVisitor);
                showToast('Visitor added successfully', 'success');
            }
        }

        closeFormModal();
    } catch (error) {
        console.log("Error details:");
        showToast(editMode.value ? 'Failed to update visitor' : 'Failed to add visitor', 'error');
    } finally {
        submitting.value = false;
    }
};

// Show toast notification
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    toast.value = {
        show: true,
        message,
        type
    };

    setTimeout(() => {
        toast.value.show = false;
    }, 3000);
};

// Fetch visitors on component mount
onMounted(() => {
    fetchVisitors();
});

const getRouteName = computed(() => {
    return route.path === '/' ? 'Bosh Sahifa' : route.path.replace('/', '').replace(/-/g, ' ').toUpperCase();
});
</script>

<template>
    <header style="background: linear-gradient(100.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%);"
        class=" fixed bg-slate-950 w-full right-0 text-white py-4 px-6 flex items-center justify-between z-20">

        <div class="lg:hidden cursor-pointer" @click="sidebarStore.isOpen = !sidebarStore.isOpen">
            <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </div>

        <div class="grid grid-cols-1  bg-slate-900 items-center px-2 max-w-md ml-auto">
            <!-- Agar token bo'lsa chiqish tugmasi chiqadi -->
            <div class="flex justify-between gap-4">

                <div class="flex items-center space-x-2 ">
                    <button class="px-4 py-2 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-colors"
                        @click="openFormModal">
                        Qo'shish
                    </button>

                </div>
                <div v-if="token" @click="loginHandler" class="flex gap-2 items-center cursor-pointer">
                    <svg class="w-6 h-6 text-white dark:text-[#fff]" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                            d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                            clip-rule="evenodd" />
                    </svg>
                    <p class="text-white px-2 py-1">Chiqish</p>
                </div>

                <!-- Agar token bo'lmasa kirish tugmasi chiqadi -->
                <div v-else @click="loginHandler" class="flex gap-2 items-center cursor-pointer">
                    <svg class="w-6 h-6 text-white dark:text-[#fff]" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                            d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                            clip-rule="evenodd" />
                    </svg>
                    <p class="text-white px-2 py-1">Kirish</p>
                </div>
            </div>
        </div>
    </header>

    <div v-if="showFormModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"
                @click="closeFormModal"></div>

            <!-- Modal panel -->
            <div
                class="inline-block align-bottom bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div class="bg-gradient-to-r from-slate-900 to-slate-800 py-6 px-8">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-white">Reception </h1>
                        </div>
                        <button @click="closeFormModal" class="text-white hover:text-gray-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form @submit.prevent="submitForm" class="p-8">
                    <div class="space-y-6">
                        <!-- Personal Information -->
                        <div>
                            <h2 class="text-lg font-medium text-white border-b border-gray-700 pb-2">Personal
                                Information</h2>
                            <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div class="sm:col-span-2">
                                    <label for="full_name" class="block text-sm font-medium text-gray-300">Full
                                        Name</label>
                                    <input type="text" id="full_name" v-model="formData.full_name"
                                        class="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                        required />
                                </div>

                                <div>
                                    <label for="visit_date" class="block text-sm font-medium text-gray-300">Visit
                                        Date</label>
                                    <input type="date" id="visit_date" v-model="formData.visit_date"
                                        class="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                        required />
                                </div>

                                <div>
                                    <label for="phone_number" class="block text-sm font-medium text-gray-300">Phone
                                        Number</label>
                                    <input type="tel" id="phone_number" v-model="formData.phone_number"
                                        class="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                        required />
                                </div>

                                <div>
                                    <label for="secondary_phone"
                                        class="block text-sm font-medium text-gray-300">Secondary Phone</label>
                                    <input type="tel" id="secondary_phone" v-model="formData.secondary_phone"
                                        class="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                                </div>

                                <div>
                                    <label for="source" class="block text-sm font-medium text-gray-300">Source</label>
                                    <input type="text" id="source" v-model="formData.source"
                                        class="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                                </div>

                                <div>
                                    <label for="course" class="block text-sm font-medium text-gray-300">Course</label>
                                    <input type="text" id="course" v-model="formData.course"
                                        class="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                                </div>

                                <div class="sm:col-span-2">
                                    <label for="address" class="block text-sm font-medium text-gray-300">Address</label>
                                    <input type="text" id="address" v-model="formData.address"
                                        class="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                                </div>
                            </div>
                        </div>

                        <!-- Availability -->
                        <div>
                            <h2 class="text-lg font-medium text-white border-b border-gray-700 pb-2">Availability
                            </h2>

                            <div class="mt-4">
                                <label class="block text-sm font-medium text-gray-300 mb-2">Free Days</label>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    <div v-for="day in availableDays" :key="day" class="flex items-center">
                                        <input type="checkbox" :id="day" :value="day" v-model="formData.free_days"
                                            class="h-4 w-4 p-2 text-teal-600 focus:ring-teal-500 border-gray-600 rounded bg-slate-700" />
                                        <label :for="day" class="ml-2 text-sm text-gray-300">{{ day }}</label>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4">
                                <label class="block text-sm font-medium text-gray-300 mb-2">Free Times</label>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    <div v-for="time in availableTimes" :key="time" class="flex items-center">
                                        <input type="checkbox" :id="time" :value="time" v-model="formData.free_times"
                                            class="h-6 w-4 p-2 text-teal-600 focus:ring-teal-500 border-gray-600 rounded bg-slate-700" />
                                        <label :for="time" class="ml-2 text-sm text-gray-300">{{ time }}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Additional Information -->
                        <div>
                            <h2 class="text-lg font-medium text-white border-b border-gray-700 pb-2">Additional
                                Information</h2>

                            <div class="mt-4">
                                <label for="status" class="block text-sm font-medium text-gray-300">Status</label>
                                <select id="status" v-model="formData.status"
                                    class="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500">
                                    <option value="">Jarayon</option>
                                    <option value="O'qimayapti">O'qimayapti</option>
                                    <option value="O'qiyapti">O'qiyapti</option>
                                    <option value="Kutilmoqda">Kutilmoqda</option>
                                </select>
                            </div>

                            <div class="mt-4">
                                <label for="additional_info" class="block text-sm font-medium text-gray-300">Additional
                                    Information</label>
                                <textarea id="additional_info" v-model="formData.additional_info" rows="3"
                                    class="mt-1 block w-full p-2 rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end">
                        <button type="button" @click="closeFormModal"
                            class="mr-3 inline-flex items-center px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                            Cancel
                        </button>
                        <button type="submit"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            :disabled="submitting">
                            <span v-if="submitting" class="mr-2">
                                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                            </span>
                            {{ editMode ? 'Update' : 'Submit' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>