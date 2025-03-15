import { defineStore } from "pinia";
import { ref } from "vue";

export const useGroupStore = defineStore("groupStore", () => {
    const selectedGroupId = ref<number | null>(
        localStorage.getItem("selectedGroupId") 
            ? Number(localStorage.getItem("selectedGroupId")) 
            : null
    );

    const setSelectedGroup = (id: number) => {
        selectedGroupId.value = id;
        localStorage.setItem("selectedGroupId", id.toString());
    };

    return { selectedGroupId, setSelectedGroup };
});
