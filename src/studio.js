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
    justCreated: '',
  },
  components: {},
  computed: {},
  methods: {
    list_refresh() {
      Client.listTemplate().then((list) => {
        app.templates = list;
      });
    },
    tpl_view(aTpl) {
      window.location.href = "/designer.html?tplid=" + aTpl._id + "&mode=view";
    },
    tpl_edit(aTpl) {
      window.location.href = "/designer.html?tplid=" + aTpl._id + "&mode=edit";
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
      //TODO: create a new teamplte object, then goto designer
      this.inputName = '';
      this.tpl_action = "create";
      this.inputNameTitle = "The template name is:";
      this.$root.$emit('bv::show::modal', 'modal-input-name');
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
      if (!this.checkFormValidity()) {
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
      } else if (this.tpl_action === "create") {
        let nameExist = false;
        let theName = this.inputName;
        for (let i = 0; i < this.templates.length; i++) {
          if (this.templates[i].tplid === this.inputName) {
            nameExist = true;
            this.$bvToast.toast("名称已被占用", {title: "新建模板", variant: "warning", solid: true});
          }
        }
        if (nameExist === false) {
          this.resetModal();
          setTimeout(async () => {
            try {
              let ret = await Client.createTemplate(theName);
              app.justCreated = ret._id;
              //Move justcreated to the first position
              let tmp = await Client.listTemplate();
              let justCreatedIndex = -1;
              for (let i = 0; i < tmp.length; i++) {
                if (tmp[i]._id === app.justCreated) {
                  justCreatedIndex = i;
                }
              }
              if (justCreatedIndex > 0) {
                let a = tmp[0];
                tmp[0] = tmp[justCreatedIndex];
                tmp[justCreatedIndex] = a;
              }
              app.templates = tmp;
              //Show first page
              app.currentTemplatePage = 0;
            } catch (error) {
              console.log(error);
              app.$bvToast.toast(`新建模板:${theName} 失败`, {title: "新建模板", variant: "warning", solid: true});
            }
          }, 0);
        }
      }
    },

  },
}).$mount("#app");

setTimeout(async () => {
  Client.setSessionToken();
  app.templates = await Client.listTemplate();
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
