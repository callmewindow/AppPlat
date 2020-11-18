/**
 * Created by winter on 2014/8/21.
 */

Ext.define('StructDesignApp.view.VideoDemoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.videodemowindow',
    resizable:false,
    title:'演示视频',
    titleAlign:'center',
    closeAction:'hide',
    html:'<video width="800" height="400" controls="controls" preload controls>' +
             '<source src="../../resources/movie/structDesign.mp4" type="video/mp4; codecs="avc1.42E01E, mp4a.40.2"" />' +
             '<source src="../../resources/movie/structDesign.webm" type="video/webm; codecs="vp8, vorbis"" />' +
          '您的浏览器不支持此种视频格式。</video>'

});