var mtItems = new vis.DataSet({
    type: {
        start: 'ISODate',
        end: 'ISODate'
    }
});
var mtGroups = new vis.DataSet();

var newGroupData = []; //One group on the timeline per molecule
var newItemData = []; //each item (refill) on the timeline
var sd; //startdate
var ed; //enddate
var rangeSD = 0; //range start for all drugs
var rangeED = 0; //range end for all drugs
var drug = "";
var dose = "";

//Sort on an arbitrary key in JSON array
function sortByKey(array, key, optionalDesc) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key]; //Compare as elements (as opposed to strings), such that 9 < 10. Also works for ISO formatted dates
        if (optionalDesc) {
            var t = x;
            x = y;
            y = t
        };
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

//Convert ISO date to JS date. Return ISO formatted or optionally return in milliseconds since 1970-Jan-1. (replace with moment.js if any more date functionality is required; moments.js has large memory overhead == not great for mobile)
function isoDateToJS(isoDate, optionalMilliseconds) {
    isoDate = isoDate.replace(/\D/g, " "); // replace anything but numbers by spaces
    isoDate = isoDate.replace(/\s+$/, ""); // trim any hanging white space
    var dtcomps = isoDate.split(" ");
    dtcomps[1]--; // modify month between 1 based index of ISO 8601 and 0 based index
    var ms = Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2]); //date in milliseconds
    return (optionalMilliseconds) ? ms : new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3] || 0, dtcomps[4] || 0, dtcomps[5] || 0));
}

function daysDiff(d1, d2) {
    return (d2 - d1) / (86400000);
}

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

//Sort the meds and medsList arrays so that the list appears alphabetically, and start and end dates are ordered for adherence scoring
// medHx.meds = sortByKey(medHx.meds, 'molecule');
medHx.refillList = sortByKey(medHx.refillList, 'molecule');

//Add groups (one per molecule), and add refill items
for (i in medHx.meds) {
    med = medHx.meds[i];
    var t = medHx.refillList.filter(function(el) {
        return el.molecule == med.molecule
    }); //Array of the drugs within this group. (e.g. all instances of Crestor)
    t = sortByKey(t, 'start');
    //Get the start and end dates for the active range
    sd = med.start;
    ed = med.end;
    if (!sd) {
        sd = t[0].start;
        medHx.meds[i].start = sd;
    }
    if (!ed) {
        ed = '1800-01-01';
        for (var el in t) {
            ed = t[el].end > ed ? t[el].end : ed;
        }
        medHx.meds[i].end = ed;
    }
    var activeSD = isoDateToJS(sd);
    var activeED = isoDateToJS(ed);
    if (rangeSD > activeSD || rangeSD == 0) {
        rangeSD = activeSD
    }
    if (rangeED < activeED || rangeED == 0) {
        rangeED = activeED
    }
    if (activeED > Date()) {
        activeED = Date()
    }
    var dayCursor = activeSD;
    var adherenceToleranceDays = med.adherenceToleranceDays || 3;
    var nonAdherenceDays = 0;
    //Add medication items (the drugs within this group)
    for (i in t) {
        medItem = t[i];
        if (medItem.start > medItem.end) {
            alert("WARNING - The medication end date precedes the medication start date - data will not be rendered properly. Medication details:\n" + JSON.stringify(medItem))
        }
        //Only display drug and/or dose if the value has changed (to avoid cluttering the display)
        var tDrug = medItem.drug;
        var tDose = medItem.dose;
        if (tDrug != drug) {
            drug = tDrug
        } else {
            tDrug = ""
        }
        if (tDose != dose) {
            dose = tDose
        } else {
            tDose = ""
        }
        //Add the drug (and onHover)
        newItemData.push({
            id: med.molecule + i,
            group: med.molecule,
            start: medItem.start,
            end: medItem.end,
            content: tDrug + '&nbsp;' + tDose,
            title: drug + ' ' + dose + '<br><b>Rx: </b>' + medItem.rx + '<br><b>Fill: </b>' + medItem.fill + '</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + medItem.start + ' to ' + medItem.end,
            className: 'compliant'
        });
        //Calculate adherence
        if (med.adherenceScore) {
            var daysOffset = daysDiff(dayCursor, isoDateToJS(medItem.start));
            if (daysOffset > 0) {
                //Display (non|extended)compliance block
                newItemData.push({
                    id: med.molecule + i + 'Adherence',
                    group: med.molecule,
                    start: dayCursor,
                    end: medItem.start,
                    content: '&nbsp;',
                    className: ((daysOffset > adherenceToleranceDays) ? 'non' : 'extend') + 'Compliant'
                });
                nonAdherenceDays += daysOffset > adherenceToleranceDays ? daysOffset : 0;
            }
        }
        dayCursor = isoDateToJS(medItem.end);
    }
    //Add a non-adherence block after the last med
    if (med.adherenceScore) {
        var daysOffset = daysDiff(dayCursor, Math.min(activeED, Date.now()));
        // var daysOffset = daysDiff( dayCursor, activeED );
        if (daysOffset > 0) {
            //Display (non|extended)compliance block
            newItemData.push({
                id: med.molecule + (i) + 'EndAdherence',
                group: med.molecule,
                start: dayCursor,
                end: dayCursor.addDays(daysOffset),
                content: '&nbsp;',
                className: ((daysOffset > adherenceToleranceDays) ? 'non' : 'extend') + 'Compliant'
            });
            nonAdherenceDays += daysOffset > adherenceToleranceDays ? daysOffset : 0;
        }
    }
    //Determine adherence score
    var as = '';
    if (med.adherenceScore && activeED > activeSD) {
        as = 100 - Math.round(100 * nonAdherenceDays / daysDiff(activeSD, activeED));
        var bg = '#66cc00';
        if (as < 75) {
            bg = as >= 50 ? '#ffcc00' : '#ff0000'
        }
        as = '<br><span class="adherenceDot" style="background: ' + bg + ';">&nbsp;</span> Adherence score: ' + as + '%';
    }
    //Add the group and all drugs within the group
    newGroupData.push({
        id: med.molecule,
        content: '<span class="rowHeading"><b>' + med.molecule + '</b>' + as + '</span>'
    });
    newItemData.push({
        id: med.molecule + 'ActivePeriod',
        group: med.molecule,
        start: sd,
        end: ed,
        type: 'background'
    });
}
mtGroups.add(newGroupData);

//Add shaded backgrounds for the months
for (var y = rangeSD.getFullYear(); y <= rangeED.getFullYear(); y++) {
    for (var m = 1; m <= 12; m++) {
        if ((y == rangeSD.getFullYear() && m < rangeSD.getMonth()) || (y == rangeED.getFullYear() && m > rangeED.getMonth())) {
            //don't shade
        } else {
            if (m % 2) {
                sd = y + '-' + m + '-01';
                ed = y + '-' + (m + 1) + '-01';
                newItemData.push({
                    id: 'shade' + y + m,
                    start: sd,
                    end: ed,
                    type: 'background',
                    className: 'evenMonth'
                });
            }
        }
    }
}
mtItems.add(newItemData);

//Add the timeline to the DOM and set any relevant configuration parameters
var mtContainer = document.getElementById('medTimelineContainer');
var mtOptions = {
    // orientation:'top'
    // start: '2013-01-01',
    // end: '2015-04-31',
    height: 420,
    editable: false,
    stack: false,
    stackSubgroups: true
};
var timeline = new vis.Timeline(mtContainer, mtItems, mtGroups, mtOptions);

/*
//This is future functionality I would like to add...
function insertToggle(id, leftText, rightText) {
    var s = "<table><tr><td onclick='tgl_" + id + ".checked=false' style='cursor: pointer;'>" + leftText + "</td><td><input type='checkbox' id='tgl_" + id + "' class='cbx hidden'/>";
    s += "<label for='tgl_" + id + "' class='lbl'></label></td><td onclick='tgl_" + id + ".checked=true' style='cursor: pointer;'>" + rightText + "</td></tr></table>";
    document.writeln(s);
}
*/

/*
//HTTP Fetch() - a.k.a. AJAX
function queryFHIR(qry) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic MjA0QWRhbTpDb2xANDI5");
    myHeaders.append("Cookie", "CDR_Master_admin_web_SESSION=NTYyZDc0ODMtZDFkNC00MDQ0LTgyODktZDVjNTU4M2IwZmQy; Master_admin_web_CSRF=61fdd346-f94d-49c8-8fd4-8f8edaad5295");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(qry, requestOptions)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                // Examine the text in the response
                response.json().then(function(data) {
                    // console.log(data);
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });



    // .then(response => response.text())
    // .then(result => console.log(result))
    // .catch(error => console.log('error', error));
}

queryFHIR("https://try.smilecdr.com/baseR4/MedicationStatement?patient=3908&status=active&_include=MedicationStatement:medication");
*/