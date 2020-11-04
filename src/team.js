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
      {key: '_id', label: 'Team ID'},
      {key: 'teamid', label: 'Team Name'},
      {key: 'author', label: 'Creator'},
    ],
    perPage: 10,
    currentObjectPage: 0,
    inputName: '',
    inputNameState: null,
    inputNameTitle: 'Input name',
    team_inputName: '',
    team_inner_id: '',
    team_inputNameState: null,
    team_inputMembers: '',
    team_inputMembersState: null,
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
    async team_edit(aObj) {
      console.log(aObj);
      let obj = await Client.getTeamFullInfo(aObj.teamid);
      this.team_inner_id = obj._id;
      this.team_inputName = obj.teamid;
      let tmp = "";
      for (let key in obj.tmap) {
        for (let i = 0; i < obj.tmap[key].length; i++) {
          if (tmp !== "")
            tmp += "\n";
          tmp += key + "," + obj.tmap[key][i]["uid"] + "," + obj.tmap[key][i]["dname"];
        }
      }
      this.team_inputMembers = tmp;
    },

    team_delete() {
    },

    async refresh_list() {
      this.bobjects = await Client.getTeamList();
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
    onSubmit(evt) {
      evt.preventDefault();
      let tmap = {};
      let lines = this.team_inputMembers.split('\n');
      for (let i = 0; i < lines.length; i++) {
        let fields = lines[i].split(',');
        if (fields && fields.length !== 3) {
          continue;
        }
        if (tmap[fields[0]]) {
          tmap[fields[0]].push({uid: fields[1], dname: fields[2]});
        } else {
          tmap[fields[0]] = [{uid: fields[1], dname: fields[2]}];
        }
      }
      console.log(tmap);
      setTimeout(async () => {
        await Client.uploadTeam(
          this.team_inputName,
          tmap);
        await this.refresh_list();
      }, 0);
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.team_inputName = "";
      this.team_inputMembers = "";
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
  },
}).$mount("#app");

setTimeout(async () => {
  Client.setSessionToken();
  await app.refresh_list();
  console.log(app.bobjects);
}, 0);
