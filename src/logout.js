import Client from "./tools/client";
let token = localStorage.getItem("sessionToken");
let tmp = Client.logout(token);
localStorage.removeItem("sessionToken");
console.log(tmp);
const app = new Vue({
    data: {
        show: true,
    },
    components: {},
    computed: {},
    methods: {
    }
}).$mount("#app");

