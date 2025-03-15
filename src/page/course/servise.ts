import api from '@/service/apiService';
import { useGroupStore } from './store/groupStore';

const getAllGroup = async () => {
    try {
        const response = await api.get('/course/get', { withCredentials: true });
        // console.log("Group data", response.data);
        return response.data;
    } catch (error) {
        console.error("Guruhlarni olishda xatolik:", );
        return null;
    }
};

const getTeachers = async () => {
    try {
        const response = await api.get("/admistrator/get_all_teacher", { withCredentials: true });
        // console.log("Teacher data:", response.data);
        return response.data;
    } catch (error) {
        console.error("O‘qituvchilarni olishda xatolik:");
        return null;
    }
};

const groupAdd = async (groupData: { name: string; teacher_id: number; price: number }) => {
    try {
        const response = await api.post('/group/create', groupData, { withCredentials: true });
        // console.log("Yangi guruh yaratildi:", response.data);
        return response.data;
    } catch (error) {
        console.error("Guruh qo'shishda xatolik:");
        return null;
    }
};

const getCourse = async () => {
    const groupStore = useGroupStore(); 
    try {
        const response = await api.get(`https://iteachsystem.uz/group/get?course_id=${groupStore.selectedGroupId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Kursni olishda xatolik:");
        return null;
    }
};


 const createCourse = async (course_name: string) => {
    try {
        const response = await api.post(`course/create?course_name=${encodeURIComponent(course_name)}`, null, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Kurs yaratishda xatolik:", error);
        return null;
    }
};



const addCourseImage = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await api.post('/course/upload-image',  {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        });

        console.log("Rasm yuklandi", response);
        return response.data; 
    } catch (error) {
        console.log("Rasm yuklashda xatolik:", error);
    }
};






export { getAllGroup, getTeachers, groupAdd, getCourse , addCourseImage , createCourse };
