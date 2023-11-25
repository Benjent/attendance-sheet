<script setup>
import { storeToRefs } from "pinia"
import { useEmployeeStore } from "@/stores/employee"
import { usePeriodStore } from "@/stores/period"
import { COMPANY_ID_LENGTH, EMPLOYEE_ID_LENGTH, PERIOD_CODE_LENGTH } from "@/globals"

const { companyId, companyName, employeeFullName, employeeId, workingDays, workingHourCount } = storeToRefs(useEmployeeStore())
const { periodCode } = storeToRefs(usePeriodStore())

function retrieveEmployeeDetails () {
    companyId.value = localStorage.getItem("companyId") || "06753"
    companyName.value = localStorage.getItem("companyName") || "SCOP Les Octets Libres"
    employeeId.value = localStorage.getItem("employeeId") || "011"
    employeeFullName.value = localStorage.getItem("employeeFullName") || "MORVAN Benjamin Jean"
    const localStorageWorkingDays = JSON.parse(localStorage.getItem("workingDays"))
    workingDays.value = Array.isArray(localStorageWorkingDays) ? localStorageWorkingDays : [1, 2, 3, 4, 5]
    workingHourCount.value = localStorage.getItem("workingHourCount") || 7
}
retrieveEmployeeDetails()

function saveEmployeeDetails () {
    companyId.value && localStorage.setItem("companyId", companyId.value)
    companyName.value && localStorage.setItem("companyName", companyName.value)
    employeeId.value && localStorage.setItem("employeeId", employeeId.value)
    employeeFullName.value && localStorage.setItem("employeeFullName", employeeFullName.value)
    localStorage.setItem("workingDays", JSON.stringify(workingDays.value))
    workingHourCount.value && localStorage.setItem("workingHourCount", workingHourCount.value)
}

function printPreview () {
    window.print()
}
</script>

<template>
    <section class="h-full flex flex-1 justify-center gap-10 p-20 items-center print:hidden text-slate-100 italic">
        <form class="h-full w-auto flex flex-col p-10 gap-10 items-center bg-slate-900 rounded-2xl">
            <fieldset class="flex flex-col gap-5 items-center">
                <div class="flex gap-5">
                    <div class="flex flex-col gap-5 justify-between">
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
                            <input v-model="employeeFullName" placeholder="FAMILY NAME Given Name Middle Names" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                        </label>
                        <label class="flex flex-col text-rose-300">
                            ID de l'employé
                            <input v-model="employeeId" :maxlength="EMPLOYEE_ID_LENGTH" class="mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
                        </label>
                    </div>
                    <div class="flex flex-col gap-5 justify-between">
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
                </div>
                <button class="py-2 px-4 bg-transparent bg-slate-700 hover:bg-slate-600 font-semibold rounded shadow" @click="saveEmployeeDetails" type="submit">Sauvegarder les informations de l'employé</button>
            </fieldset>
            <label class="flex flex-col text-rose-300">
                Période
                <input v-model="periodCode" placeholder="YY MM" :maxlength="PERIOD_CODE_LENGTH" class="w-20 mt-2 py-1 px-2 rounded border border-b-2 border-b-rose-300 border-slate-600 bg-slate-700 text-slate-100" />
            </label>
            <footer class="flex flex-col gap-4 items-center">
                <p>Penser à désactiver les marges dans la fenêtre d'impression.</p>
                <button class="w-full py-2 px-4 bg-rose-800 hover:bg-rose-700 font-semibold text-white rounded shadow" @click="printPreview" type="submit">Générer pdf</button>
                <div class="flex flex-col gap-2">
                    <p>Meilleur rendu avec</p>
                    <div class="flex gap-2 justify-center">
                        <img class="max-h-10" src="@/assets/images/logos/brave.png" alt="Logo du navigateur web Brave" />
                        <img class="max-h-10" src="@/assets/images/logos/google-chrome.png" alt="Logo du navigateur web Google Chrome" />
                    </div>
                </div>
            </footer>
        </form>
    </section>
</template>
