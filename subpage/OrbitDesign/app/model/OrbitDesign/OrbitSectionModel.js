/**
 * Created by winter on 2015/4/3.
 */
Ext.define('OrbitDesignApp.model.OrbitDesign.OrbitSectionModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.Field'
    ],
    fields: [
        { name: 'id'},
        { name: 'name'},
        { name: 'currentPlanet'},
        { name: 'targetPlanet'},
        { name: 'startTime'},
        { name: 'endTime' },
        { name: 'speedDifference'}
    ]
});