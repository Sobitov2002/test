import api from '@/service/apiService'


const studentDebt =  async () =>{
    try {
        
        const response = await api.get(`/student/get_debt_student?year=2025&month=april`)

        
        return response.data
    } catch (error) {
        console.error("Error fetching debt students:", error)
    } finally {
       
    };
}

const studentActive = async () =>{
    try {
        const response = await api.get(`/student/get_all_students?status=active`)
        return response.data
    } catch (error) {
         console.error("Aktiv students:", error)
    }
}

const studentGraduated = async () =>{
    try {
        const response = await api.get(`/student/get_all_students?status=graduated`)

        
        return response.data
    } catch (error) {
         console.error("Aktiv students:", error)
    }
}

const studentInActive = async () =>{
    try {
        const response = await api.get(`/student/get_all_students?status=inactive`)

        return response.data
    } catch (error) {
         console.error("Aktiv students:", error)
    }
}

export {studentDebt ,studentActive , studentInActive , studentGraduated }