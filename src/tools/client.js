const axios = require("axios").default;
const uuidv4 = require("uuid/v4");

const Client = {
    getId: function () {
        return uuidv4();
    },
    hasValue: function (obj) {
        if (obj === undefined) return false;
        if (obj === null) return false;
        if (obj === "") return false;

        return true;
    },
    isEmpty: function (obj) {
        return !this.hasValue(obj);
    },

    axiosOptions: {
        baseURL: "http://localhost:5008",
        timeout: 1000, // 1 second, default: unlimited
        headers: {
            /* http headers */
        },
        responseType: "json",
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        onUploadProgress: function (progressEvent) {
            // Do whatever you want with the native progress event
        },
        onDownloadProgress: function (progressEvent) {
            // Do whatever you want with the native progress event
        },

        // `maxContentLength` defines the max size of the http response content in bytes allowed in node.js
        maxContentLength: 20000,

        // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed
        maxBodyLength: 20000,
        maxRedirects: 3,
        /* httpAgent: new http.Agent({ keepAlive: true }),
         * httpsAgent: new https.Agent({ keepAlive: true }), */
    },

    setHeader: function (k, v) {
        Client.axiosOptions.headers[k] = v;
    },
    doPost: async function (uri, payload) {
        let ret = await Client._post(uri, payload);
        return ret.data;
    },
    _post: async function (uri, payload) {
        console.log(payload);
        let res = await axios.post(uri, payload, Client.axiosOptions);
        if (this.isEmpty(res.data)) {
            throw new Error(`API Server return ${res.data}`);
        }
        if (res.data.error) {
            throw new Error(res.data.errMsg);
        }
        return res;
    },
    _download: async function (uri, payload) {
        await axios.post(uri, payload, Client.axiosOptions);
    },
    doGet: async function (uri) {
        let ret = Client._get(uri);
        return ret.data;
    },

    _get: async function (uri) {
        try {
            let ret = await axios.get(uri, Client.axiosOptions);
            return ret;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    setServer: function (url) {
        Client.axiosOptions.baseUrl = url;
    },

    getWorkitems: async function (doer, filter = null) {
        let res = await Client._post("/work/list", {
            doer: doer,
            filter: filter ? filter : {},
        });
        return res.data;
    },

    createTemplate: async function (tplid) {
        console.log("tplid: ", tplid);
        let ret = await Client._post("/template/create", {tplid: tplid});
        return ret.data;
    },

    putTemplate: async function (tpl_data) {
        let ret = await Client._post("/template/put", {
            doc: tpl_data,
        });
        return ret.data;
    },

    importTemplateXML: async function (tplid, fileObj) {
        var formData = new FormData();
        formData.append('tplid', tplid);
        formData.append('file', fileObj, fileObj.name);
        let option = Client.axiosOptions;
        let token = this.getSessionToken();
        if (token === null) {
            console.error("No session token in localStorage");
            return;
        }
        option.headers = {
            "Content-Type": "multipart/form-data",
            "authorization": token
        };
        let res = await axios.post("/template/import", formData, option);
        return res;
    },

    readTemplate: async function (tpl_id) {
        let ret = await Client._post("/template/read", {
            tplid: tpl_id,
        });
        return ret.data;
    },
    readWorkflow: async function (wfid) {
        let ret = await Client._post("/workflow/read", {
            wfid: wfid,
        });
        return ret.data;
    },
    exportTemplate: async function (tpl_id) {
        //拷贝一份option，不影响原option
        let tmpOption = Client.axiosOptions;
        //需要设置responseType为blob
        //原axiosOptions中的responseType为json, 服务端返回的数据如果不是json格式, 数据会变为null
        tmpOption.responseType = "blob";
        axios.post("/template/download", {
            tplid: tpl_id,
        }, tmpOption).then(response => {
            //构建这个内部数据的访问url
            const url = window.URL.createObjectURL(new Blob([response.data]));
            //删除之前添加的临时连接
            $('.tempLink').remove();
            //创建一个新的临时连接
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${tpl_id}.xml`); //or any other extension
            link.setAttribute('class', "tempLink");
            document.body.appendChild(link);
            //点击这个临时连接实现内容下载
            link.click();
        });
    },

    listTemplate: async function () {
        let ret = await Client._get("/template/list");
        return ret.data;
    },

    renameTemplate: async function (_id, tplid) {
        let ret = await Client._post("/template/rename", {
            _id: _id,
            tplid: tplid
        });
        return ret.data;
    },

    /**
     * return object {n: 1, deletedCount:1, ok:1}
     */
    deleteTemplate: async function (_id) {
        let ret = await Client._post("/template/delete", {
            _id: _id,
        });
        return ret.data;
    },

    /**
     * return object {n: 1, deletedCount:1, ok:1}
     */
    deleteTemplateByName: async function (tplid) {
        let ret = await Client._post("/template/delete/byname", {
            tplid: tplid,
        });
        return ret.data;
    },
    makeCopyOfTemplate: async function (_id) {
        let ret = await Client._post("/template/makecopy", {
            _id: _id
        });
        return ret.data;
    },

    startWorkflow: async function (tplid, wfid, teamid) {
        let ret = await Client._post("/workflow/start", {
            tplid: tplid,
            wfid: wfid,
            teamid: teamid
        });
        return ret.data;
    },

    pauseWorkflow: async function (wfid) {
        let ret = await Client._post("/workflow/pause", {
            wfid: wfid,
        });
        return ret.data;
    },

    resumeWorkflow: async function (wfid) {
        let ret = await Client._post("/workflow/resume", {
            wfid: wfid,
        });
        return ret.data;
    },
    stopWorkflow: async function (wfid) {
        let ret = await Client._post("/workflow/stop", {
            wfid: wfid,
        });
        return ret.data;
    },

    workflowGetList: async function (filter, aSort) {
        let ret = await Client._post("/workflow/list", {
            filter: filter,
            sortdef: aSort
        });
        return ret.data;
    },

    workflowGetLatest: async function (filter) {
        let ret = await Client._post("/workflow/latest", {
            filter: filter,
        });
        return ret.data;
    },

    destroyWorkflow: async function (wfid) {
        let ret = await Client._post("/workflow/destroy", {wfid: wfid});
        return ret.data;
    },

    doWork: async function (doer, workid, kvars = {}, route = "DEFAULT") {
        let ret = await Client._post("/work/do", {
            doer: doer,
            workid: workid,
            route: route,
            kvars: kvars,
        });
        return ret.data;
    },
    doWorkByNode: async function (
        doer,
        wfid,
        nodeid,
        kvars = {},
        route = "DEFAULT"
    ) {
        let ret = await Client._post("/work/do", {
            doer: doer,
            wfid: wfid,
            nodeid: nodeid,
            route: route,
            kvars: kvars,
        });
        return ret.data;
    },

    getKVars: async function (wfid, workid) {
        let ret = await Client._post(
            "/workflow/kvars",
            workid ?
                {
                    wfid: wfid,
                    workid: workid,
                } :
                {
                    wfid: wfid,
                }
        );
        return ret.data;
    },

    getStatus: async function (wfid, workid) {
        let ret = "ST_UNKNOWN";
        if (workid)
            ret = await Client._post("/work/status", {
                wfid: wfid,
                workid: workid,
            });
        else
            ret = await Client._post("/workflow/status", {
                wfid: wfid,
            });

        return ret.data;
    },

    revoke: async function (wfid, workid) {
        let ret = await Client._post("/work/revoke", {
            tenant: Client.tenant,
            wfid: wfid,
            workid: workid,
        });
        return ret.data;
    },

    sendback: async function (wfid, workid) {
        let ret = await Client._post("/work/sendback", {
            wfid: wfid,
            workid: workid,
        });
        return ret.data;
    },

    getWorkitemFullInfo: async function (wfid, workid) {
        let ret = await Client._post("/work/info", {
            wfid: wfid,
            workid: workid,
        });

        return ret.data;
    },

    uploadTeam: async function (name, tmap) {
        let payload = {teamid: name, tmap: tmap};
        let ret = await Client._post("/team/upload", payload);
        return ret.data;
    },

    importTeamCSV: async function (teamid, fileObj) {
        if (this.isEmpty(teamid)) return;
        var formData = new FormData();
        formData.append('teamid', teamid);
        formData.append('file', fileObj, fileObj.name);
        let option = Client.axiosOptions;
        let token = this.getSessionToken();
        if (token === null) {
            console.error("No session token in localStorage");
            return;
        }
        option.headers = {
            "Content-Type": "multipart/form-data",
            "authorization": token
        };
        let res = await axios.post("/team/import", formData, option);
        return res;
    },

    getTeamFullInfo: async function (teamid) {
        let ret = await Client._get(`/team/fullinfo/${teamid}`);
        return ret.data;
    },

    getTeamList: async function (payload) {
        payload = payload ? payload : {limit: 1000};
        ret = await Client._post("/team/list", payload);
        return ret.data;
    },

    getCallbackPoints: async function (cbpFilter) {
        let ret = await Client._post("/cbps", cbpFilter);
        return ret.data;
    },

    getLatestCallbackPoint: async function (cbpFilter) {
        let ret = await Client._post("/cbps/latest", cbpFilter);
        return ret.data;
    },

    /**
     *     callback: callback to workflow
     *
     * @param {...} cbp - Callback point
     * @param {...} kvars - kvars to inject
     * @param {...} atts - attachments to inject
     *
     * @return {...}
     */
    callback: async function (cbp, route, kvars, atts) {
        let payload = {cbp: cbp};
        if (typeof route === "string") {
            payload.route = route;
            if (kvars) {
                payload.kvars = kvars;
                if (atts) {
                    payload.atts = atts;
                }
            }
        } else if (typeof route === "object") {
            payload.route = "DEFAULT";
            payload.kvars = route;
            if (kvars) {
                payload.atts = kvars;
            }
        }
        let ret = await Client._post("/callback", payload);
        return ret.data;
    },

    deleteTeam: async function (name) {
        let payload = {teamid: name};
        let ret = await Client._post("/team/delete", payload);
        return ret.data;
    },

    __checkError: function (ret) {
        if (ret.errors) {
            throw new Error(ret.errors);
        }
    },

    register: async function (username, password, email, tenant) {
        Client.setHeader("Content-type", "application/json");
        let response = await Client._post("/account/register", {
            username: username,
            password: password,
            email: email,
            tenant: tenant,
        });
        if (response.data && response.data.sessionToken) {
            Client.setHeader("authorization", response.data.sessionToken);
        }
        return response;
    },

    login: async function (email, password) {
        Client.setHeader("Content-type", "application/json");
        let response = await Client._post("/account/login", {
            email: email,
            password: password,
        });
        if (response.data && response.data.sessionToken) {
            Client.setHeader("authorization", response.data.sessionToken);
        }
        return response;
    },

    getSessionToken: function () {
        if (localStorage) {
            let token = localStorage.getItem("sessionToken");
            if (token) {
                return `Bearer ${token}`;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    setSessionToken: function (token) {
        if (token) {
            console.log("Client authorization token", token);
            Client.setHeader("authorization", `Bearer ${token}`);
        } else {
            if (localStorage) {
                let token = localStorage.getItem("sessionToken");
                if (token) {
                    Client.setHeader("authorization", `Bearer ${token}`);
                    console.log("Client authorization token", token);
                }
            }
        }
    },

    profile: async function () {
        let response = await Client._get("/account/profile/me");
        return response.data;
    },


    logout: async function (token) {
        if (token) {
            Client.setHeader("authorization", token);
        }
        let response = await Client._post("/account/logout", {});
        return response;
    },
};

module.exports = Client;
