import api from "@/service/apiService";


const getTeachers = async () => {
    try {
        const response = await api.get("/admistrator/get_all_teacher", { withCredentials: true });
        console.log("Teacher data:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("O‘qituvchilarni olishda xatolik:", error.response?.data || error.message);
        return null;
    }
};

const deleteTeacher = async (teacherId: string) => {
    try {
        const response = await api.delete(`/admistrator/delete?ident=${teacherId}`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error("Xatolik:", error.response?.data || error.message);
        return null;
    }
};


const updateTeacher = async () => {
    try {
        const response = await api.put('');
        return response.data; 
    } catch (error) {
        console.error("O'qituvchini yangilashda xatolik:", error);
        return null;
    }
};

export { getTeachers, deleteTeacher };
