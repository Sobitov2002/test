import api from '@/service/apiService';

const getAllExpence = async () =>{
    try {
        const responce = await api.get('/expense/get',{ withCredentials: true })
        return responce.data
    } catch (error) {
        console.log(error);
        
    }
}



export {getAllExpence}
