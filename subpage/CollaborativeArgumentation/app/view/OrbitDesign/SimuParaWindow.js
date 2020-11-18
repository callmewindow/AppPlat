/**
 * Created by Taivas on 5/4/14.
 * Not in use in a while
 */
Ext.define('AppPlat.view.OrbitDesign.SimuParaWindow', {
    alias: 'widget.simuparawindow',
    extend: 'Ext.window.Window',
    requires: [
        'Ext.panel.Panel',
        'AppPlat.view.DateTime.DateTimeField'
    ],
    itemId:'simuParaWindow',
    height: 170,
    width: 305,
    x:150,
    y:117,
    title: '仿真参数',
    closeAction: 'hide',
    resizable: false,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            bodyPadding: 10,
            items:[
                {
                    bodyPadding: 10,
                    xtype: 'fieldset',
                    items: [
                        {
                            xtype: 'datetimefield',
                            itemId: 'startSimuTime',
                            renderTo:Ext.getBody(),
                            value:ORBIT.t_start,
                            format:'Y-m-d H:i:s',
                            fieldLabel: '开始时间',
                            editable: false,
                            labelAlign: 'right',
                            labelPad: 5,
                            labelWidth: 55,
                            width : 250,
                            labelSeparator: ' ',
                            padding:'0 0 10 0'

                        },
                        {
                            xtype: 'datetimefield',
                            itemId: 'stopSimuTime',
                            renderTo:Ext.getBody(),
                            value:ORBIT.t_stop,
                            format:'Y-m-d H:i:s',
                            fieldLabel: '结束时间',
                            editable: false,
                            labelAlign: 'right',
                            labelPad: 5,
                            labelWidth: 55,
                            width : 250,
                            labelSeparator: ' ',
                            padding:'0 0 10 0'
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'stepLength',
                            fieldLabel: '步长 (s)',
                            value: ORBIT.step,
//                            minValue: ORBIT.min['step'],
//                            maxValue: ORBIT.max['step'],
                            labelAlign: 'right',
                            labelPad: 5,
                            labelWidth: 55,
                            width: 250,
                            labelSeparator: ' ',
                            padding:'0 0 10 0'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});