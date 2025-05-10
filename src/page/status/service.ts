import api from '@/service/apiService'

const studentDebt = async (month: string, year: number) => {
  try {
    const response = await api.get(`/student/get_debt_student?year=${year}&month=${month}`)
    return response.data
  } catch (error) {
    console.error("Qarzdorlar ro‘yxati:", error)
    return []
  }
}

const studentActive = async () => {
  try {
    const response = await api.get(`/student/get_all_students?status=active`)
    return response.data
  } catch (error) {
    console.error("Aktiv talabalar:", error)
    return []
  }
}

const studentGraduated = async () => {
  try {
    const response = await api.get(`/student/get_all_students?status=graduated`)
    return response.data
  } catch (error) {
    console.error("Bitirgan talabalar:", error)
    return []
  }
}

const studentInActive = async () => {
  try {
    const response = await api.get(`/student/get_all_students?status=inactive`)
    return response.data
  } catch (error) {
    console.error("Noaktiv talabalar:", error)
    return []
  }
}

export { studentDebt, studentActive, studentInActive, studentGraduated }
