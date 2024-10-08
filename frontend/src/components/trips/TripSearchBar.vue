<template>
    <v-text-field label="Search trips..." solo-inverted prepend-inner-icon="mdi-magnify" rounded density="comfortable"
        variant="solo" :clearable="true" v-model:model-value="searchQuery"></v-text-field>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'TripSearchBar',
    data() {
        return {
            searchQuery: ''
        }
    },
    methods: {
        ...mapActions('trips', ['fetchItems']),
    },
    watch: {
        searchQuery: {
            handler(newSearchQuery) {
                if (newSearchQuery !== undefined) {
                    this.fetchItems(newSearchQuery).then(() => {
                      
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            },
            immediate: false
        }
    }
}
</script>