<template>
    <div class="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
        <!-- List View (Default) -->
        <div class=" mx-auto">
            <!-- Header -->

            <!-- Filters/Actions -->
            <div class="bg-slate-800 rounded-lg shadow-md p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center space-x-2">
                    <button class="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                        @click="openFormModal">
                        Qo'shish
                    </button>
                    <button class="px-4 py-2 border border-gray-600 rounded-md hover:bg-slate-700 transition-colors"
                        @click="fetchVisitors">
                        Yangilash
                    </button>
                </div>
                <div class="flex items-center gap-4">
                    <div>
                        <input type="month" v-model="selectedMonth"
                            class="px-4 py-2 border border-gray-600 rounded-md bg-slate-700 text-white focus:ring-teal-500 focus:border-teal-500"
                            @change="handleMonthChange" />
                    </div>
                    <div class="relative">

                        <input type="text" placeholder="Qidirish..."
                            class="pl-10 pr-4 py-2 border border-gray-600 rounded-md bg-slate-700 text-white focus:ring-teal-500 focus:border-teal-500"
                            v-model="searchQuery" />
                        <span class="absolute left-3 top-2.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="bg-slate-800 rounded-lg shadow-md p-8 text-center">
                <svg class="animate-spin h-8 w-8 mx-auto text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="mt-2 text-gray-300">Loading visitors...</p>
            </div>

            <!-- Visitor List -->
            <div v-else class="bg-slate-800 rounded-lg shadow-md overflow-hidden">
                <!-- List Header -->
                <div class="bg-slate-700 px-6 py-4 border-b border-gray-700">
                    <h2 class="text-lg font-medium text-white">Ro'yxatdan o'tgan o'quvchilar</h2>
                </div>

                <!-- Empty State -->
                <div v-if="filteredVisitors.length === 0" class="p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="mt-2 text-gray-300">No visitors found</p>
                </div>

                <!-- Visitor Cards -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-gray-700">
                    <div v-for="(visitor, index) in filteredVisitors" :key="visitor.id || index"
                        class="p-6 hover:bg-slate-700 transition-colors">
                        <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <!-- Main Info -->
                            <div class="flex-grow">
                                <div class="flex items-center">
                                    <h3 class="text-lg font-medium text-white">{{ visitor.full_name }}</h3>
                                    <span class="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                                        'bg-green-900 text-green-100': visitor.status === 'confirmed',
                                        'bg-yellow-900 text-yellow-100': visitor.status === 'pending',
                                        'bg-red-900 text-red-100': visitor.status === 'cancelled',
                                        'bg-gray-700 text-gray-100': !visitor.status
                                    }">
                                        {{ visitor.status || 'No Status' }}
                                    </span>
                                </div>

                                <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span class="text-gray-300">{{ formatDate(visitor.visit_date) }}</span>
                                    </div>

                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span class="text-gray-300">{{ visitor.phone_number }}</span>
                                    </div>

                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                        <span class="text-gray-300">{{ visitor.source || 'Not specified' }}</span>
                                    </div>

                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <span class="text-gray-300">{{ visitor.course || 'Not specified' }}</span>
                                    </div>

                                    <div class="flex items-center sm:col-span-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span class="text-gray-300">{{ visitor.address || 'Not specified' }}</span>
                                    </div>
                                </div>

                                <!-- Free Days & Times -->
                                <div class="mt-4">
                                    <div class="mb-2">
                                        <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Bo'sh kun</span>
                                        <div class="mt-1 flex flex-wrap gap-2">
                                            <span v-for="day in visitor.free_days" :key="day"
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-100">
                                                {{ day }}
                                            </span>
                                            <span v-if="!visitor.free_days || visitor.free_days.length === 0"
                                                class="text-sm text-gray-400">
                                              
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Bo'sh vaqt</span>
                                        <div class="mt-1 flex flex-wrap gap-2">
                                            <span v-for="time in visitor.free_times" :key="time"
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-900 text-teal-100">
                                                {{ time }}
                                            </span>
                                            <span v-if="!visitor.free_times || visitor.free_times.length === 0"
                                                class="text-sm text-gray-400">
                                                No free times specified
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Additional Info -->
                                <div v-if="visitor.additional_info" class="mt-4 text-sm">
                                    <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Umumiy ma'lumot</span>
                                    <p class="mt-1 text-gray-300">{{ visitor.additional_info }}</p>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex md:flex-col gap-2">
                                <button class="p-2 text-teal-400 hover:bg-slate-600 rounded-full transition-colors"
                                    @click="editVisitor(visitor)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button class="p-2 text-red-400 hover:bg-slate-600 rounded-full transition-colors"
                                    @click="confirmDelete(visitor)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-6 flex items-center justify-between">
                <div class="text-sm text-gray-300">
                    Showing <span class="font-medium">{{ filteredVisitors.length }}</span> of <span
                        class="font-medium">{{ visitors.length }}</span> visitors
                </div>
                <div class="flex space-x-2">
                    <button
                        class="px-3 py-1 border border-gray-600 rounded-md hover:bg-slate-700 disabled:opacity-50 text-white"
                        :disabled="page === 1" @click="page--">
                        Oldingi...
                    </button>
                    <button
                        class="px-3 py-1 border border-gray-600 rounded-md hover:bg-slate-700 disabled:opacity-50 text-white"
                        :disabled="page * itemsPerPage >= visitors.length" @click="page++">
                        Keyingi...
                    </button>
                </div>
            </div>
        </div>

        <!-- Form Modal -->
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
                                <h1 class="text-2xl font-bold text-white">Visitor Registration</h1>
                                <p class="text-gray-300 mt-1">Please fill in your information below</p>
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
                                            class="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                            required />
                                    </div>

                                    <div>
                                        <label for="visit_date" class="block text-sm font-medium text-gray-300">Visit
                                            Date</label>
                                        <input type="date" id="visit_date" v-model="formData.visit_date"
                                            class="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                            required />
                                    </div>

                                    <div>
                                        <label for="phone_number" class="block text-sm font-medium text-gray-300">Phone
                                            Number</label>
                                        <input type="tel" id="phone_number" v-model="formData.phone_number"
                                            class="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                            required />
                                    </div>

                                    <div>
                                        <label for="secondary_phone"
                                            class="block text-sm font-medium text-gray-300">Secondary Phone</label>
                                        <input type="tel" id="secondary_phone" v-model="formData.secondary_phone"
                                            class="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                                    </div>

                                    <div>
                                        <label for="source"
                                            class="block text-sm font-medium text-gray-300">Source</label>
                                        <input type="text" id="source" v-model="formData.source"
                                            class="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                                    </div>

                                    <div>
                                        <label for="course"
                                            class="block text-sm font-medium text-gray-300">Course</label>
                                        <input type="text" id="course" v-model="formData.course"
                                            class="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                                    </div>

                                    <div class="sm:col-span-2">
                                        <label for="address"
                                            class="block text-sm font-medium text-gray-300">Address</label>
                                        <input type="text" id="address" v-model="formData.address"
                                            class="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500" />
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
                                                class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-600 rounded bg-slate-700" />
                                            <label :for="day" class="ml-2 text-sm text-gray-300">{{ day }}</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-4">
                                    <label class="block text-sm font-medium text-gray-300 mb-2">Free Times</label>
                                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        <div v-for="time in availableTimes" :key="time" class="flex items-center">
                                            <input type="checkbox" :id="time" :value="time"
                                                v-model="formData.free_times"
                                                class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-600 rounded bg-slate-700" />
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
                                        class="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500">
                                        <option value="">Select status</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div class="mt-4">
                                    <label for="additional_info"
                                        class="block text-sm font-medium text-gray-300">Additional Information</label>
                                    <textarea id="additional_info" v-model="formData.additional_info" rows="3"
                                        class="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"></textarea>
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

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title"
            role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <!-- Background overlay -->
                <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"
                    @click="closeDeleteModal"></div>

                <!-- Modal panel -->
                <div
                    class="inline-block align-bottom bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div
                                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-white" id="modal-title">Delete Visitor
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-300">
                                        Are you sure you want to delete this visitor? This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            @click="deleteVisitor" :disabled="deleting">
                            <span v-if="deleting" class="mr-2">
                                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                            </span>
                            Delete
                        </button>
                        <button type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-slate-800 text-base font-medium text-gray-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            @click="closeDeleteModal">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div v-if="toast.show" class="fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg transition-all duration-300"
            :class="{
                'bg-green-600 text-white': toast.type === 'success',
                'bg-red-600 text-white': toast.type === 'error',
                'bg-blue-600 text-white': toast.type === 'info'
            }">
            {{ toast.message }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import api from '@/service/apiService'

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

export default defineComponent({
    name: 'VisitorManagement',
    setup() {
        // API endpoints
        const API_CREATE = 'reception/create';
        const API_GET = 'reception/list';
        const API_DELETE = 'reception/delete';
        const API_UPDATE = 'reception/update';

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
        }

        const formData = ref<VisitorData>({ ...initialFormData })
        const showFormModal = ref(false)
        const submitting = ref(false)
        const editMode = ref(false)
        const selectedMonth = ref(new Date().toISOString().slice(0, 7)) // Default to current month (YYYY-MM format)
        const availableDays = [
            'Dushanba',
            'Seshanba',
            'Chorshanba',
            'Payshanba',
            'Juma',
            'Shanba',
            'Yakshanba'
        ]

        const availableTimes = [
            '8:00-10:00',
            '10:00-12:00',
            '14:00-16:00',
            '16:00-18:00'
        ]

        // List data
        const visitors = ref<VisitorData[]>([])
        const loading = ref(true)
        const searchQuery = ref('')
        const page = ref(1)
        const itemsPerPage = 10

        // Delete modal
        const showDeleteModal = ref(false)
        const visitorToDelete = ref<VisitorData | null>(null)
        const deleting = ref(false)

        // Toast notification
        const toast = ref({
            show: false,
            message: '',
            type: 'info'
        })

        // Filter visitors based on search query
        const filteredVisitors = computed(() => {
            if (!searchQuery.value) return visitors.value

            const query = searchQuery.value.toLowerCase()
            return visitors.value.filter(visitor =>
                visitor.full_name.toLowerCase().includes(query) ||
                visitor.phone_number.toLowerCase().includes(query) ||
                visitor.course?.toLowerCase().includes(query) ||
                visitor.status?.toLowerCase().includes(query)
            )
        })

        // Format date for display
        const formatDate = (dateString: string) => {
            if (!dateString) return 'Not specified'

            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }

            return new Date(dateString).toLocaleDateString(undefined, options)
        }
        const handleMonthChange = () => {
            fetchVisitors()
        }
        // Fetch visitors from API
        const fetchVisitors = async () => {
            loading.value = true
            try {
                const [year, month] = selectedMonth.value.split('-')
                const response = await api.get(`/reception/get?year=${year}&month=${month}`)
                visitors.value = response.data
                loading.value = false
            } catch (error) {
                console.error('Error fetching visitors:', error)
                showToast('Failed to load visitors', 'error')
                loading.value = false
            }
        }

        // Open form modal
        const openFormModal = () => {
            resetForm()
            editMode.value = false
            showFormModal.value = true
        }

        // Close form modal
        const closeFormModal = () => {
            showFormModal.value = false
        }

       
        // Reset form
        const resetForm = () => {
            formData.value = { ...initialFormData }
            formData.value.visit_date = new Date().toISOString().split('T')[0]
        }

        const submitForm = async () => {
            submitting.value = true

            try {
                let response;

                if (editMode.value && formData.value.id) {
                    // Tashrifchini yangilash
                    response = await api.post(`/reception/create`, formData.value, {
                        headers: { "Content-Type": "application/json" }
                    });
                    const index = visitors.value.findIndex(v => v.id === formData.value.id)
                    if (index !== -1) {
                        visitors.value[index] = { ...formData.value }
                    }
                    showToast('Visitor updated successfully', 'success')
                } else {
                    
                    response = await api.post(`/reception/create`, formData.value, {
                        headers: { "Content-Type": "application/json" }
                    });
                    if (response && response.data) {
                        const newVisitor = {
                            ...formData.value,
                            id: response.data.id
                        }
                        visitors.value.push(newVisitor)
                        showToast('Visitor added successfully', 'success')
                    }
                }

                closeFormModal()
            } catch (error) {
               console.log(error);
               
                showToast(editMode.value ? 'Failed to update visitor' : 'Failed to add visitor', 'error')
            } finally {
                submitting.value = false
            }
        }


        // Edit visitor
        const editVisitor = (visitor: VisitorData) => {
            formData.value = { ...visitor }
            editMode.value = true
            showFormModal.value = true
        }

        // Confirm delete
        const confirmDelete = (visitor: VisitorData) => {
            visitorToDelete.value = visitor
            showDeleteModal.value = true
        }

        // Close delete modal
        const closeDeleteModal = () => {
            showDeleteModal.value = false
            visitorToDelete.value = null
        }

        // Delete visitor
        const deleteVisitor = async () => {
            if (!visitorToDelete.value) return

            deleting.value = true

            try {
                await api.delete(`/reception/delete?ident=${visitorToDelete.value.id}`)
                visitors.value = visitors.value.filter(v => v.id !== visitorToDelete.value?.id)
                showToast('Visitor deleted successfully', 'success')
                closeDeleteModal()
            } catch (error) {
                console.error('Error deleting visitor:', error)
                showToast('Failed to delete visitor', 'error')
            } finally {
                deleting.value = false
            }
        }

        // Show toast notification
        const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
            toast.value = {
                show: true,
                message,
                type
            }

            setTimeout(() => {
                toast.value.show = false
            }, 3000)
        }

        // Fetch visitors on component mount
        onMounted(() => {
            fetchVisitors()
        })

        return {
            // Form-related
            formData,
            availableDays,
            availableTimes,
            submitForm,
            resetForm,
            showFormModal,
            openFormModal,
            closeFormModal,
            submitting,
            editMode,

            // List-related
            visitors,
            filteredVisitors,
            searchQuery,
            page,
            itemsPerPage,
            formatDate,
            fetchVisitors,
            loading,
            selectedMonth,
            handleMonthChange,

            // Delete-related
            showDeleteModal,
            confirmDelete,
            closeDeleteModal,
            deleteVisitor,
            deleting,

            // Toast
            toast,

            // Actions
            editVisitor
        }
    }
})
</script>

<style scoped>
/* Additional custom styles */
/* Most styling is handled by Tailwind CSS classes */

/* Add smooth transitions */
.transition-colors {
    transition: background-color 0.2s ease, color 0.2s ease;
}

.transition-all {
    transition: all 0.3s ease;
}

/* Ensure proper styling for buttons */
button {
    transition: all 0.2s ease;
}

/* Ensure proper styling for inputs */
input:focus,
select:focus,
textarea:focus {
    outline: none;
    transition: all 0.2s ease-in-out;
}

/* Ensure proper styling for checkboxes */
input[type="checkbox"] {
    cursor: pointer;
}

/* Modal animations */
.fixed {
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>