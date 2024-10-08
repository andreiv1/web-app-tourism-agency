<template>
    <v-pagination :length="pages" v-model="paginationOptions.page" @update:model-value="updatePagination"
    :total-visible="7"></v-pagination>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'TripPagination',
    computed: {
        ...mapState('trips', ['pagination', 'paginationOptions']),
        pages() {
            return Math.ceil(this.pagination.total / this.pagination.take)
        }
    },
    created() {
        console.log(this.paginationOptions)
    },
    methods: {
        ...mapActions('trips', ['updatePaginationOptions']),
        updatePagination() {
            this.updatePaginationOptions({ page: this.paginationOptions.page, take: this.paginationOptions.take })
        }
    }
}
</script>