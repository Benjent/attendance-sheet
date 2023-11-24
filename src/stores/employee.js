import { ref } from "vue"
import { defineStore } from "pinia"

export const useEmployeeStore = defineStore("employee", () => {
    const employeeFullName = ref("")
    const employeeId = ref("")
    const companyName = ref("")
    const companyId = ref("")
    const workingDays = ref([1, 2, 3, 4, 5])
    const workingHourCount = ref(7)

    return { companyId, companyName, employeeFullName, employeeId, workingDays, workingHourCount }
})
