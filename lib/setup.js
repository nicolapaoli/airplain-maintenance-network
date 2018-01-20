'use strict';

/**
 * Demo Setup
 * @param {ie.airman.demo.DemoSetup} demoSetup
 * @transaction
 */
function DemoSetup(demoSetup){
    var factory = getFactory();

    var NS = 'ie.airman.demo';

    var participants = {
        'airlines' : [
            {
                'userId' : 'a001'
            },
            {
                'userId' : 'a002'
            }
        ],
        'maintenanceCompanies' : [
            {
                'userId' : 'm001'
            }
        ],
        'insuranceCompanies' : [
            {
                'userId' : 'i001'
            }
        ],
        'regulators' : [
            {
                'userId' : 'r001'
            }
        ]
    };

    var assets = {
        'parts' : [
            {
                'partId' : 'part001',
                'name' : 'part001',
                'status' : 'TO_REPLACE'
            },
            {
                'partId' : 'part002',
                'name' : 'part002',
                'status' : 'TO_REPLACE'
            },
            {
                'partId' : 'part003',
                'name' : 'part003',
                'status' : 'GOOD'
            }
        ],
        'planes' : [
            {
                'planeId' : 'plane001',
                'parts' : [
                    {
                        'partId': 'part001',
                    },
                    {
                        'partId': 'part002',
                    }
                ],
                'ownerId' : 'a001'
            },
            {
                'planeId' : 'plane002',
                'parts' : [
                    {
                        'partId': 'part003',
                    }
                ],
                'ownerId' : 'a002'
            }
        ]
    };

    var airlines = [];
    var maintenanceCompanies = [];
    var insuranceCompanies = [];
    var regulators = [];


    var parts = [];
    var planes = [];

    for (var i = 0; i < participants.airlines.length; i++){
        var newAirline = factory.newResource(NS, 'Airline', participants.airlines[i].userId);
        airlines.push(newAirline);
    }

    for (var j = 0; j < participants.maintenanceCompanies.length; j++){
        var newMaint = factory.newResource(NS, 'MaintenanceCompany', participants.maintenanceCompanies[j].userId);
        maintenanceCompanies.push(newMaint);
    }

    for (var k = 0; k < participants.insuranceCompanies.length; k++){
        var newInsurance = factory.newResource(NS, 'InsuranceCompany', participants.insuranceCompanies[k].userId);
        insuranceCompanies.push(newInsurance);
    }

    for (var r = 0; r < participants.regulators.length; r++){
        var newRegulator = factory.newResource(NS, 'Regulator', participants.regulators[r].userId);
        regulators.push(newRegulator);
    }


    // ASSETS
    for (var p = 0; p < assets.parts.length; p++){
        var newPart = factory.newResource(NS, 'Part', assets.parts[p].partId);
        newPart.name = assets.parts[p].name;
        newPart.status = assets.parts[p].status;
        newPart.maintenanceLogsNotarisation = [];
        parts.push(newPart);
    }

    for (var pl = 0; pl < assets.planes.length; pl++){
        var newPlane = factory.newResource(NS, 'Plane', assets.planes[pl].planeId);
        newPlane.owner = factory.newRelationship(NS, 'Airline', assets.planes[pl].ownerId);
        newPlane.parts = [];
        for (var partIndex = 0 ; partIndex < assets.planes[pl].parts.length; partIndex++){
            var part = factory.newRelationship(NS, 'Part', assets.planes[pl].parts[partIndex].partId);
            newPlane.parts.push(part);
        }
        planes.push(newPlane);
    }


    return getParticipantRegistry(NS + '.Airline')
        .then(function(airReg) {
            return airReg.addAll(airlines);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.MaintenanceCompany');
        })
        .then(function(manReg) {
            return manReg.addAll(maintenanceCompanies);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.InsuranceCompany');
        })
        .then(function(insReg) {
            return insReg.addAll(insuranceCompanies);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.Regulator');
        })
        .then(function(regReg) {
            return regReg.addAll(regulators);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Part');
        })
        .then(function(partReg) {
            return partReg.addAll(parts);
        })
        .then(function(partReg) {
            return getAssetRegistry(NS + '.Plane');
        })
        .then(function(planeReg) {
            return planeReg.addAll(planes);
        });
}