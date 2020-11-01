const axios = require("axios").default;

const Client = {
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
        maxContentLength: 2000,

        // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed
        maxBodyLength: 2000,
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
        try {
            let res = await axios.post(uri, payload, Client.axiosOptions);
            return res;
        } catch (error) {
            console.error(error.response.data.message);
            return error.response;
        }
    },
    doGet: async function (uri) {
        let ret = Client._get(uri);
        return ret.data;
    },
    _get: async function (uri) {
        //Client.axiosOptions.data = payload;
        try {
            return await axios.get(uri, Client.axiosOptions);
        } catch (error) {
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

    uploadTemplate: async function (tpl_data) {
        let ret = await Client._post("/template/upload", {
            doc: tpl_data,
        });
        return ret.data;
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
    deleteTemplate: async function (_id) {
        let ret = await Client._post("/template/delete", {
            _id: _id,
        });
        return ret.data;
    },
    makeCopyOfTemplate: async function (_id) {
        let ret = await Client._post("/template/makecopy", {
            _id: _id
        });
        return ret.data;
    },

    startWorkflow: async function (tplid, wfid) {
        let ret = await Client._post("/workflow/start", {
            tplid: tplid,
            wfid: wfid,
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
        console.log(payload);
        let ret = await Client._post("/team/upload", payload);
        return ret.data;
    },

    teamGetFullInfo: async function (_id) {
        let ret = await Client._get(`/team/fullinfo/${_id}`);
        return ret.data;
    },

    teamGetList: async function (filter, aSort) {
        let ret = await Client._post("/team/list");
        return ret.data;
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
        if (response.data && response.data.error) {
            if (response.data.error.name === "MongoError") {
                if (response.data.error.code === 11000) {
                    let str = response.data.errMsg;
                    if (str.indexOf("username") >= 0) {
                        response.data.errMsg = "Duplicated user name";
                    } else if (str.indexOf("email") >= 0) {
                        response.data.errMsg = "Duplicated email";
                    } else {
                        response.data.errMsg = "Duplicated info";
                    }
                } else {
                    response.data.errMsg = "Database error";
                }
            }
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

    setSessionToken: function (token) {
        if (token)
            Client.setHeader("authorization", token);
        else {
            if (localStorage) {
                let token = localStorage.getItem("sessionToken");
                if (token)
                    Client.setHeader("authorization", token);
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
