import api from '@/service/apiService'

const getAllStudents = async () =>{
    try {
        const response = await api.get('/payment/all', { withCredentials: true });
       
        return response.data
    } catch (error) {
       console.log(error);
        
    }
}

const postStudent = async (paymentData: any) => {
    try {
        const response = await api.post('/payment/create', paymentData, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
        throw error;
    }
};




export { getAllStudents , postStudent }