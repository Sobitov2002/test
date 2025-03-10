import api from '@/service/apiService';

const profilGet  = async () =>{
    try {
        const response = await api.get('/user/get_own', { withCredentials: true });
        console.log("Profil data",response.data);
        return response.data
    } catch (error) {
       console.log(error);
        
    }
}

const profilUpdate = async (profileData: any) =>{
    try {
        const response = await api.put('/user/update_own',profileData,  { withCredentials:true });
        console.log("update data",response.data);
        return response.data
    } catch (error) {
       console.log(error);
    }
}

const profilImageUpdate = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/user/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Rasm yuklashda xatolik:", error);
  }
};
export { profilGet , profilUpdate , profilImageUpdate };