<template>
    <div>
        <a-page-header
                style="border: 1px solid rgb(235, 237, 240)"
                title="Dashboard"
                sub-title="This is the dashboard"
        >
            <template slot="extra">
                <a-dropdown>
                    <a-menu slot="overlay">
                        <a-menu-item @click="logout" key="1"> <a-icon type="user" />Logout </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 8px"> {{ username }} <a-icon type="down" /> </a-button>
                </a-dropdown>
            </template>
        </a-page-header>
        <a-row>
            <router-view />
        </a-row>
    </div>
</template>

<script>
    export default {
        name: "LayoutHeader",
        data: () => ({
            username: ''
        }),
        mounted() {
            let token = localStorage.getItem('user_token')
            this.user = this.parseJwt(token);
            console.log(this.user)
            this.username = this.user.username
        },
        methods: {
            logout: function() {
                this.$store.dispatch('logout').then(() => {
                    this.$router.push('/login')
                })
            },
            parseJwt(token) {
                try {
                    return JSON.parse(atob(token.split('.')[1]))
                } catch (error) {
                    throw new Error(error)
                }
            }
        }
    }
</script>

<style scoped>

</style>