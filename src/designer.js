import Client from "./tools/client";
import url from "url";

const app = new Vue({
  data: {
    form: {
      email: "",
      name: "",
      company: "",
    },
    show: true,
    showLogout: false,
    templates: [],
    templateFields: [
      {key: 'tplid', label: 'ID'},
      {key: 'author', label: 'Author'},
      {key: 'updatedAt', label: 'Update at'}
    ],
    perPage: 10,
    currentTemplatePage: 0,
  },
  components: {},
  computed: {},
  methods: {
    tpl_view: (aTpl) => {
      window.location.href = "/designer.html?tplid=" + aTpl._id + "&mode=view";
    },
    tpl_edit: (aTpl) => {
      window.location.href = "/designer.html?tplid=" + aTpl._id + "&mode=view";
    },
    tpl_rename: (aTpl) => {
      console.log("Rename " + aTpl._id);
    },
    tpl_copy: (aTpl) => {
      console.log("Copy " + aTpl._id);
    },
    tpl_delete: (aTpl) => {
      console.log("Delete " + aTpl._id);
    },
  },
}).$mount("#app");

let q = url.parse(window.location.href, true);
console.log(q.query);
