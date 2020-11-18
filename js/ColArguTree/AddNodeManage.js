/**
 * Created by winter on 2014/7/7.
 */

var AddNodeManage = function () {
    /**
     * 根据节点类型确定节点的初始名称
     * @param type
     * @returns {*}
     */
    this.defaultName = function (type) {
        if (type == APC.NODETYPE_COVER_ANALYSIS || type == APC.NODETYPE_DATATRANS_ANALYSIS || type == APC.NODETYPE_STRUCTURE || type == APC.NODETYPE_OVERSTATION_ANALYSIS || type == APC.NODETYPE_CHAIN_ANALYSIS || type == APC.NODETYPE_ATTITUDEDATA || type == APC.NODETYPE_ORBITDATA) {
            return ColArgu.colArguTreeUtil.typeE2C(type);
        }
        else {
            return '新建' + ColArgu.colArguTreeUtil.typeE2C(type)
        }
    },
    /**
     * 根据节点类型确定是否为叶节点
     * @param type
     * @returns {number}
     */
        this.isLeaf = function (type) {
            if (type == APC.NODETYPE_SOLUTION || type == APC.NODETYPE_SATELLITE|| type == APC.NODETYPE_DATATRANS_ANALYSIS || type == APC.NODETYPE_OVERSTATION_ANALYSIS  || type == APC.NODETYPE_COVER_ANALYSIS) {
                return false;
            } else if (type == APC.NODETYPE_SENSOR || type == APC.NODETYPE_GROUNDSTATION || type == APC.NODETYPE_STRUCTURE || type == APC.NODETYPE_SKY_COVER_POINT|| type == APC.NODETYPE_SKY_COVER_REGIN || type == APC.NODETYPE_CHAIN_ANALYSIS) {
                return true;
            }
        },
    /**
     * 判断父节点中是否已经存在结构，覆盖分析，数传分析节点，链路分析，过站分析 如果存在，则不允许重复添加
     * @param type
     * @param parentList
     */
        this.isHasXNode = function (type, parentList) {
            if (type == APC.NODETYPE_COVER_ANALYSIS || type == APC.NODETYPE_DATATRANS_ANALYSIS || type == APC.NODETYPE_STRUCTURE || type == APC.NODETYPE_OVERSTATION_ANALYSIS|| type == APC.NODETYPE_ATTITUDEDATA || type == APC.NODETYPE_ORBITDATA) {
                var childNodes = parentList.childNodes;
                var isHas = false;
                if (childNodes != null) {
                    var i;
                    for (i = 0; i < childNodes.length; i++) {
                        var targetType = childNodes[i].get('nodeType');
                        if (type == targetType) {
                            isHas = true;
                            break;
                        }
                    }
                    if (isHas) {
                        var errorTitle = '添加' + this.defaultName(type) + '失败';
                        var errorMsg = '该节点中已经存在' + this.defaultName(type) + ',请勿重复添加';
                        Ext.MessageBox.show({
                            title: errorTitle,
                            msg: errorMsg,
                            icon: Ext.Msg.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                }
                return isHas;
            }
        }
}