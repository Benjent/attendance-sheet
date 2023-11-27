<script setup>
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { addWeeks, eachDayOfInterval, endOfWeek, format, getDay, getMonth, getYear, isMonday, isSaturday, isSunday, isValid, setDefaultOptions, startOfWeek } from "date-fns"
import { fr } from "date-fns/locale"
import Holidays from "date-holidays"
import { useEmployeeStore } from "@/stores/employee"
import { usePeriodStore } from "@/stores/period"
import { DAYS_IN_WEEK, FIRST_ELIGIBLE_PERIOD_DAY, PERIOD_CODE_LENGTH } from "@/globals"

setDefaultOptions({ locale: fr })
const dateHolidays = new Holidays("FR")

const { accountant, companyId, companyName, employeeFullName, employeeId, employeeSignature, workingDays, workingHourCount } = storeToRefs(useEmployeeStore())
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

function getWorkingCount (date) {
    if (dateHolidays.isHoliday(date)) return "Fér."
    if (isSaturday(date) || isSunday(date)) return
    if (!workingDays?.value?.includes(getDay(date))) return "Non travaillé"
    return workingHourCount?.value
}
</script>

<template>
  <div class="preview bg-white p-6 pr-10 h-full overflow-y-scroll print:overflow-y-visible" id="preview">
    <div class="flex">
        <span class="uppercase">{{ companyName }}</span>
        <span class="flex-1" /><span class="px-10 py-1 text-xl">{{ isValid(periodEndDate) && format(periodEndDate, "MMMM yyyy") }}</span>
        <span>{{ sheetId }}</span>
    </div>
    <table class="border-collapse text-xs ">
        <thead class="align-top">
            <tr>
                <th colspan="6" class="text-left pl-5">{{ employeeFullName }}</th>
                <th colspan="4" class="border border-black uppercase">Horaires de travail</th>
                <th colspan="7">
                    Du <span class="text-base">{{ isValid(periodStartDate) && format(periodStartDate, "dd/MM") }}</span>
                    au <span class="text-base">{{ isValid(periodEndDate) && format(periodEndDate, "dd/MM") }}</span>
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
                </template>
            </tr>
        </tbody>
    </table>
    <footer class="grid w-full mt-20">
        <div class="flex w-full">
            <span class="uppercase text-right w-1/4">Congés payés du&nbsp;:</span>
            <span>
                <input class="w-10 text-center" />/<input class="w-10 text-center" />/<input class="w-10 text-center" />
            </span>
            <span class="text-sm">(1er jour où le salarié aurait du travailler s'il n'était pas en congé)</span>
        </div>
        <div class="flex w-full">
            <span class="uppercase text-right w-1/4">au&nbsp;:</span>
            <span>
                <input class="w-10 text-center" />/<input class="w-10 text-center" />/<input class="w-10 text-center" />
            </span>
            <span class="text-sm">(veille du jour de reprise)</span>
        </div>
        <div class="flex gap-4">
            <div>
                <div>
                    <span class="uppercase">Journée de solidarité&nbsp;:</span>
                    <span> {{ workingHourCount }} heures, le</span>
                    <span>
                        <input class="w-10" />/<input class="w-10" />
                    </span>
                </div>
                <div class="flex gap-2">
                    <label class="flex flex-col border border-black flex-1 h-20">
                        Signature du salarié&nbsp;:
                        <span v-html="employeeSignature" class="w-full h-3/4" />
                    </label>
                    <div class="flex flex-col">
                        <span class="text-sm font-bold">{{ sheetId }}</span>
                        <span class="text-sm">Traitement par</span>
                        <span class="font-bold">{{ accountant }}</span>
                    </div>
                </div>
                <p class="text-xs">*&nbsp;: Utiliser les codes joints</p>
            </div>
            <div>
                <label class="flex flex-col border border-black h-full">
                    <span class="uppercase text-sm">Informations complémentaires&nbsp;:</span>
                    <div class="h-full m-2">
                        <input class="w-full h-full" />
                    </div>
                </label>
                <p class="uppercase text-xs">En cas de sortie du salarié, compléter le cadre ci-joint</p>
            </div>
        </div>
    </footer>
  </div>
</template>

<style scoped>
.preview {
    width: 210mm;
    /* height: 297mm; */
}
</style>
