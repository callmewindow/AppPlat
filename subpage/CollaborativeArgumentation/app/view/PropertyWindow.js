/**
 * Created by winter on 2014/7/15.
 */
/**
 * Created by Taivas on 5/7/14.
 */
Ext.define('AppPlat.view.PropertyWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.propertywindow',

    requires: [
        'Ext.form.field.Number'
    ],
    id:'propertyWindow',
    title: '属性',
    collapsed: true,
    flex:1,
    height: 340,
    layout: 'hbox',
    width: 300
});