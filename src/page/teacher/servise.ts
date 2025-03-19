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
        const response = await api.delete(`/admistrator/delete_teacher?ident=${teacherId}`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error("Xatolik:", error.response?.data || error.message);
        return null;
    }
};


const updateTeacher = async (id: string, data: any) => {
    try {
        console.log("Yuborilayotgan ma'lumot:", JSON.stringify(data, null, 2));

        const response = await api.put(`/admistrator/update_user?ident=${id}`, data, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("Server javobi:", response.data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error("Server xatosi:", error.response.data);
        } else {
            console.error("Tarmoq xatosi:", error);
        }
        return null;
    }
};


export { getTeachers, deleteTeacher , updateTeacher };
