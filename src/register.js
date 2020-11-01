import Client from "./tools/client";
const app = new Vue({
    data: {
        form: {
            email: "",
            name: "",
            company: "",
        },
        show: true,
    },
    components: {},
    computed: {},
    methods: {
        async onSubmit(evt) {
            evt.preventDefault();
            let jsonData = {
                username: this.form.name,
                password: "abc123",
                tenant: this.form.company,
                email: this.form.email,
            };
            Client.setServer("http://localhost:5008");
            let res = await Client.register(
                this.form.name,
                "abc123",
                this.form.email,
                this.form.company
            );
            if (res.data.error) {
                this.$bvToast.toast(res.data.errMsg, {
                    title: "Register failed",
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
            this.form.name = "";
            this.form.company = "";
            // Trick to reset/clear native browser form validation state
            this.show = false;
            this.$nextTick(() => {
                this.show = true;
            });
        },
    },
}).$mount("#app");
