/*************** Generic functions ***************/
changeServer = () => {
    //change FHIR servers and  Update the credentials
    dataParams.baseCredentials = btoa(`${FHIRRefByRef(dataParams.servers, "server", dataParams.baseURL, "un")}:${FHIRRefByRef(dataParams.servers, "server", dataParams.baseURL, "pw")}`);
}

addItemToSelect = (selectID, itemsAr) => {
    //Populate list of FHIR servers
    let sel = document.getElementById(selectID);
    itemsAr.forEach(element => {
        opt = document.createElement("option");
        opt.text = element;
        sel.add(opt);
    });
};

FHIRRefByRef = (ar, searchName, searchValue, getNode) => {
    //Find a name=value in a FHIR array, and return a given node within. (E.g. Find link["relation"]="next" and return the URL)
    for (let i = 0; i < ar.length; i++) {
        if (ar[i][searchName] == searchValue) {
            return ar[i][getNode];
            break;
        }
    }
    return "";
}

function keypressDelay(fn, ms) {
    //Wait for a small delay while typing in the search box before calling the server
    let timer = 0
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(fn.bind(this, ...args), ms || 0)
    }
}

getParam = (paramList, section, param) => {
    //Get the parameter value from the subsection first; otherwise get it from the root
    return paramList[section][param] || paramList[param]
}

updateStyleRule = (selectorVal, property, newVal, toggleVal = null) => {
    //---Update a CSS property. Optionally include a toggleVal, which will cause the CSS property to toggle between newVal and toggleVal
    for (let i = 0; i < document.styleSheets.length; i++) {
        let ss = document.styleSheets[i];
        if (ss.ownerNode.toString() == "[object HTMLStyleElement]") {   //cannot operate on linked (external) stylesheets
            for (let j = 0; j < ss.cssRules.length; j++) {
                if (ss.cssRules[j].selectorText == selectorVal) {
                    if (toggleVal) {
                        let prop = ss.cssRules[j].style.getPropertyValue(property);
                        ss.cssRules[j].style.setProperty(property, (prop == newVal ? toggleVal : newVal));
                    } else {
                        ss.cssRules[j].style.setProperty(property, newVal);
                    }
                }
            }
        }
    }
}

addStyleRule = (rule) => {
    //---Add a rule (not just the rule's property)
    const sheet = window.document.styleSheets[0];
    sheet.insertRule(rule, sheet.cssRules.length);
}

addTransition = (el, styleProps, durationMs = 0) => {
    //---Apply a transition rule. A durationMs of 0 is ignored and the default duration value is used. (For an instantaneous transition use 1; 0 doesn't behave as a transitiion; opacity=0 to avoid jitter)
    let dummy = el.offsetHeight;   //force reflow
    return new Promise((resolve, reject) => {
        function handleTransitionEnd() {
            resolve(el);
        }
        el.addEventListener("transitionend", handleTransitionEnd, {
            once: true
        });
        if (durationMs > 0) el.style.setProperty("transition", `${durationMs}ms`);
        Object.entries(styleProps).forEach(([prop, value]) => {
            el.style.setProperty(prop, value);
        });
    });
}

cObj = (obj) => {
    //---Accepts either an element ID or the object itself. Returns the object itself.
    return typeof obj === "string" ? document.getElementById(obj) : document.getElementById(obj.id); //I would expect obj === document.getElementById(obj.id); but they look the same but have different properties
}


addHTMLel = (elID, className, appendTo = document.body, elType = "div") => {
    //Add an element (default = <div>) to the document (default append to = <body>)
    const el = document.createElement(elType);
    el.setAttribute('id', elID);
    if (className) el.setAttribute('class', className);
    appendTo.append(el);
    return document.getElementById(elID);
}

monthExpand = (monthIndex, chars) => {
    //Convert a number (0-indexed) month number to the named month. Optionally include the number of characters in the returned month name
    const ar = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let mo = ar[monthIndex];
    if (chars) mo = mo.substring(0, chars);
    return mo;
}


/*************** Remote Server Operations (previously AJAX) ***************/
async function APICall(apiPath, callbackFn, verb, bodyJSON, headersObj, optionsObj) {
    //async/await fetch (i.e. Promise AJAX). apiPath = everything after the domain (e.g. Patient/123). callbackfn e.g.: function(data){console.log(data)}
    //   verb is optional, default = GET. bodyJSON is optional (JSON formatted). headersObj is optional, e.g. {"Content-Type": "text/plain",}. optionsObj is optional, e.g. {mode: "cors",}
    apiPath = apiReplaceVar(apiPath);
    try {
        if (!verb) verb = "GET";
        if (!optionsObj) optionsObj = {};
        let api = dataParams.baseURL + apiPath;
        //headers
        let fetchHeaders = new Headers(
            headersObj
        );
        if (dataParams.baseCredentials != "Og==") { fetchHeaders.append("Authorization", `Basic ${dataParams.baseCredentials}`) }   //"Og==" is base64 encoding of anonymous credentials
        //options
        optionsObj.method = verb;
        if (bodyJSON) optionsObj.body = JSON.stringify(bodyJSON);
        optionsObj.headers = fetchHeaders;
        //update the flow window
        APICallFlowUpdate(api, true, verb);
        //fetch
        let logID = Logger.addAPILog(api, verb, bodyJSON, headersObj, optionsObj);    //Log the API call
        const source = await fetch(api, optionsObj);
        const result = await source.json();
        if (callbackFn !== undefined) callbackFn(result);
        Logger.addAPIReturn(logID, result, source); //Log the API returned value
        APICallFlowUpdate(api, false, verb);
    } catch (err) {
        console.log("err: ", err);
    }
}

APICallFlowUpdate = (api, fetch = true, verb = "GET") => {
    //Called by apiPath. This function renders the message(s) flowing betweent the client device and the server(s)
    //increment the apiCounter
    if (fetch && Logger._apiCount !== undefined) Logger._apiCount++;
    if (ApiFlow) {   //does the ApiFlow object exist? [Note that the name of the abcFlow object is expected to be ApiFlow]
        //get the most specific (first part) of the subdomain
        const urlParts = (api.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/));    //https://www.rfc-editor.org/rfc/rfc3986#appendix-B
        const server = urlParts[4].substr(0, urlParts[4].indexOf("."));
        //has this server already been rendered in the ApiFlow.grid?
        let serverAlreadyRendered = -1;
        let serversAr = ApiFlow.abcFlowDataParams.servers;
        for (let i = 0; i < serversAr.length; i++) {
            if (serversAr[i].server == server) {
                serverAlreadyRendered = i;
                svgPath = serversAr[i].pathID;
                break;
            }
        }
        //if the server has not already been rendered to the grid, then render it, and add the SVG path connecting it to the clientDevice
        if (serverAlreadyRendered == -1) {
            ApiFlow.gridAdd("abcFlowGrid", "cell", "auto", `<img id="server1" src="assets/img/server.png" style="width: 50px;"><span style="position:relative; top:30px; left:-50px;">${server}</span>`, false, 1);
            svgPath = ApiFlow.flowCreatePath('clientDevice', 'server1', 'message packet', false);
            ApiFlow.flowGridRedraw();
            serversAr[serversAr.length] = { "server": server, "pathID": svgPath, "actors": [] };
        }
        //has the actor (representing the complete URI) already been added?
        let actors = serversAr[(serverAlreadyRendered == -1 ? 0 : serverAlreadyRendered)].actors;
        let actorAlreadyRendered = -1;
        for (i = 0; i < actors.length; i++) {
            if (actors[i] == api) {
                actorAlreadyRendered = i;
                break;
            }
        }
        //if the actor has not yet been rendered, then render it
        const actorNameBase = "abcFlowContainer_actor";
        let actorNameIndex = svgPath + "_";
        if (actorAlreadyRendered == -1) {
            actorNameIndex += actors.length;
            ApiFlow.upsertActor(svgPath, actorNameIndex, (Logger._apiCount !== undefined ? Logger._apiCount : verb), `verb${verb}`);
            actors[actors.length] = `${api}`;
        } else {
            actorNameIndex += actorAlreadyRendered;
        }
        //animate the actor
        setTimeout(() => {
            //Give the upsertActor function a chance to render, and it also looks cool that the actors are not on top of each other on the SVG path
            ApiFlow.flowAnimate(actorNameBase + actorNameIndex, fetch, animDurationMs = "1000");
        }, 100);
    };
    return Logger._apiCount || 0;
}