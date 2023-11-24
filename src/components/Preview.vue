<script setup>
import { computed, reactive } from "vue"
import { storeToRefs } from "pinia"
import { addWeeks, eachDayOfInterval, endOfWeek, format, getDay, getMonth, getYear, isMonday, isSaturday, isSunday, setDefaultOptions, startOfWeek } from "date-fns"
import { fr } from "date-fns/locale"
import Holidays from "date-holidays"
import { useEmployeeStore } from "@/stores/employee"
import { usePeriodStore } from "@/stores/period"

setDefaultOptions({ locale: fr })

const { companyId, companyName, employeeFullName, employeeId, workingDays, workingHourCount } = storeToRefs(useEmployeeStore())
const { periodCode } = storeToRefs(usePeriodStore())

const dateHolidays = new Holidays("FR") // TODO utils ?
// const isHoliday = dateHolidays.isHoliday

const periodStartDate = computed(() => {
    if (!periodCode.value || periodCode.value.length !== 5) return // TODO 5 GLOBAL
    const [periodYear, periodMonth] = periodCode.value.split(" ")
    const year = `20${periodYear}`
    const month = +periodMonth
    const monthIndex = month - 1
    const previousMonthIndex = monthIndex - 1
    const date = new Date(year, previousMonthIndex, 16) // TODO better name TODO 16 and 15 GLOBAL
    return isMonday(date) ? date : startOfWeek(addWeeks(date, 1))
    // Business rule : du 16 au 15 mais semaine complète TODO explain
})

const periodEndDate = computed(() => {
    if (!periodStartDate.value) return
    const date = new Date(getYear(periodStartDate.value), getMonth(periodStartDate.value) + 1, 15) // TODO better name
    return isSunday(date) ? date : endOfWeek(date) // TODO vérifier février ?
})

const periodDays = computed(() => {
    if (!periodStartDate.value || !periodEndDate.value) return
    return eachDayOfInterval({ start: periodStartDate.value, end: periodEndDate.value })
})

const sheetId = computed(() => {
    return `${companyId.value} ${employeeId.value} ${periodCode.value}`
})

function getWorkingCount(date) {
    if (dateHolidays.isHoliday(date)) return "Fér."
    if (!workingDays.value.includes(getDay(date))) return "Non travaillé"
    if (isSaturday(date) || isSunday(date)) return
    return workingHourCount.value
}

// TODO each td cell should be an input so that people can edit
</script>

<template>
  <div class="preview" id="preview">
    <h1>{{ companyName }} {{ format(periodEndDate, "MMMM yyyy") }} {{ sheetId }}</h1>
    <table>
        <thead>
            <tr>
                <th colspan="8">{{ employeeFullName }}</th>
                <th colspan="4">Horaires de travail</th>
                <th colspan="6">Du {{ periodStartDate && format(periodStartDate, "dd/MM") }} au {{ periodEndDate && format(periodEndDate, "dd/MM") }}</th>
            </tr>
            <tr>
                <th colspan="2" rowspan="2" />
                <th colspan="2" rowspan="2">Heures travaillées</th>
                <th colspan="2">Absences</th>
                <th colspan="2">Quantités</th>
                <th colspan="2">Période 1</th>
                <th colspan="2">Période 2</th>
                <th colspan="2">Zone libre</th>
                <th colspan="4">Zone service paie</th>
            </tr>
            <tr>
                <th>Code*</th>
                <th>Heures</th>
                <th>Code*</th>
                <th>Quantité</th>
                <th>Heure arrivée</th>
                <th>Heure départ</th>
                <th>Heure arrivée</th>
                <th>Heure départ</th>
                <th />
                <th />
                <th />
                <th />
                <th />
                <th />
                <!-- <th style="border: none;">CP</th> TODO allow congés payés to be easily applied -->
            </tr>
        </thead>
        <tbody>
            <tr v-for="day in periodDays" :key="day">
                <th colspan="2">{{ format(day, "E dd/MM").replace(".", "") }}</th>
                <td colspan="2">{{ getWorkingCount(day) }}</td>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <!-- <td style="border: none;"><input type="checkbox" :checked="false" /></td> -->
            </tr>
        </tbody>
    </table>
  </div>
</template>

<style scoped>
@media print {
  /* .div[size="A4"] {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  } */
}

table {
    width: 100%;
}

.preview {
    background: white;
    color: black;
    width: 210mm;
    height: 297mm;
}

table, thead, tr, th, td {
    border: solid 1px black;
}
</style>
