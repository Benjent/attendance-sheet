<script setup>
import { onMounted, ref } from "vue"
import { storeToRefs } from "pinia"
import { useEmployeeStore } from "@/stores/employee"
import { usePeriodStore } from "@/stores/period"
import { COMPANY_ID_LENGTH, EMPLOYEE_ID_LENGTH, PERIOD_CODE_LENGTH } from "@/globals"

const { accountant, companyId, companyName, employeeFullName, employeeId, employeeSignature, workingDays, workingHourCount } = storeToRefs(useEmployeeStore())
const { periodCode } = storeToRefs(usePeriodStore())

function retrieveEmployeeDetails () {
    companyId.value = localStorage.getItem("companyId") || "06753"
    companyName.value = localStorage.getItem("companyName") || "SCOP Les Octets Libres"
    employeeId.value = localStorage.getItem("employeeId") || "011"
    employeeFullName.value = localStorage.getItem("employeeFullName") || "MORVAN Benjamin Jean"
    employeeSignature.value = localStorage.getItem("employeeSignature") || ""
    const localStorageWorkingDays = JSON.parse(localStorage.getItem("workingDays"))
    workingDays.value = Array.isArray(localStorageWorkingDays) ? localStorageWorkingDays : [1, 2, 3, 4, 5]
    workingHourCount.value = localStorage.getItem("workingHourCount") || 7
}

function saveEmployeeDetails () {
    companyId.value && localStorage.setItem("companyId", companyId.value)
    companyName.value && localStorage.setItem("companyName", companyName.value)
    employeeId.value && localStorage.setItem("employeeId", employeeId.value)
    employeeFullName.value && localStorage.setItem("employeeFullName", employeeFullName.value)
    employeeSignature.value && localStorage.setItem("employeeSignature", employeeSignature.value)
    localStorage.setItem("workingDays", JSON.stringify(workingDays.value))
    workingHourCount.value && localStorage.setItem("workingHourCount", workingHourCount.value)

    isEmployeeFormShown.value = false
}

function printPreview () {
    window.print()
}

const isEmployeeFormShown = ref(false)

onMounted(() => {
    retrieveEmployeeDetails()
})
</script>

<template>
    <form class="print:hidden h-screen w-auto flex flex-1 p-10 gap-10 justify-center items-center bg-slate-900 rounded-2xl shadow-2xl text-slate-100 italic overflow-y-auto">
        <form v-if="isEmployeeFormShown" class="h-full flex flex-col gap-5 items-center">
            <div class="flex flex-col gap-5">
                <label class="flex flex-col text-rose-300">
                    Nom de l'entreprise
                    <input v-model="companyName" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <label class="flex flex-col text-rose-300">
                    ID de l'entreprise
                    <input v-model="companyId" :maxlength="COMPANY_ID_LENGTH" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <label class="flex flex-col text-rose-300">
                    Nom complet de l'employé
                    <input v-model="employeeFullName" placeholder="NOM DE FAMILLE Prénoms" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <label class="flex flex-col text-rose-300">
                    ID de l'employé
                    <input v-model="employeeId" :maxlength="EMPLOYEE_ID_LENGTH" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <label class="flex flex-col text-rose-300">
                    Signature de l'employé
                    <p class="text-white">
                        Penser à ajouter
                        <span class="font-mono text-sm text-cyan-400">
                            class="<span class="text-amber-400">h-full w-full</span>"
                        </span>
                        au tag svg
                    </p>
                    <textarea v-model="employeeSignature" placeholder="<svg class='h-full w-full'>...</svg>" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <label class="flex flex-col text-rose-300">
                    Heures travaillées par défaut
                    <input v-model.number="workingHourCount" type="number" class="w-20 mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <fieldset class="flex flex-col text-rose-300">
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
            <button class="py-2 px-4 bg-orange-700 hover:bg-orange-600 font-semibold rounded shadow" @click="saveEmployeeDetails" type="button">Sauvegarder mes informations</button>
        </form>
        <div v-else class="flex flex-col gap-5">
            <button class="py-2 px-4 bg-orange-700 hover:bg-orange-600 font-semibold rounded shadow" @click="isEmployeeFormShown = true" type="button">Modifier mes informations</button>
            <fieldset class="flex flex-col gap-5">
                <label class="flex flex-col text-rose-300">
                    Période
                    <input v-model="periodCode" placeholder="AA MM" :maxlength="PERIOD_CODE_LENGTH" class="w-20 mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <label class="flex flex-col text-rose-300">
                    Comptable
                    <input v-model="accountant" placeholder="Prénom" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
            </fieldset>
            <footer class="flex flex-col gap-5 items-center">
                <div class="flex flex-col gap-2">
                    <p>Penser à désactiver les marges dans la fenêtre d'impression.</p>
                    <button class="w-full py-2 px-4 bg-rose-800 hover:bg-rose-700 font-semibold text-white rounded shadow" @click="printPreview" type="submit">Générer pdf</button>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <p>Meilleur rendu avec</p>
                    <div class="flex gap-2 justify-center">
                        <img class="max-h-10" src="@/assets/images/logos/brave.png" alt="Logo du navigateur web Brave" />
                        <img class="max-h-10" src="@/assets/images/logos/google-chrome.png" alt="Logo du navigateur web Google Chrome" />
                    </div>
                </div>
            </footer>
        </div>
    </form>
</template>
