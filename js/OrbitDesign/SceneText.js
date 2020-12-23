//	These markers use screenspace by doing fancy 3D to 2D calculations
//	Much slower, use with caution!

var legacyMarkers = [];

//	called by animate per frame
function updateLegacyMarkers(){
    for( var i in legacyMarkers ){
        var marker = legacyMarkers[i];
        marker.update();
    }
}

function attachLegacyMarker( text, obj, size, visibleRange ){
//    var template = document.getElementById( 'legacy_marker_template' );
//
//    var marker = template.cloneNode(true);
    var marker = document.createElement("span");
    marker.appendChild(document.createElement("span"));

    marker.obj = obj;
    marker.absPosition = obj.position;
    marker.size = size !== undefined ? size : 1.0;

    marker.visMin = visibleRange === undefined ? 0 : visibleRange.min;
    marker.visMax = visibleRange === undefined ? 10000000 : visibleRange.max;

    marker.$ = $(marker);	// jQuery reference

    Struct.container.parentNode.appendChild( marker );

    marker.setVisible = function ( vis ){
        if (vis) {
            this.style.opacity = 1.0;
        } else {
            this.style.opacity = 0.0;
        }

        if( vis )
            this.style.visibility = 'visible';
        else
            this.style.visibility = 'hidden';
        return this;
    };

    marker.setSize = function( s ) {
        this.style.fontSize = s + 'px';
    };

    marker.setPosition = function(x,y){
        x -= this.markerWidth * 0.5;
        this.style.left = x + 'px';
        this.style.top = y + 'px';
        // this.style.zIndex = z;
    };
    var nameLayer = marker.children[0];
    marker.nameLayer = nameLayer;
    nameLayer.innerHTML = text;
    marker.markerWidth = marker.$.outerWidth();

    marker.zero = new THREE.Vector3();
    marker.update = function() {

        var screenPos = screenXY(this.obj);

        var inCamRange = (Struct.camera.position.z > this.visMin && Struct.camera.position.z < this.visMax);
        var inCamFrame = (screenPos.x > 0 && screenPos.x < Struct.container.width && screenPos.y > 0 && screenPos.y < Struct.container.height);
        var isParentVisible = this.obj.visible;

        if( isParentVisible && inCamRange )
            this.setPosition( screenPos.x, screenPos.y );

        if( inCamRange && inCamFrame && isParentVisible )
            this.setVisible( true );
        else
            this.setVisible( false );
    };

    legacyMarkers.push( marker );

    // console.log(marker);
}
function screenXY(object) {
    var worldPosition = object.position;
    var projected = worldPosition.clone();
    (new THREE.Projector).projectVector(projected, Struct.camera);
    return { x: (1 + projected.x) * Struct.container.width / 2 + Struct.container.getBoundingClientRect().left,
        y: (1 - projected.y) * Struct.container.height / 2 + Struct.container.getBoundingClientRect().top };
}