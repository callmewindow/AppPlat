Ext.define('TaskListApp.view.EditTask.EditTaskWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.edittaskwindow',
    requires: [
        'Ext.data.*',
        'Ext.form.*',
        'TaskListApp.view.EditTask.DateTimeField',
        'TaskListApp.view.EditTask.DateTimePicker',
        'TaskListApp.store.TaskUserStore',
        'TaskListApp.store.EditTaskStore'
    ],
    xtype: 'form-checkout',
    title: '添加任务',
    store: 'EditTaskStore',
    width: 800,
    minimizable: true,
    initComponent: function () {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            pluginId: 'rowEditing',
            saveBtnText: '保存',
            cancelBtnText: "取消",
            clicksToEdit: 2,
            autoCancel: false
        });
        var required = '<span style="color:#CC0033;font-weight:100" data-qtip="Required">*</span>'
        Ext.apply(this, {
            height: 410,
            items: [
                {
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '10 0 0 0',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'vbox',
                                    margin: '0 0 20 0',
                                    items: [
                                        {
                                            fieldLabel: '论证任务名称',
                                            labelWidth: 150,
                                            xtype: 'textfield',
                                            width: 360,
                                            allowBlank: false,
                                            itemId: 'taskName',
                                            name: 'taskName',
                                            padding: '0 20 20 10',
                                            afterLabelTextTpl: required
                                        },
                                        {
                                            fieldLabel: '开始时间(UTC)',
                                            labelWidth: 150,
                                            width: 360,
                                            name: 'startTime',
                                            itemId: 'startTime',
                                            allowBlank: false,
                                            format: 'Y-m-d H:i:s',
                                            xtype: 'datetimefield',
                                            padding: '0 20 20 10',
                                            afterLabelTextTpl: required
                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'hbox',
                                            align: 'stretch',
                                            width: 400,
                                            padding: '0 20 0 10',
                                            items: [
                                                {
                                                    text: '参与人员：',
                                                    xtype: 'label',
                                                    flex: 2
                                                },
                                                {
                                                    xtype: 'gridpanel',
                                                    height:200,
//                                                    store: 'TaskUserStore',
                                                    itemId: 'taskUserGridPanel',
                                                    flex: 3,
                                                    scroll:'vertical',
                                                    hideHeaders: true,
                                                    columns: [
                                                        {
                                                            width:210,
                                                            itemId: 'taskUserAccount',
                                                            align: 'center',
                                                            dataIndex: 'account',
                                                            editor: {
                                                                itemId: 'taskUserAccountEditor',
                                                                xtype: 'textfield',
                                                                tipText: function (thumb) {
                                                                    return Ext.String.format('<b>{0}</b>', thumb.value);
                                                                }
                                                            }
                                                        }
                                                    ],
                                                    frame: true,
                                                    tbar: [
                                                        {
                                                            itemId: 'addTaskUser',
                                                            text: '添加',
                                                            width: 80,
                                                            margin: '0 40 0 0'
                                                        },
                                                        {
                                                            itemId: 'removeTaskUser',
                                                            text: '删除',
                                                            width: 80,
                                                            disabled: true
                                                        }
                                                    ],
                                                    plugins: [rowEditing]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'vbox',
                                    margin: '0 0 20 0',
                                    items: [
                                        {
                                            fieldLabel: '仿真开始时间(UTC)',
                                            labelWidth: 150,
                                            allowBlank: false,
                                            name: 'simulationStartTime',
                                            itemId: 'simulationStartTime',
                                            xtype: 'datetimefield',
                                            format: 'Y-m-d H:i:s',
                                            width: 360,
                                            padding: '0 20 20 10',
                                            afterLabelTextTpl: required

                                        },
                                        {
                                            fieldLabel: '仿真结束时间(UTC)',
                                            labelWidth: 150,
                                            name: 'simulationEndTime',
                                            itemId: 'simulationEndTime',
                                            allowBlank: false,
                                            format: 'Y-m-d H:i:s',
                                            xtype: 'datetimefield',
                                            width: 360,
                                            padding: '0 20 20 10',
                                            afterLabelTextTpl: required
                                        },
                                        {
                                            fieldLabel: '步长(s)',
                                            labelWidth: 150,
                                            allowBlank: false,
                                            name: 'step',
                                            itemId: 'step',
                                            width: 360,
                                            padding: '0 20 20 10',
                                            minValue:0,
                                            xtype: 'numberfield',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            afterLabelTextTpl: required
                                        },
                                        {
                                            fieldLabel: '任务描述',
                                            labelWidth: 150,
                                            name: 'description',
                                            itemId: 'description',
                                            xtype: 'textareafield',
                                            width: 360,
                                            height: 150,
                                            padding: '0 20 0 10'
                                        }

                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            dockedItems: [
                {
                    dock: 'bottom',
                    layout:'hbox',
                    items:[
                        {
                            text: '',
                            xtype:'label',
                            itemId: 'errorLabel',
                            style: {
                                color: 'red'
                            },
                            width: 250,
                            scope: this,
                            margin:'5 0 5 50'
                        },
                        {
                            text: '提交',
                            xtype:'button',
                            itemId: 'commitButton',
                            width: 150,
                            scope: this,
                            margin:'5 0 5 300'
                        }
                    ]
                }
                ]


        });
        this.callParent();
    }

});