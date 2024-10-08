<template>
    <v-container fluid fill-height>
        <v-row class="align-center justify-center" dense style="height: 35vh">
            <v-col cols="12" sm="8" md="6">
                <v-card height="250px" class="text-center">
                    <v-card-title class="mt-10">
                        <h1>Page Not Found</h1>
                    </v-card-title>
                    <v-card-text class="mt-5">
                        <p>The page you are looking for does not exist.</p>
                    </v-card-text>
                    <v-card-actions class="mt-5 d-flex justify-center">
                        <router-link to="/">
                            <v-btn color="red">Go Home</v-btn>
                        </router-link>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
