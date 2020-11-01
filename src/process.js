import Client from "./tools/client";
const app = new Vue({
  data: {
    form: {
      email: "",
      name: "",
      company: "",
    },
    show: true,
    showLogout: false,
    bobjects: [],
    objectFields: [
      {key: '_id', label: 'ID'},
      {key: 'tplid', label: 'Template'},
      {key: 'teamid', label: 'Team'},
      {key: 'starter', label: 'Starter'},
      {key: 'status', label: 'Status'},
    ],
    perPage: 10,
    currentObjectPage: 0,
    inputName: '',
    inputNameState: null,
    inputNameTitle: 'Input name',
    submittedNames: [],
    currentPrc: null,
    obj_action: '',
    listFilter: {},
    listSort: {},
    showOverlay: true,
  },
  components: {},
  computed: {},
  methods: {
    prc_view(aPrc) {
      window.location.href = "/designer.html?tplid=" + aPrc._id + "&mode=process";
    },

    prc_list_by_order(order) {
      this.showOverlay = true;
      this.listSort._id = order;
      this.refresh_list();
    },

    prc_list_by_status(st_status) {
      this.showOverlay = true;
      this.listFilter.status = st_status;
      if (st_status === "ST_ALL") this.listFilter.status = undefined;
      this.refresh_list();
    },

    async refresh_list() {
      this.bobjects = await Client.workflowGetList(this.listFilter, this.listSort);
      this.showOverlay = false;
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.inputNameState = valid
      return valid
    },
    resetModal() {
      this.inputName = ''
      this.inputNameState = null
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      console.log("handle submit", this.inputName);
      if (!this.checkFormValidity()) {
        console.log("return");
        return
      }
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-input-name')
      })

    },
  },
}).$mount("#app");

setTimeout(async () => {
  Client.setSessionToken();
  app.listFilter.status = "ST_RUN";
  app.prc_list_by_status();
  console.log(app.bobjects);
  console.log("Hello, world!");
}, 0);

