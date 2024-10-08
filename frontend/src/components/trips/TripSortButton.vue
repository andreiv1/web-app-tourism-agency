<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-chip class="px-8 py-6 w-100 d-flex align-center justify-center" v-bind="props" prepend-icon="mdi-sort">
                Sort by {{ sortByOptions[selectedSortIdx].title }}

                <v-icon v-if="sortByOptions[selectedSortIdx].value == 'descending'" icon="mdi-menu-up"></v-icon>
                <v-icon v-if="sortByOptions[selectedSortIdx].value == 'ascending'" icon="mdi-menu-down"></v-icon>
            </v-chip>

        </template>
        <v-list class="mt-2">
            <v-list-item v-for="(item, index) in sortByOptions" :key="index" :value="index" @click="updateSort(index)">
                <template v-slot:prepend>
                    <v-icon v-if="item.checked" icon="mdi-check"></v-icon>
                    <v-icon v-else icon=""></v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <template v-slot:append>
                    <v-icon v-if="item.checked && item.value == 'descending'" icon="mdi-sort-descending"></v-icon>
                    <v-icon v-if="item.checked && item.value == 'ascending'" icon="mdi-sort-ascending"></v-icon>
                    <v-icon v-else icon=""></v-icon>
                </template>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: 'TripSortButton',
    data() {
        return {
            selectedSortIdx: 0,
            sortByOptions: [{
                title: 'Date',
                key: 'date',
                value: 'ascending',
                checked: false
            }, {
                title: 'Price',
                key: 'price',
                value: null,
                checked: false,
            }, {
                title: 'Title',
                key: 'title',
                value: null,
                checked: false
            }]
        };
    },
    created() {
        this.sortByOptions[this.selectedSortIdx].checked = true
    },
    methods: {
        ...mapActions('trips', ['updateSortOptions']),
        updateSort(newIndex) {
            const oldIdx = this.selectedSortIdx
            this.selectedSortIdx = newIndex
            this.sortByOptions[oldIdx].checked = false
            this.sortByOptions[newIndex].checked = true

            if (oldIdx == newIndex) {
                if (this.sortByOptions[newIndex].value == "descending") {
                    this.sortByOptions[newIndex].value = "ascending"
                } else {
                    this.sortByOptions[newIndex].value = "descending"
                }
            } else {
                this.sortByOptions[oldIdx].value = null
                this.sortByOptions[newIndex].value = "ascending"
            }

            const sort = this.sortByOptions[newIndex]
            this.updateTripList()
        },
        currentSort() {
            return this.sortByOptions[this.selectedSortIdx]
        },
        updateTripList(){
            this.updateSortOptions({
                sortBy: this.currentSort().key,
                sortOrder: this.currentSort().value == "descending" ? "desc" : "asc"
            })
        }
    }
}
</script>

