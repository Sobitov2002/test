import api from '@/service/apiService';

const fetchStudentCount = async (): Promise<number | null> => {
  try {
    console.log('Fetching student count...');

    const response = await api.get('/student/get_count', { withCredentials: true });

    console.log('API response:', response.data);
    return response.data.count; // Assuming `count` is the student count in the response
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error fetching student count.');
  }
};

export default fetchStudentCount;
