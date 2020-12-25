import Client from "./tools/client";
const app = new Vue({
  data: {
    tplid: '',
    teamid: '',
    view_url: '',
    edit_url: '',
    workflow_url: '',
    wfid: '',
    workflowlink: '',
    showResult: false,
    teamSearchForm: {
      show: false,
      tplid: '',
      file1: null,
    },
    teams: [],
    teamFields: [
      {key: 'teamid', label: "Click for details and to pick"},
    ],
    teaminfo: {
      teamid: '',
      members: [],
    }
  },
  components: {},
  computed: {},
  methods: {
    hasValue: function (obj) {
      if (obj === undefined) return false;
      if (obj === null) return false;
      if (obj === "") return false;

      return true;
    },
    isEmpty: function (obj) {
      return !this.hasValue(obj);
    },
    list_refresh() {
      Client.getTeamList().then((list) => {
        app.teams = list;
      });
    },
    async pick_team(aObj) {
      let obj = await Client.getTeamFullInfo(aObj.teamid);
      this.teamid = aObj.teamid;
      this.teaminfo.teamid = aObj.teamid;
      this.teaminfo.members = [];
      for (let key in obj.tmap) {
        this.teaminfo.members.push({"role": key, "mapto": obj.tmap[key]});
        $(".noshow").removeClass("noshow");
      }
    },
    start_workflow() {
      if (this.isEmpty(this.tplid)) return;
      if (this.isEmpty(this.teamid)) return;
      setTimeout(async () => {
        let ret = await Client.startWorkflow(this.tplid, Client.getId(), this.teamid);
        console.log(ret);
        if (ret.status === "ST_RUN") {
          this.wfid = ret.wfid;
          this.showResult = true;
          this.workflow_url = "/lkh.html?wfid=" + this.wfid;
        } else {
          this.wfid = "";
          this.workflowlink = "";
          this.showResult = false;
          this.workflow_url = "";
        }
      }, 0);
    },
    view_workflow() {
      this.workflow_url = "/lkh.html?wfid=" + this.wfid;
    },

    searchTeam() {
      setTimeout(async () => {
        let payload = {pattern: app.teamSearchForm.teamid, limit: 10};
        if (app.hasValue(app.teamSearchForm.teamid) === false) {
          payload = {limit: 10};
          localStorage.removeItem("teampattern");
        } else {
          payload = {pattern: app.teamSearchForm.teamid, limit: 10};
          localStorage.setItem("teampattern", app.teamSearchForm.teamid);
        }
        Client.setSessionToken(); app.teams = await Client.getTeamList(payload);
      }, 0);
    },

    preventDefault(e) {
      e.preventDefault();
    }
  },
}).$mount("#app");

let localteampattern = localStorage.getItem("teampattern");
if (app.hasValue(localteampattern)) {
  app.teamSearchForm.teamid = localteampattern;
}
app.searchTeam();

setInterval(async () => {
  let token = localStorage.getItem("sessionToken");
  if (!token) {
    app.showLogout = false;
    window.location.href = "/login.html";
  } else {
    app.showLogout = true;
  }
}, 3000);

let urlFull = window.location.href;
let myURL = new URL(urlFull);
app.tplid = myURL.searchParams.get("tplid");
app.view_url = "/lkh.html?tplid=" + app.tplid + "&mode=view";
app.edit_url = "/lkh.html?tplid=" + app.tplid + "&mode=edit";
