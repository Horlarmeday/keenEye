<template>
    <a-row>
        <a-col :span="12" :offset="6">
            <a-card>
                <a-form
                    id="components-form-demo-normal-login"
                    :form="form"
                    class="login-form"
                    @submit="handleSubmit"
            >
                <a-form-item>
                    <a-input
                            v-decorator="[
          'email',
          { rules: [{ required: true, message: 'Please input your email!' }] },
        ]"
                            placeholder="Email"
                            type="email"
                            id="email"
                    >
                        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-input
                            v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] },
        ]"
                            type="password"
                            id="password"
                            placeholder="Password"
                    >
                        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit" class="login-form-button" id="submitButton">
                        Log in
                    </a-button>

                </a-form-item>
            </a-form>
                <a-button style="padding-right: inherit" @click="loginWithGoogle" type="primary" html-type="submit" class="login-form-button">
                    Log in with Google
                </a-button>
            </a-card>
        </a-col>
    </a-row>

</template>

<script>
    export default {
        name: 'LoginPage',
        beforeCreate() {
            this.form = this.$form.createForm(this, { name: 'normal_login' });
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    console.log(values)
                    if (!err) {
                        this.$store
                            .dispatch("login", { ...values })
                            .then(() => {
                                this.$router.push("/dashboard");
                            })
                            .catch(() => {});
                    }
                });
            },
            loginWithGoogle() {
                window.location = `${process.env.VUE_APP_BACKEND_URL}/auth/google`;
            },
        },
    }
</script>

<style scoped>
    #components-form-demo-normal-login .login-form {
        max-width: 300px;
    }
    #components-form-demo-normal-login .login-form-forgot {
        float: right;
    }
    #components-form-demo-normal-login .login-form-button {
        width: 100%;
        text-align: center;
    }
</style>