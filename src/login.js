import Client from "./tools/client";
const app = new Vue({
    data: {
        form: {
            email: "",
            password: "",
        },
        show: true,
    },
    components: {},
    computed: {},
    methods: {
        async onSubmit(evt) {
            evt.preventDefault();
            Client.setServer("http://localhost:5008");
            let res = await Client.login(
                this.form.email,
                this.form.password,
            );
            if (res.data.error) {
                console.log(res);
                console.log(res.data.message);
                app.$bvToast.toast(res.data.message, {
                    title: "Login failed",
                    variant: "warning",
                    solid: true,
                });
                localStorage.removeItem("sessionToken");
            } else {
                let token = res.data.sessionToken;
                localStorage.setItem("sessionToken", token);
                window.location.href = "/studio.html";
            }
        },
        onReset(evt) {
            evt.preventDefault();
            // Reset our form values
            this.form.email = "";
            this.form.password = "";
            // Trick to reset/clear native browser form validation state
            this.show = false;
            this.$nextTick(() => {
                this.show = true;
            });
        },
    },
}).$mount("#app");
