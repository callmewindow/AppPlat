/**
 * Created by winter on 2014/9/23.
 */
Ext.define('AppPlat.view.DataTransAnalysis.AnalysisResultGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.analysisresultgridpanel',
    requires: [
        'Ext.grid.View',
        'Ext.tip.QuickTipManager'
//        'MyTaskApp.store.TaskStore',
//        'MyTaskApp.store.PersonalTaskStore'
    ],
    width: 800,
    height:250,
    layout: 'fit',
    scroll:'vertical',
        initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            storeId:'simpsonsStore',
            fields:['resultId','passName', 'startTime', 'endTime', 'passTime'],
            data:[]
        });
        Ext.applyIf(me, {
            columns: [
                {
                    xtype: 'gridcolumn',
                    text: '编号',
                    width: 50,
                    dataIndex: 'resultId',
                    align: 'center',
                    resizable: false
                },
                {
                    xtype: 'gridcolumn',
                    text: '名称',
                    width: 150,
                    dataIndex: 'passName',
                    align: 'center',
                    resizable: false
                },
                {
                    xtype: 'gridcolumn',
                    text: '开始时间',
                    dataIndex: 'startTime',
                    align: 'center',
                    resizable: false,
                    width: 280
                },
                {
                    xtype: 'gridcolumn',
                    text: '结束时间',
                    dataIndex: 'endTime',
                    align: 'center',
                    resizable: false,
                    width: 280
                },
                {
                    xtype: 'gridcolumn',
                    text: '过站时间（s）',
                    dataIndex: 'passTime',
                    align: 'center',
                    resizable: false,
                    width: 280
                }
            ],
            store:store
        });
        me.callParent(arguments);
    }

});
