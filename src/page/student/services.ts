import api from '@/service/apiService';

const fetchFullstudent = async ()=> {
  try {
    const selectedGroupId = localStorage.getItem("groupId");
    console.log("ID localStorage: " + selectedGroupId);
    
    const response = await api.get(`/student/get_all_students?group_id=${selectedGroupId}`, { withCredentials: true });
    console.log("Taabalar",response.data);
    return response.data;
  } catch (error) {
    console.error('Get course:', error);
    
  }
};
export  {fetchFullstudent}