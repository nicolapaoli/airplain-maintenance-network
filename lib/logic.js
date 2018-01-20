'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {ie.airman.demo.PlaneMaintenance} planeMaintenance
 * @transaction
 */
function PlaneMaintenance(planeMaintenance) {

    var factory = getFactory();

    var NS = 'ie.airman.demo';

    return getAssetRegistry(NS + '.Plane')
        .then(function(planeRegistry) {
            return planeRegistry.get(planeMaintenance.plane.getIdentifier());
        })
        .then(function(plane) {
                var assetRegistry;
                return getAssetRegistry(NS + ".Part")
                    .then(function(partsRegistry) {
                        for (var i = 0; i < plane.parts.length; i++) {
                            assetRegistry = partsRegistry;
                            assetRegistry.get(plane.parts[i].getIdentifier())
                                .then(function(partToMaintain) {
                                    partToMaintain.status = 'GOOD';

                                    var newLog = factory.newConcept(NS, 'MaintenanceLogNotarisation')
                                    newLog.timestamp = planeMaintenance.timestamp;
                                    newLog.MaintenanceCompany = factory.newRelationship(NS, 'MaintenanceCompany', planeMaintenance.maintenanceCompany);
                                    newLog.description = planeMaintenance.description;

                                    partToMaintain.maintenanceLogsNotarisation.push(newLog);
                                    return assetRegistry.update(partToMaintain);
                                });
                        }
                    });
        });
}