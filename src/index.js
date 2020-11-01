//import events from "events";
//import "./scss/custom.scss";
const app = new Vue({
  data: {},
  components: {},
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
