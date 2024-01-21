<script setup>
import { computed, onMounted, ref } from "vue"
import { storeToRefs } from "pinia"
import { useEmployeeStore } from "@/stores/employee"
import { usePeriodStore } from "@/stores/period"
import { COMPANY_ID_LENGTH, EMPLOYEE_ID_LENGTH, PERIOD_CODE_LENGTH } from "@/globals"

const { accountant, companyId, companyName, employeeFullName, employeeId, employeeSignature, workingDays, workingHourCount } = storeToRefs(useEmployeeStore())
const { periodCode, periodMonth, periodYear } = storeToRefs(usePeriodStore())

const formLabels = {
    accountant: "Comptable",
    companyId: "Matricule de l'entreprise",
    companyName: "Nom de l'entreprise",
    employeeId: "Matricule de l'employé",
    employeeFullName: "Nom complet de l'employé",
    periodCode: "Période",
}

const isEmployeeFormShown = ref(false)
const errorMessage = ref("")

const isCompanyIdValid = computed(() => {
    return companyId.value?.length === COMPANY_ID_LENGTH
})

const isEmployeeIdValid = computed(() => {
    return employeeId.value?.length === EMPLOYEE_ID_LENGTH
})

const isPeriodCodeValid = computed(() => {
    return periodCode.value?.length === PERIOD_CODE_LENGTH
})

function retrieveEmployeeDetails() {
    companyId.value = localStorage.getItem("companyId")
    companyName.value = localStorage.getItem("companyName")
    employeeId.value = localStorage.getItem("employeeId")
    employeeFullName.value = localStorage.getItem("employeeFullName")
    employeeSignature.value = localStorage.getItem("employeeSignature") || ""
    const localStorageWorkingDays = JSON.parse(localStorage.getItem("workingDays"))
    workingDays.value = Array.isArray(localStorageWorkingDays) ? localStorageWorkingDays : [1, 2, 3, 4, 5]
    workingHourCount.value = localStorage.getItem("workingHourCount") || 7
}

function saveEmployeeDetails() {
    companyId.value && localStorage.setItem("companyId", companyId.value)
    companyName.value && localStorage.setItem("companyName", companyName.value)
    employeeId.value && localStorage.setItem("employeeId", employeeId.value)
    employeeFullName.value && localStorage.setItem("employeeFullName", employeeFullName.value)
    employeeSignature.value && localStorage.setItem("employeeSignature", employeeSignature.value)
    localStorage.setItem("workingDays", JSON.stringify(workingDays.value))
    workingHourCount.value && localStorage.setItem("workingHourCount", workingHourCount.value)

    isEmployeeFormShown.value = false
}

function getPeriodDocumentTitle() {
    const fullYearPeriod = `20${periodYear.value}-${periodMonth.value}`
    const employeeAcronym = employeeFullName.value.split(/[ -]/).map((name) => name[0]).join("")
    return `${fullYearPeriod} - ${employeeAcronym}`
}

function printPreview() {
    const appName = document.title
    document.title = getPeriodDocumentTitle()
    window.print()
    document.title = appName
}

function submit() {
    errorMessage.value = ""

    const formValues = {
        companyName: companyName.value,
        companyId: isCompanyIdValid.value,
        employeeFullName: employeeFullName.value,
        employeeId: isEmployeeIdValid.value,
        periodCode: isPeriodCodeValid.value,
        accountant: accountant.value,
    }
    const isFormValid = Object.values(formValues).every(Boolean)
    if (!isFormValid) {
        errorMessage.value = Object.entries(formValues).filter((entry) => !entry[1]).map((entry) => formLabels[entry[0]]).join(", ")
        return
    }

    printPreview()
}

onMounted(() => {
    retrieveEmployeeDetails()
})
</script>

<template>
    <form @submit.prevent class="print:hidden h-screen w-auto flex flex-1 p-10 gap-10 justify-center items-center bg-slate-900 rounded-2xl shadow-2xl text-slate-100 italic overflow-y-auto">
        <form v-if="isEmployeeFormShown" class="h-full flex flex-col gap-5 items-center max-w-[400px]">
            <div class="flex flex-col gap-5">
                <label class="flex flex-col text-rose-300">
                    {{formLabels.companyName}}
                    <input v-model="companyName" placeholder="Nom De l'Entreprise" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <label class="flex flex-col text-rose-300">
                    {{formLabels.companyId}}
                    <input v-model="companyId" :maxlength="COMPANY_ID_LENGTH" placeholder="00000" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <label class="flex flex-col text-rose-300">
                    {{formLabels.employeeFullName}}
                    <input v-model="employeeFullName" placeholder="NOM DE FAMILLE Prénom" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <label class="flex flex-col text-rose-300">
                    {{formLabels.employeeId}}
                    <input v-model="employeeId" :maxlength="EMPLOYEE_ID_LENGTH" placeholder="000" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
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
        <div v-else class="flex flex-col gap-5 max-w-[600px]">
            <button class="w-fit m-auto py-2 px-4 bg-orange-700 hover:bg-orange-600 font-semibold rounded shadow" @click="isEmployeeFormShown = true" type="button">Modifier mes informations</button>
            <fieldset class="flex flex-col gap-5">
                <label class="flex flex-col text-rose-300">
                    {{formLabels.periodCode}}
                    <input v-model="periodCode" placeholder="AA MM" :maxlength="PERIOD_CODE_LENGTH" class="w-20 mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
                <label class="flex flex-col text-rose-300 max-w-xs">
                    {{formLabels.accountant}}
                    <input v-model="accountant" placeholder="Prénom" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                </label>
            </fieldset>
            <footer class="flex flex-col gap-5 items-center">
                <div class="flex flex-col gap-2">
                    <p>Penser à désactiver les marges dans la fenêtre d'impression.</p>
                    <p>Pour préserver les nuances de gris, penser à activer les graphiques d'arrière-plan dans la fenêtre d'impression.</p>
                    <button class="w-full py-2 px-4 bg-rose-800 hover:bg-rose-700 font-semibold text-white rounded shadow" type="submit" @click="submit">Générer pdf</button>
                    <p v-if="errorMessage" class="text-red-500">Les informations suivantes sont invalides&nbsp;: <span class="text-rose-300">{{errorMessage}}</span></p>
                </div>
                <div class="flex flex-col items-center gap-2 text-center">
                    <p>Prévisualisation et rendu corrects avec</p>
                    <div class="flex gap-2 justify-center">
                        <img class="max-h-10" src="@/assets/images/logos/brave.png" alt="Logo du navigateur web Brave" />
                        <img class="max-h-10" src="@/assets/images/logos/google-chrome.png" alt="Logo du navigateur web Google Chrome" />
                    </div>
                    <p>Prévisualisation instable mais rendu correct avec</p>
                    <div class="flex gap-2 justify-center">
                        <img class="max-h-10" src="@/assets/images/logos/firefox.png" alt="Logo du navigateur web Firefox" />
                    </div>
                </div>
            </footer>
        </div>
    </form>
</template>
