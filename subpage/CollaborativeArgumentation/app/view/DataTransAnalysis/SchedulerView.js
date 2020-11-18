/**
 * Created by winter on 2014/9/19.
 */
Ext.define('AppPlat.view.DataTransAnalysis.SchedulerView', {
    extend: 'Sch.panel.SchedulerGrid',
    alias: 'widget.schedulerview',
    stores:[
     'AppPlat.store.DataTransAnalysis.SchedulerEventStore',
     'AppPlat.store.DataTransAnalysis.SchedulerResourceStore'
    ],
    requires: [
        'Ext.slider.SingleSlider',
        'Sch.model.Resource',
        'AppPlat.store.DataTransAnalysis.SchedulerEventStore',
        'AppPlat.store.DataTransAnalysis.SchedulerResourceStore'
    ],
    resourceStore: Ext.create('AppPlat.store.DataTransAnalysis.SchedulerResourceStore'),
    eventStore: Ext.create('AppPlat.store.DataTransAnalysis.SchedulerEventStore'),
    eventBarTextField: 'Title',
    viewPreset: 'hourAndDay',
    startDate: new Date(2010, 11, 9, 8),
    endDate: new Date(2010, 11, 9, 16),
    eventResizeHandles: 'both',
    snapToIncrement: true,
    height:300,
    rowHeight: 30,
    style:"color:red",
    color:"red",
    textColor:"#ffffff",
    viewConfig: { loadMask: true },
    enableDragCreation:false,
//    listeners: {
//        afterrender: function () {
//            this.switchViewPreset('year', new Date(2011, 0, 1), new Date(2015, 0, 1));;
//        }
//    },
    tipCfg: {
        cls: 'sch-tip',
        showDelay: 50,
        autoHide: true,
        anchor: 'b'
    },
    tooltipTpl: new Ext.XTemplate(
        '<dl class="tip">',
        '<dd>{[Ext.Date.format(values.StartDate, "Y-m-d G:i")]}——{[Ext.Date.format(values.EndDate, "Y-m-d G:i")]}</dd>',
        '</dl>'
    ).compile(),
    // Setup static columns
    columns: [
        {header: 'GSTATION', sortable: true, width: 100, dataIndex: 'Name'}
    ],
// This method is invoked by the constructor. It is used to initialize data, set up configurations, and attach event handlers.
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            tbar:[
                {
                    text : '年',
                    enableToggle : true,
                    toggleGroup : 'presets',
                    iconCls : 'year',
                    handler : function() {
                        me.switchViewPreset('year', new Date(2011, 0, 1), new Date(2015, 0, 1));
                    }
                },
                {
                    text : '月',
                    toggleGroup : 'presets',
                    iconCls : 'month',
                    handler : function() {
                        me.switchViewPreset('monthAndYear');
                    }
                },
                {
                    text : '日',
                    toggleGroup : 'presets',
                    enableToggle : true,
                    iconCls : 'day',
                    handler : function() {
                        me.switchViewPreset('weekAndDay', new Date(2011, 0, 1), new Date(2011, 0, 21));
                    }
                },
                {
                    text : '时',
                    toggleGroup : 'presets',
                    enableToggle : true,
                    iconCls : 'hour',
                    handler : function() {
                        me.switchViewPreset('hourAndDay', new Date(2011, 0, 1, 8), new Date(2011, 0, 1, 18));
                    }
                },
                {
                    text : '分',
                    toggleGroup : 'presets',
                    enableToggle : true,
                    iconCls : 'minute',
                    handler : function() {
                        me.switchViewPreset('minuteAndHour', new Date(2011, 0, 1, 8), new Date(2011, 0, 1, 18));
                    }
                },
                {
                    text : '+',
                    scale: 'medium',
                    iconCls: 'zoomIn',
                    handler: function () {
                        me.zoomIn();
                    }
                },
                {
                    text : '-',
                    scale: 'medium',
                    iconCls: 'zoomOut',
                    handler: function () {
                        me.zoomOut();
                    }
                },
                {
                    aligin:'center',
                    text: '计 算',
                    itemId:'btnOverStaAnaCompute',
                    scope: this,
                    margin:'0 0 0 620'
                }
            ]
        });
        me.callParent(arguments);
    }


});