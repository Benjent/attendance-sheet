<script setup>
import { storeToRefs } from "pinia"
import { useEmployeeStore } from "@/stores/employee"
import { usePeriodStore } from "@/stores/period"

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

function printPreview() {
    // TODO
    /*
    let styleshtml = '';
    for (const node of [...document.queryselectorall('link[rel="stylesheet"], style')]) { // Replace with <style> ?
        styleshtml += node.outerhtml;
    }
    */
    const printHtml = document.querySelector("#preview").innerHTML // TODO use refs
    const printWindow = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0')
    printWindow.document.write(printHtml)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
}
</script>

<template>
    <form class="form">
        <label>
            Nom de l'entreprise
            <input v-model="companyName" />
        </label>
        <label>
            ID de l'entreprise
            <input v-model="companyId" maxlength="5" /> <!-- TODO GLOBAL -->
        </label>
        <label>
            Nom complet de l'employé
            <input v-model="employeeFullName" placeholder="FAMILY NAME Given Name Middle Names" />
        </label>
        <label>
            ID de l'employé
            <input v-model="employeeId" maxlength="3" /> <!-- TODO GLOBAL -->
        </label>
        <label>
            Heures travaillées par défaut
            <input v-model.number="workingHourCount" />
        </label>
        <fieldset>
            <legend>Jours travaillés par défaut</legend>
            <label>
                Lundi
                <input v-model="workingDays" type="checkbox" :value="1" />
            </label>
            <label>
                Mardi
                <input v-model="workingDays" type="checkbox" :value="2" />
            </label>
            <label>
                Mercredi
                <input v-model="workingDays" type="checkbox" :value="3" />
            </label>
            <label>
                Jeudi
                <input v-model="workingDays" type="checkbox" :value="4" />
            </label>
            <label>
                Vendredi
                <input v-model="workingDays" type="checkbox" :value="5" />
            </label>
        </fieldset>
        <button @click="saveEmployeeDetails" type="submit">Sauvegarder les informations de l'employé</button>
        <label>
            Période
            <input v-model="periodCode" placeholder="YY MM" maxlength="5" />  <!-- TODO BLOBAL -->
        </label>
        <button @click="printPreview" type="submit">Générer pdf</button>
    </form>
</template>

<style scoped>
/* TODO scss/tailwind */
.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-end;
    padding: 120px;
}

.form button {
    align-self: center
}
</style>
