import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useEmployeeStore = defineStore('employee', () => {
  const employeeFullName = ref("MORVAN Benjamin Jean")
  const employeeId = ref("011")
  const companyName = ref("SCOP Les Octets Libres")
  const companyId = ref("06753")
  const workingDays = ref([1, 2, 3, 4, 5])
  const workingHourCount = ref(7)

  return { companyId, companyName, employeeFullName, employeeId, workingDays, workingHourCount }
})
