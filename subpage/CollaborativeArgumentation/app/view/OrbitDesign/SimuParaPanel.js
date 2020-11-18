/**
 * Created by Taivas on 5/7/14.
 */
Ext.define('AppPlat.view.OrbitDesign.SimuParaPanel', {
    extend: 'Ext.window.Window',
    alias: 'widget.simuparapanel',

    requires: [
        'Ext.form.field.Number',
        'AppPlat.view.DateTime.DateTimePicker',
        'AppPlat.view.DateTime.DateTimeField'
    ],
    title: '轨道参数',
    height: 340,
    width: 280,
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'fieldcontainer',
                    items: [
                        {
                            xtype: 'datetimefield',
                            itemId: 'startSimuTime',
                            renderTo:Ext.getBody(),
                            value:'2012-12-12 00:00:00',
                            format:'Y-m-d H:i:s',
                            fieldLabel: '开始时间',
                            labelAlign: 'right',
                            labelPad: 5,
                            labelWidth: 55,
                            width : 250,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'datetimefield',
                            itemId: 'stopSimuTime',
                            renderTo:Ext.getBody(),
                            value:'2014-12-12 00:00:00',
                            format:'Y-m-d H:i:s',
                            fieldLabel: '结束时间',
                            labelAlign: 'right',
                            labelPad: 5,
                            labelWidth: 55,
                            width : 250,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'stepLength',
                            fieldLabel: '步长 (s)',
                            value: 60,
                            labelAlign: 'right',
                            labelPad: 5,
                            labelWidth: 55,
                            width: 250,
                            labelSeparator: ' '
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});