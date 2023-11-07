//*******************************************************************************************
//Mock data. CSVs - first is for medications, second is for all refills
//  meds: Molecule name, (optional) Start date, (optional) End date, (optional) Adherence score [true/false to display adherece - only meaningful for chronic meds], (optional) Adhrence tolerance days [default=3, number of days beyond Rx duration before considered non-adherent]
//  refillList: Molecule name, Drug name, Dose, Start date, End date, Prescriber, Dispenser
medHx = {
    "meds": [{
        "molecule": "Amoxicillin"
    }, {
        "molecule": "Hydrocortisone"
    }, {
        "molecule": "Prednisone",
        "adherenceScore": true
    }, {
        "molecule": "Rosuvastatin calcium",
        "start": "",
        "adherenceScore": true,
        "adherenceToleranceDays": 5
    }, {
        "molecule": "Infliximab",
        "start": "2017-01-01",
        "end": "2018-09-01",
        "adherenceScore": true
    }, {
        "molecule": "Oxycodone",
        "start": "2016-01-20",
        "end": "2017-08-01",
        "adherenceScore": true
    }, {
        "molecule": "Cannabis: Trutiva",
        "start": "2017-08-01",
        "end": "2018-08-01",
        "adherenceScore": true
    }],
    "refillList": [{
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "30mg",
        "start": "2017-02-25",
        "end": "2017-03-25",
        "rx": "Dr. Smith",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2017-03-25",
        "end": "2017-04-25",
        "rx": "Dr. Smith",
        "fill": "Rexall 7890 Happy Ave., Parry Sound"
    }, {
        "molecule": "Infliximab",
        "drug": "Remicade",
        "dose": "150mg",
        "start": "2017-01-04",
        "end": "2017-04-04",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Infliximab",
        "drug": "Remsima",
        "dose": "150mg",
        "start": "2017-04-06",
        "end": "2017-07-06",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Infliximab",
        "drug": "Remsima",
        "dose": "150mg",
        "start": "2017-07-09",
        "end": "2017-10-09",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Infliximab",
        "drug": "Remsima",
        "dose": "150mg",
        "start": "2018-04-15",
        "end": "2018-07-14",
        "rx": "Dr. X. Y. Zee",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Oxycodone",
        "drug": "Oxycontin",
        "dose": "5mg",
        "start": "2016-11-15",
        "end": "2016-12-15",
        "rx": "Dr. Mary Doe",
        "fill": "UHN Hospital Pharmacy, Toronto"
    }, {
        "molecule": "Oxycodone",
        "drug": "Oxycontin",
        "dose": "5mg",
        "start": "2017-06-25",
        "end": "2017-07-25",
        "rx": "Dr. Mary Doe",
        "fill": "Rexall 7890 Happy Ave., Parry Sound"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "30mg",
        "start": "2017-01-20",
        "end": "2017-02-20",
        "rx": "Dr. Smith",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Amoxicillin",
        "drug": "",
        "dose": "875mg",
        "start": "2017-03-08",
        "end": "2017-03-18",
        "rx": "Dr. Smith",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2017-05-01",
        "end": "2017-06-01",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2017-06-01",
        "end": "2017-07-01",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2017-07-15",
        "end": "2017-08-15",
        "rx": "Dr. Smith",
        "fill": "Rexall 7890 Happy Ave., Parry Sound"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2017-08-19",
        "end": "2017-09-19",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2017-09-15",
        "end": "2017-10-19",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2017-10-19",
        "end": "2017-11-19",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2017-11-20",
        "end": "2017-12-20",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2017-12-22",
        "end": "2018-01-22",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2018-01-25",
        "end": "2018-02-25",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2018-03-03",
        "end": "2018-04-02",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2018-04-08",
        "end": "2018-05-07",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Rosuvastatin calcium",
        "drug": "Crestor",
        "dose": "45mg",
        "start": "2018-05-08",
        "end": "2018-06-07",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Prednisone",
        "drug": "Prednisone inhaler",
        "dose": "5mg",
        "start": "2017-03-15",
        "end": "2017-03-30",
        "rx": "Dr. R. U. Breathing",
        "fill": "Insideclinic pharmacy, Toronto"
    }, {
        "molecule": "Prednisone",
        "drug": "Prednisone inhaler",
        "dose": "8mg",
        "start": "2017-04-05",
        "end": "2017-04-20",
        "rx": "Dr. R. U. Breathing",
        "fill": "Insideclinic pharmacy, Toronto"
    }, {
        "molecule": "Prednisone",
        "drug": "Prednisone inhaler",
        "dose": "10mg",
        "start": "2017-04-27",
        "end": "2017-05-11",
        "rx": "Dr. R. U. Breathing",
        "fill": "Insideclinic pharmacy, Toronto"
    }, {
        "molecule": "Prednisone",
        "drug": "Prednisone inhaler",
        "dose": "10mg",
        "start": "2017-05-29",
        "end": "2017-06-28",
        "rx": "Dr. R. U. Breathing",
        "fill": "Insideclinic pharmacy, Toronto"
    }, {
        "molecule": "Prednisone",
        "drug": "Prednisone inhaler",
        "dose": "10mg",
        "start": "2017-07-05",
        "end": "2017-10-04",
        "rx": "Dr. R. U. Breathing",
        "fill": "Insideclinic pharmacy, Toronto"
    }, {
        "molecule": "Prednisone",
        "drug": "Prednisone inhaler",
        "dose": "10mg",
        "start": "2017-10-20",
        "end": "2018-01-19",
        "rx": "Dr. R. U. Breathing",
        "fill": "Insideclinic pharmacy, Toronto"
    }, {
        "molecule": "Prednisone",
        "drug": "Prednisone inhaler",
        "dose": "10mg",
        "start": "2018-02-08",
        "end": "2018-05-07",
        "rx": "Dr. R. U. Breathing",
        "fill": "Insideclinic pharmacy, Toronto"
    }, {
        "molecule": "Hydrocortisone",
        "drug": "Hydrocortisone cream 1%",
        "dose": "2g",
        "start": "2017-09-04",
        "end": "2017-10-03",
        "rx": "Dr. Janice Jones",
        "fill": "Main Street Dermatology Clinic., 999 Main St., St Johns, Newfoundland"
    }, {
        "molecule": "Hydrocortisone",
        "drug": "Hydrocortisone cream 1%",
        "dose": "2g",
        "start": "2018-01-29",
        "end": "2018-03-28",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Hydrocortisone",
        "drug": "Hydrocortisone cream 1.5%",
        "dose": "2g",
        "start": "2018-04-11",
        "end": "2018-07-10",
        "rx": "Dr. A. B. Jones",
        "fill": "SDM 123 Main St., Toronto"
    }, {
        "molecule": "Cannabis: Trutiva",
        "drug": "MedReleaf Trutiva,",
        "dose": "0.5g before bed",
        "start": "2017-08-05",
        "end": "2017-09-04",
        "rx": "Dr. Mary Doe",
        "fill": "CCC Virtual"
    }, {
        "molecule": "Cannabis: Trutiva",
        "drug": "MedReleaf Trutiva,",
        "dose": "1g before bed",
        "start": "2017-09-05",
        "end": "2017-10-04",
        "rx": "Dr. Mary Doe",
        "fill": "CCC Virtual"
    }, {
        "molecule": "Cannabis: Trutiva",
        "drug": "MedReleaf Trutiva,",
        "dose": "1g before bed",
        "start": "2017-10-08",
        "end": "2018-01-07",
        "rx": "Dr. Mary Doe",
        "fill": "CCC Virtual"
    }, {
        "molecule": "Cannabis: Trutiva",
        "drug": "MedReleaf Trutiva,",
        "dose": "1g before bed",
        "start": "2018-01-10",
        "end": "2018-04-09",
        "rx": "Dr. Mary Doe",
        "fill": "CCC Virtual"
    }, {
        "molecule": "Cannabis: Trutiva",
        "drug": "MedReleaf Trutiva,",
        "dose": "1g before bed",
        "start": "2018-04-10",
        "end": "2018-07-09",
        "rx": "Dr. Mary Doe",
        "fill": "CCC Virtual"
    }]
};
//*******************************************************************************************