let deepSearch = false;

//Convert the result Bundle into a flat array that can be used by autoComplete.js
autoCompleteFHIRToArray = (data) => {
    let res = {}
    let ar = []
    let el = {}
    for (let key in data.entry) {
        res = data.entry[key].resource
        el = {
            "id": res.id,
            "lname": res.name[0].family,
            "given": res.name[0].given.join(" "),
            "full": res.name[0].family + ", " + res.name[0].given.join(" "),
        }
        ar.push(el);
    }
    return ar
}

//Instantiate the autoComplete
const autoCompleteJS = new autoComplete({
    placeHolder: "Patient search",
    data: {
        src: async(query) => {
            try {
                // Fetch Data from external Source
                let api = `http://hapi.fhir.org/baseR4/Patient?` + ((deepSearch) ? `_elements=identifier,name&phonetic=${query}` : `_elements=identifier,name&family=${query}`);
                const source = await fetch(api);
                const data = await source.json();
                return autoCompleteFHIRToArray(data);
            } catch (error) {
                return error;
            }
        },
        keys: ["full"] // Data 'Object' key to be searched
    },
    resultItem: {
        highlight: true
    },
    events: {
        input: {
            selection: (event) => {
                const selection = event.detail.selection.value;
                autoCompleteJS.input.value = selection;
            }
        }
    }
});