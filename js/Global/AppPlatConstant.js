/**
 * Created by winter on 2014/5/5.
 */
APC = {
    // This property is used to turn on local storage.  If set to false the php backend will be used.
    NODETYPE_SOLUTION: "Solution",
    NODETYPE_SATELLITE: "Satellite",
    NODETYPE_GROUNDSTATION: "GroundStation",
    NODETYPE_SENSOR: "Sensor",
    NODETYPE_ATTITUDEDATA: "Attitudedata",
    NODETYPE_ORBITDATA: "Orbitdata",
    NODETYPE_STRUCTURE: "Structure",
    NODETYPE_COVER_ANALYSIS: "CoverAnalysis",
    NODETYPE_DATATRANS_ANALYSIS: "DataTransAnalysis",
    NODETYPE_CHAIN_ANALYSIS: "ChainAnalysis",
    NODETYPE_OVERSTATION_ANALYSIS: "OverStationAnalysis",
    NODETYPE_PLANET_COVER_POINT: "PlanetCoverPoint",
    NODETYPE_PLANET_COVER_GLOBAL: "PlanetCoverGlobal",
    NODETYPE_PLANET_COVER_SQUARE: "PlanetCoverSquare",
    NODETYPE_SKY_COVER_POINT: "SkyCoverPoint",
    NODETYPE_SKY_COVER_REGIN: "SkyCoverRegin",
    NODETYPE_ANTENNA:'Antenna',

    NODETYPE_NO_ROOT:'OrbitNoRoot',

    NODETYPE_SOLUTION_CH: "方案",
    NODETYPE_SATELLITE_CH: "卫星",
    NODETYPE_GROUNDSTATION_CH: "地面站",
    NODETYPE_STRUCTURE_CH: "结构",
    NODETYPE_SENSOR_CH: "传感器",
    NODETYPE_COVER_ANALYSIS_CH: "覆盖分析",
    NODETYPE_DATATRANS_ANALYSIS_CH: "数传分析",
    NODETYPE_CHAIN_ANALYSIS_CH: "链路分析",
    NODETYPE_OVERSTATION_ANALYSIS_CH: "过站分析",
    NODETYPE_ATTITUDE_DATA_CH: "姿态参数",
    NODETYPE_ORBIT_DATA_CH: "轨道参数",

    PANEL_TYPE_STRUCT_DESIGN: 'StructDesignPanel',
    PANEL_TYPE_ORBIT_DESIGN: 'OrbitDesignPanel',
    PANEL_TYPE_COVER_ANALYSIS:'CoverAnalysisPanel',
    PANEL_TYPE_DATA_TRANS_ANALYSIS:'DataTransAnalysisPanel',
    PANEL_TYPE_NO_SHOW:'NoShow',

    ORBITSCENE_WIDTH: 686,
    ORBITSCENE_HEIGHT: 598,
    STRUCTSCENE_WIDTH: 700,
    STRUCTSCENE_HEIGHT: 810,


    BACKEND_URL: window.location.hostname + ':' + window.location.port,
    //加上“/”表示从根目录开始寻址，不加“/”表示将路径对后面进行追加
    APPPLAT_SERVICE_URL_PREFIX: "/AppPlatService/services/",
    APPPLAT_SERVICE_SERVLET_URL_PREFIX: "/AppPlatService/InterfaceTest/servlet/",
    PROCESS_ORBIT_DESIGN: '轨道设计',
    PROCESS_STRUCT_DESIGN: '结构设计',
    PROCESS_COVER_ANALYSIS: '覆盖分析',
    PROCESS_DATATRANS_ANALYSIS: '数传分析',
    CURRENT_PROCESS: 'currentProcess',

    /**
     * 姿态属性
     */
    PROTITLE_ATTITUDEDATA: '姿态数据',
    ITEMID_YAWANGLE: 'yawAngleNumberField',//偏航角
    ITEMID_ROLLANGLE: 'rollAngleNumberField',//滚转角
    ITEMID_PITCHANGLE: 'pitchAngleNumberField',//俯仰角
    LABLE_YAWANGLE: '偏航角（Y轴）',
    LABLE_ROLLANGLE: '滚转角（Z轴）',
    LABLE_PITCHANGLE: '俯仰角（X轴）',

    /**
     * 轨道属性
     */
    PROTITLE_ORBITDATA: '轨道数据',
    ITEMID_SEMIMAJORAXIS: 'semiMajorAxisNumberField',//半长轴
    ITEMID_ECCENTRICITY: 'eccentricityNumberField',//偏心率
    ITEMID_ORBITALINCLINATION: 'orbitalInclinationNumberField',//轨道倾角
    ITEMID_RAAN: 'RAANNumberField',//升交点赤经
    ITEMID_PAIAPSIIARGUMENT: 'paiapsiiArgumentNumberField',//近心点幅角
    ITEMID_TRUEANOMALY: 'trueAnomalyNumberField',//真近点角

    LABLE_SEMIMAJORAXIS: '半长轴 a (m)',
    LABLE_ECCENTRICITY: '偏心率 e',
    LABLE_ORBITALINCLINATION: '轨道倾角 i (°)',
    LABLE_RAAN: '升交点赤经 Ω (°)',
    LABLE_PAIAPSIIARGUMENT: '近心点幅角 ω (°)',
    LABLE_TRUEANOMALY: '真近点角 θ (°)',

    STRUCT_FILE_LABEL: 'structFileName',
    STRUCT_DESIGN: 'StructDesign',
    ORBIT_DESIGN: 'OrbitDesign',
    COVER_ANALYSIS:'CoverAnalysis',
    DATA_TRANS_ANALYSIS:'DataTransAnalysis',


    NEW_FILE_NAME: '新建卫星结构文件',

    NODETYPE_TASK: 'Task',
    NODETYPE_TASK_CH: '任务',

    PER_TASK_TYPE_ORBIT_DESIGN: "轨道设计", //轨道设计
    PER_TASK_TYPE_STRUCTURE_DESIGN: "结构设计", //结构设计
    PER_TASK_TYPE_COVER_ANALYSIS: "覆盖分析", //覆盖分析
    PER_TASK_TYPE_DATATRANS_ANALYSIS: "数传分析", //数传分析
    TASK_TYPE_COLLABORATIVE_ARGUMENT:"协同论证", //数传分析


    SELECTED_TASK_ID:'selectedTaskId',

    MODEL_ID_COLLABORATIVE_ARGUMENT :"collaborativeargument",
    MODEL_ID_ORBIT_DESIGN :"orbitdesign",
    MODEL_ID_STRUCT_DESIGN :"structdesign",
    MODEL_ID_COVER_ANALYSIS :"coveranalysis",
    MODEL_ID_DATA_TRANS_ANALYSIS :"datatransanalysis",

    TOOL_TYPE_STRUCT_DESIGN: 'StructDesign',
    TOOL_TYPE_ORBIT_DESIGN: 'OrbitDesign',

    ERROR_TETX_TASK_INFO_INCOMPLETE:'任务信息不完整',
    ERROR_START_TIME_LATE:'仿真开始时间不能晚于结束时间',
    ERROR_END_TIME_EARLY:'仿真结束时间不能早于开始时间',
    TIP_OF_ADD_TASK_USER:'请填写参与人员(非创建人员)账户',
    TIP_OF_DELETE_ORBIT_SECTION:'初始轨道段不能刪除'

};
