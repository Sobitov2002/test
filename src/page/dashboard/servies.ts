import api from '@/service/apiService';

const fetchStudentCount = async (): Promise<number | null> => {
  try {
    const response = await api.get('/student/get_count', { withCredentials: true });
    return response.data.count; 
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error fetching student count.');
  }
};

const fetchFullCourse = async ()=> {
  try {
    const response = await api.get('/course/get_all', { withCredentials: true});
    return response.data;
    
  } catch (error) {
    console.error('Get course:', error);
    
  }
};

const fetchAdminstrator = async ()  =>{
  try {
     const response = await api.get('/admistrator/get_all_teacher_count', { withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Get course:', error);
  }
};

const Adminstrator = async ()  =>{
  try {
     const response = await api.get('reception/reception_students_count_monthly', { withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Get course:', error);
  }
}

const courseGetAll = async ()  =>{
  try {
     const response = await api.get('/course/get_all', { withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Get course:', error);
  }
}

const getCurrentYearMonth = () => {
  return {
    year: 2025,
    month: 3
  };
};

const fetchPayment = async () => {
  try {

    const { year, month } = getCurrentYearMonth();

   const response = await api.get(`/payment/monthly_sum?year=${year}&month=${month}`);   
    return response.data;
  } catch (error) {
    console.error('To\'lov ma\'lumotlarini olishda xato:', error);
  
  }
};

const fetchExpence = async ()  =>{
  
  try {
     const response = await api.get('expense/get_sum_expense?year=2025&month=03', { withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Get course:', error);
  }
}


const getMonthly = async () => {
  try {

    // const { year, month } = getCurrentYearMonth();

   const response = await api.get(`/reception/get_monthly_statistics?year=${2025}&month=${3}`);
    return response.data;
  } catch (error) {
    console.error('To\'lov ma\'lumotlarini olishda xato:', error);
  
  }
};



export { fetchStudentCount, fetchFullCourse , fetchAdminstrator , Adminstrator , courseGetAll , fetchPayment , fetchExpence ,getMonthly };
