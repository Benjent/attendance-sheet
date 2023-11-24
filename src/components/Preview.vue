<script setup>
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { addWeeks, eachDayOfInterval, endOfWeek, format, getDay, getMonth, getYear, isMonday, isSaturday, isSunday, setDefaultOptions, startOfWeek } from "date-fns"
import { fr } from "date-fns/locale"
import Holidays from "date-holidays"
import { useEmployeeStore } from "@/stores/employee"
import { usePeriodStore } from "@/stores/period"
import { DAYS_IN_WEEK, FIRST_ELIGIBLE_PERIOD_DAY, PERIOD_CODE_LENGTH } from "@/globals"

setDefaultOptions({ locale: fr })
const dateHolidays = new Holidays("FR")

const { companyId, companyName, employeeFullName, employeeId, workingDays, workingHourCount } = storeToRefs(useEmployeeStore())
const { periodCode } = storeToRefs(usePeriodStore())

// Periods are made of complete weeks (from Monday to Sunday) starting from the 16th of each month and ending so at the 15th of the following month
const periodStartDate = computed(() => {
    if (!periodCode.value || periodCode.value.length !== PERIOD_CODE_LENGTH) return
    const [periodYear, periodMonth] = periodCode.value.split(" ")
    const year = `20${periodYear}`
    const month = +periodMonth
    const monthIndex = month - 1
    const previousMonthIndex = monthIndex - 1
    const earliestEligibleDate = new Date(year, previousMonthIndex, FIRST_ELIGIBLE_PERIOD_DAY)
    return isMonday(earliestEligibleDate) ? earliestEligibleDate : startOfWeek(addWeeks(earliestEligibleDate, 1))
})

const periodEndDate = computed(() => {
    if (!periodStartDate.value) return
    const earliestEligibleDate = new Date(getYear(periodStartDate.value), getMonth(periodStartDate.value) + 1, FIRST_ELIGIBLE_PERIOD_DAY - 1)
    return isSunday(earliestEligibleDate) ? earliestEligibleDate : endOfWeek(earliestEligibleDate) // TODO vérifier février ?
})

const periodDays = computed(() => {
    if (!periodStartDate.value || !periodEndDate.value) return
    return eachDayOfInterval({ start: periodStartDate.value, end: periodEndDate.value })
})

const tableRows = computed(() => {
    return periodDays.value.reduce((days, day, index) => {
        days.push(day)
        if ((index + 1) % DAYS_IN_WEEK === 0) {
            days.push(null)
        }
        return days
    }, [])
})

const sheetId = computed(() => {
    return `${companyId.value} ${employeeId.value} ${periodCode.value}`
})

function getWorkingCount(date) {
    if (dateHolidays.isHoliday(date)) return "Fér."
    if (isSaturday(date) || isSunday(date)) return
    if (!workingDays?.value?.includes(getDay(date))) return "Non travaillé"
    return workingHourCount?.value
}
</script>

<template>
  <div class="preview bg-white p-6 pr-10 h-full overflow-y-scroll print:overflow-y-visible shadow" id="preview">
    <div class="flex">
        <span class="uppercase">{{ companyName }}</span>
        <span class="flex-1" /><span class="px-10 py-1 text-xl">{{ format(periodEndDate, "MMMM yyyy") }}</span>
        <span>{{ sheetId }}</span>
    </div>
    <table class="border-collapse text-xs ">
        <thead class="align-top">
            <tr>
                <th colspan="6" class="text-left pl-5">{{ employeeFullName }}</th>
                <th colspan="4" class="border border-black uppercase">Horaires de travail</th>
                <th colspan="7">
                    Du <span class="text-base">{{ periodStartDate && format(periodStartDate, "dd/MM") }}</span>
                    au <span class="text-base">{{ periodEndDate && format(periodEndDate, "dd/MM") }}</span>
                </th>
            </tr>
            <tr class="h-10">
                <th rowspan="2" class="w-20" />
                <th rowspan="2" class="border border-black w-10">Heures travaillées</th>
                <th colspan="2" class="border border-black">Absences</th>
                <th colspan="2" class="border border-black">Quantités</th>
                <th colspan="2" class="border border-black">Période 1</th>
                <th colspan="2" class="border border-black">Période 2</th>
                <th colspan="2" class="border border-black uppercase">Zone libre</th>
                <th class="border-0" />
                <th colspan="4" class="border border-black uppercase">Zone service paie</th>
            </tr>
            <tr>
                <th class="border border-black">Code*</th>
                <th class="border border-black">Heures</th>
                <th class="border border-black">Code*</th>
                <th class="border border-black">Quantité</th>
                <th class="border border-black leading-none">Heure arrivée</th>
                <th class="border border-black leading-none">Heure départ</th>
                <th class="border border-black leading-none">Heure arrivée</th>
                <th class="border border-black leading-none">Heure départ</th>
                <th v-for="index in 7" :key="index" class="border border-black" :class="{ 'border-0': index === 3 }">{{ index === 3 ? "" : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" }}</th>
                <!-- <th style="border: none;">CP</th> TODO allow congés payés to be easily applied -->
            </tr>
        </thead>
        <tbody>
            <tr v-for="day in tableRows" :key="day">
                <template v-if="!day">
                    <th class="block h-5" />
                    <td v-for="index in 12" :key="index" />
                    <td colspan="4" class="border border-black" />
                </template>
                <template v-else>
                    <th class="border border-black capitalize text-right text-sm">{{ format(day, "E dd/MM").replace(".", "") }}</th>
                    <td class="border border-black"><input class="h-full w-20" :value="getWorkingCount(day)" /></td>
                    <td v-for="index in 15" :key="index" class="border border-black" :class="{ 'border-0': index === 11 }" />
                    <!-- <td style="border: none;"><input type="checkbox" :checked="false" /></td> -->
                </template>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<style scoped>
.preview {
    width: 210mm;
    /* height: 297mm; */
}
</style>
