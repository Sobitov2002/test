import api from '@/service/apiService';


const fetchFullstudent = async ()=> {
  try {
    const selectedGroupId = localStorage.getItem("groupId");
    // console.log("ID localStorage: " + selectedGroupId);
    
    const response = await api.get(`/student/get_all_students?group_id=${selectedGroupId}`, { withCredentials: true });
    // console.log("Taabalar",response.data);
    return response.data;
  } catch (error) {
    console.error('Get course:', error);
    
  }
};

interface UserData {
  full_name: string;
  phone_number: number;
  group_id?: number;
  started_date?: string;
}

const addUser = async (userData: { full_name: string; phone_number: string; discount:"number" }) => {
  try {
    const groupId = localStorage.getItem("groupId"); 
    const startedDate = new Date().toISOString().split("T")[0];

    if (!groupId) {
      throw new Error("group_id localStorage'da topilmadi!");
    }

    const requestData = {
      full_name: userData.full_name,
      group_id: parseInt(groupId, 10), 
      discount: userData.discount,
      phone_number: String(userData.phone_number), 
      started_date: startedDate,
    };

    

    const response = await api.post("/student/create", requestData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

   
    return response.data;
  } catch (error: any) {
    console.error("Talabani qo'shishda xatolik:", error.response?.data || error);
  }
};


const deleteStudent = async (students:number) =>{
  try {
    const response = await api.delete(`/student/delete?ident=${students}` ,  {
      withCredentials: true,
    })
    return response.data;
  } catch (error) {
    console.log(error);
    
  }
};


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



export  {fetchFullstudent , addUser , deleteStudent, postStudent}