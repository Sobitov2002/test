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
export { profilGet , profilUpdate };