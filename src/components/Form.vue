<script setup>
import { storeToRefs } from "pinia"
import { useEmployeeStore } from "@/stores/employee"
import { usePeriodStore } from "@/stores/period"
import { COMPANY_ID_LENGTH, EMPLOYEE_ID_LENGTH, PERIOD_CODE_LENGTH } from "@/globals"

const { companyId, companyName, employeeFullName, employeeId, workingDays, workingHourCount } = storeToRefs(useEmployeeStore())
const { periodCode } = storeToRefs(usePeriodStore())

function retrieveEmployeeDetails() {
    companyId.value = localStorage.getItem("companyId")
    companyName.value = localStorage.getItem("companyName")
    employeeId.value = localStorage.getItem("employeeId")
    employeeFullName.value = localStorage.getItem("employeeFullName")
    workingDays.value = JSON.parse(localStorage.getItem("workingDays"))
    workingHourCount.value = localStorage.getItem("workingHourCount")
}
retrieveEmployeeDetails()

function saveEmployeeDetails() {
    localStorage.setItem("companyId", companyId.value)
    localStorage.setItem("companyName", companyName.value)
    localStorage.setItem("employeeId", employeeId.value)
    localStorage.setItem("employeeFullName", employeeFullName.value)
    localStorage.setItem("workingDays", JSON.stringify(workingDays.value))
    localStorage.setItem("workingHourCount", workingHourCount.value)
}

function printPreview () {
    window.print()
}
</script>

<template>
    <form class="flex flex-col flex-1 gap-10 p-20 items-center print:hidden">
        <fieldset class="flex flex-col gap-5 items-center">
            <div class="flex gap-5">
                <div class="flex flex-col gap-5 justify-between">
                    <label class="flex flex-col">
                        Nom de l'entreprise
                        <input v-model="companyName" class="py-1 px-2 rounded border border-b-2" />
                    </label>
                    <label class="flex flex-col">
                        ID de l'entreprise
                        <input v-model="companyId" :maxlength="COMPANY_ID_LENGTH" class="py-1 px-2 rounded border border-b-2" />
                    </label>
                    <label class="flex flex-col">
                        Nom complet de l'employé
                        <input v-model="employeeFullName" placeholder="FAMILY NAME Given Name Middle Names" class="py-1 px-2 rounded border border-b-2" />
                    </label>
                    <label class="flex flex-col">
                        ID de l'employé
                        <input v-model="employeeId" :maxlength="EMPLOYEE_ID_LENGTH" class="py-1 px-2 rounded border border-b-2" />
                    </label>
                </div>
                <div class="flex flex-col gap-5 justify-between">
                    <label class="flex flex-col">
                        Heures travaillées par défaut
                        <input v-model.number="workingHourCount" type="number" class="w-20 py-1 px-2 rounded border border-b-2" />
                    </label>
                    <fieldset class="flex flex-col">
                        <legend>Jours travaillés par défaut</legend>
                        <label>
                            <input v-model="workingDays" type="checkbox" :value="1" />
                            Lundi
                        </label>
                        <label>
                            <input v-model="workingDays" type="checkbox" :value="2" />
                            Mardi
                        </label>
                        <label>
                            <input v-model="workingDays" type="checkbox" :value="3" />
                            Mercredi
                        </label>
                        <label>
                            <input v-model="workingDays" type="checkbox" :value="4" />
                            Jeudi
                        </label>
                        <label>
                            <input v-model="workingDays" type="checkbox" :value="5" />
                            Vendredi
                        </label>
                    </fieldset>
                </div>
            </div>
            <button class="py-2 px-4 bg-transparent hover:bg-purple-500 font-semibold hover:text-white border border-purple-500 hover:border-transparent rounded shadow" @click="saveEmployeeDetails" type="submit">Sauvegarder les informations de l'employé</button>
        </fieldset>
        <label class="flex flex-col">
            Période
            <input v-model="periodCode" placeholder="YY MM" :maxlength="PERIOD_CODE_LENGTH" class="w-20 py-1 px-2 rounded border border-b-2" />
        </label>
        <p>Penser à désactiver les marges dans la fenêtre d'impression.</p>
        <button class="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 font-semibold text-white rounded shadow" @click="printPreview" type="submit">Générer pdf</button>
    </form>
</template>
