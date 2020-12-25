//import events from "events";
//import "./scss/custom.scss";
import Sanddance from "./components/sanddance.vue";
const app = new Vue({
  data: {},
  components: {Sanddance},
  computed: {},
  methods: {
    gotoSignin() {
      window.location = "/pad/signin";
    },
    gotoSignon() {
      window.location = "/pad/signon";
    },
  },
}).$mount("#app");

let urlFull = window.location.href;
let host = $(location).attr("host");
let protocol = $(location).attr("protocol");
let urlBase = protocol + "//" + host;
let urlSearch = window.location.search;
let urlPath = window.location.pathname;
console.log("UrlSearch:", urlSearch);
