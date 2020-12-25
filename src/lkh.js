//import events from "events";
import ACTION_svg from "url:./images/ACTION.svg";
import INFORM_svg from "url:./images/INFORM.svg";
import SCRIPT_svg from "url:./images/SCRIPT.svg";
import TIMER_svg from "url:./images/TIMER.svg";
import START_svg from "url:./images/START.svg";
import END_svg from "url:./images/END.svg";
import AND_svg from "url:./images/AND.svg";
import SUB_svg from "url:./images/SUB.svg";
import OR_svg from "url:./images/OR.svg";
import connect_svg from "url:./images/connect.svg";
import pointer_svg from "url:./images/pointer.svg";
import "./scss/custom.scss";
import KFK from "./KFK";
import messages from "./i18messages";
import {NodeController} from "./nodeController";

let locale = navigator.language || navigator.userLanguage;
if (["zh-CN"].indexOf(locale) < 0) {
  locale = locale.split("-")[0];
}
console.log(locale);

const i18n = new VueI18n({
  locale: locale,
  messages,
});

const app = new Vue({
  i18n: i18n,
  data: {
    assets: {
      "ACTION.svg": ACTION_svg,
      "SCRIPT.svg": SCRIPT_svg,
      "TIMER.svg": TIMER_svg,
      "INFORM.svg": INFORM_svg,
      "START.svg": START_svg,
      "END.svg": END_svg,
      "AND.svg": AND_svg,
      "SUB.svg": SUB_svg,
      "OR.svg": OR_svg,
      "connect.svg": connect_svg,
      "pointer.svg": pointer_svg,
    },
    node: {
      ACTION: {id: '', label: '', role: '', kvars: '{}', katts: '{}', workitem: {status: '', doer: '', kvars: '{}', katts: '{}'}},
      SCRIPT: {id: '', label: '', code: ''},
      INFORM: {id: '', label: '', role: '', subject: '', content: ''},
      TIMER: {id: '', label: '', code: ''},
      SUB: {id: '', label: '', sub: ''},
    },
    state: {
      node: {
        ACTION: {id: true, label: true, role: true, },
        SCRIPT: {id: true, label: true, code: true, },
        INFORM: {id: true, label: true, role: true, subject: true, content: true, },
        TIMER: {id: true, label: true, code: true, },
        SUB: {id: true, label: true, sub: true, },
      }
    },
    KFK: KFK,
    modal_text: "",
    toolActiveState: {
      pointer: true,
      ACTION: false,
      INFORM: false,
      SCRIPT: false,
      TIMER: false,
      SUB: false,
      AND: false,
      OR: false,
      connect: false,
    },
    model: {
      signInButWaitVerify: false,
      isMobile: false,
      regForShared: false, //是否是接受到分享链接的用户来注册？
      loading_value: 0,
      msgbox: {
        title: "",
        content: "",
      },
      svg: {
        connect: {
          color: "red",
          width: 2,
          triangle: {
            width: 1,
            color: "blue",
            fill: "blue",
          },
        },
      },
      cocodoc: {
        doc_id: "dummydocnotallowed",
        name: "",
        prjid: "dummydocnotallowed",
        owner: "dummydocnotallowed",
        readonly: false,
        ownerAvatar_src: undefined,
        pms: 0,
      },
      perPage: 15,
      currentPrjPage: 1,
      viewConfig: {
        bgcolor: "#ABABAB",
        snap: true,
        showgrid: true,
        showlock: true,
        showbounding: true,
        showEditor: "last",
        nodemessage: true,
        autoFollow: true,
        autoLayout: true,
        docAcl: 0,
        drawOnTop: true,
        simpleLineMode: true,
      },
    },

  },
  computed: {
    checkKVarsJson() {
      try {
        JSON.parse(this.node.ACTION.kvars);
        return true;
      } catch (error) {return false;}
    },
    checkKAttsJson() {
      try {
        JSON.parse(this.node.ACTION.katts);
        return true;
      } catch (error) {return false;}
    }
  },
  methods: {
    async setData(data, key, value) {
      await this.$set(this[data], key, value);
    },

    setMode(mode, event) {
      KFK.setMode(mode, event);
    },
  },
}).$mount("#app");

NodeController.KFK = KFK;
KFK.NodeController = NodeController;
window.Buffer = window.Buffer || require("buffer").Buffer;
KFK.APP = app;
app.model.endpoint = KFK.config.ws_server.endpoint.label;
window.addEventListener(
  "dragenter",
  function (e) {
    let jtarget = $(e.target);
    if (jtarget.hasClass("svgcanvas") || jtarget.hasClass("pageBoundingLine")) {
      e.preventDefault();
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.dropEffect = "copy";
    } else {
      e.preventDefault();
      e.dataTransfer.effectAllowed = "none";
      e.dataTransfer.dropEffect = "none";
    }
  },
  false
);

window.addEventListener("dragover", function (e) {
  let jtarget = $(e.target);
  if (jtarget.hasClass("svgcanvas") || jtarget.hasClass("pageBoundingLine")) {
    e.preventDefault();
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.dropEffect = "copy";
  } else {
    e.preventDefault();
    e.dataTransfer.effectAllowed = "none";
    e.dataTransfer.dropEffect = "none";
  }
});

window.addEventListener("drop", async function (e) {
  let jtarget = $(e.target);
  if (KFK.toolboxMouseDown === true) {
    KFK.placeNodeOnClick(e);
    KFK.toolboxMouseDown = false;
    return;
  }
  if (jtarget.hasClass("svgcanvas") || jtarget.hasClass("pageBoundingLine")) {
    KFK.dropAtPos = {
      x: KFK.scrXToJc3X(e.clientX),
      y: KFK.scrYToJc3Y(e.clientY),
    };
    e.preventDefault();
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.dropEffect = "copy";
    await KFK.onDropFiles(e.dataTransfer.files);
  } else {
    e.preventDefault();
    e.dataTransfer.effectAllowed = "none";
    e.dataTransfer.dropEffect = "none";
  }
});

KFK.init();
KFK.APP = app;
