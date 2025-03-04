import api from '@/service/apiService';

const fetchFullstudent = async ()=> {
  try {
    const response = await api.get('/student/get_all_students', { withCredentials: true});
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Get course:', error);
    
  }
};
export  {fetchFullstudent}