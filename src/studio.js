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
    templates: [],
    templateFields: [
      {key: 'tplid', label: 'Template ID'},
      {key: 'author', label: 'Author'},
      {key: 'updatedAt', label: 'Updated at'}
    ],
    perPage: 10,
    currentTemplatePage: 0,
    inputName: '',
    inputNameState: null,
    inputNameTitle: 'Input name',
    submittedNames: [],
    currentTpl: null,
    tpl_action: '',
  },
  components: {},
  computed: {},
  methods: {
    tpl_view(aTpl) {
      window.location.href = "/designer.html?tplid=" + aTpl._id + "&mode=view";
    },
    tpl_edit(aTpl) {
      window.location.href = "/designer.html?tplid=" + aTpl._id + "&mode=view";
    },
    tpl_rename(aTpl) {
      console.log("Rename " + aTpl._id);
      this.inputName = aTpl.tplid;
      this.currentTpl = aTpl;
      this.tpl_action = "rename";
      this.inputNameTitle = "Please input a new name";
      this.$root.$emit('bv::show::modal', 'modal-input-name');
    },
    tpl_copy(aTpl) {
      console.log("Copy " + aTpl._id);
      setTimeout(async () => {
        await Client.makeCopyOfTemplate(aTpl._id);
        app.templates = await Client.listTemplate();
      }, 0);
    },
    tpl_delete(aTpl) {
      console.log("Delete " + aTpl._id);

      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete', {
        title: 'Please Confirm',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          if (value) {
            setTimeout(async () => {
              await Client.deleteTemplate(aTpl._id);
              app.templates = await Client.listTemplate();
            }, 0);

          }
        })
        .catch(err => {
          console.error(err);
        })
    },
    tpl_create() {
      console.log("create a new teamplte object, then goto designer");
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

      if (this.tpl_action === "rename") {
        console.log("Rename", this.currentTpl.tplid);
        console.log("Rename to ", this.inputName);
        if (this.currentTpl.tplid !== this.inputName) {
          let nameExist = false;
          for (let i = 0; i < this.templates.length; i++) {
            if (this.templates[i].tplid !== this.currentTpl.tplid && this.templates[i].tplid === this.inputName) {
              nameExist = true;
              this.$bvToast.toast("名称已被占用", {title: "修改模板名称", variant: "warning", solid: true});
            }
          }
          if (nameExist === false) {
            this.currentTpl.tplid = this.inputName;
            console.log("Call API now");
            this.resetModal();
            setTimeout(async () => {
              let ret = await Client.renameTemplate(this.currentTpl._id, this.currentTpl.tplid);
              this.$bvToast.toast(`新名称:${ret.tplid}`, {title: "修改模板名称", variant: "warning", solid: true});
            }, 0);
          }
        }
      }
    },
  },
}).$mount("#app");

setTimeout(async () => {
  Client.setSessionToken();
  app.templates = await Client.listTemplate();
  console.log(app.templates);
  console.log("Hello, world!");
}, 0);

setInterval(async () => {
  let token = localStorage.getItem("sessionToken");
  if (!token) {
    app.showLogout = false;
    window.location.href = "/login.html";
  } else {
    app.showLogout = true;
  }
}, 3000);
