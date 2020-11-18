var HoverText = {
    hideSatellitePara: function () {
        if (ORBIT.map != null && ORBIT.satelliteParaVisible) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.map);
            ORBIT.canvas.parentNode.removeChild(ORBIT.map2);
            ORBIT.satelliteParaVisible = false;
        }
    },
    //屏蔽行星名字span的html元素的鼠标事件
    disableMouseEvent: function (htmlElement) {
        htmlElement.unselectable = "on";
        htmlElement.onselectstart = function () {
            return false;
        };
        htmlElement.onselectstart = function () {
            return false;
        };
        htmlElement.onmousewheel = function (event) {
            onMouseWheel(event);
            return false;
        };
        htmlElement.onmousedown = function (event) {
            if (event.which == 1) {
                onMouseDown(event);
                return false;
            }
            if (event.which == 3) {
                ORBIT.rightDown = true;
                onMouseDownStruct(event);
                return false;
            }
        };
        htmlElement.onmousemove = function (event) {
            if (ORBIT.rightDown) {
                onMouseMoveStruct(event);
            }
            else {
                onMouseMove(event);
            }
            return false;
        };
        htmlElement.onmouseup = function (event) {
            if (event.which == 1) {
                onMouseUp(event);
                return false;
            }
            if (event.which == 3) {
                ORBIT.rightDown = false;
                onMouseUpStruct(event);
                return false;
            }
        };
        htmlElement.oncontextmenu = function () {
            return false;
        }
    },
//六个参数分别为半长轴、偏心率、轨道倾角、升交点赤经、近心点幅角、真近点角
    initOrRefreshHoverTextDiv: function (a, e, i, o, w, t, basePosition) {
        if (ORBIT.map == null) {
            //map用来放文字，map2用来制作透明效果
            ORBIT.map = document.createElement("span");
            this.disableMouseEvent(ORBIT.map);
            ORBIT.map.style.left = basePosition[0] - 150 + "px";
            ORBIT.map.style.top = basePosition[1] - 130 + "px";
            ORBIT.map.style.position = "fixed";
            ORBIT.map.style.display = "block";
//            ORBIT.map.style.border = "solid 2px #C0C0C0";
            ORBIT.map.style.height = 130 + "px";
            ORBIT.map.style.width = 150 + "px";
            ORBIT.canvas.parentNode.appendChild(ORBIT.map);


            ORBIT.map2 = document.createElement("div");
            this.disableMouseEvent(ORBIT.map2);
            ORBIT.map2.style.left = basePosition[0] - 150 + "px";
            ORBIT.map2.style.top = basePosition[1] - 130 + "px";
            ORBIT.map2.style.position = "fixed";
            ORBIT.map2.style.backgroundColor = '#000000';
            ORBIT.map2.style.opacity = '0.2';
            ORBIT.map2.style.display = "block";
            ORBIT.map2.style.height = 130 + "px";
            ORBIT.map2.style.width = 150 + "px";
            ORBIT.canvas.parentNode.appendChild(ORBIT.map2);

            var table = document.createElement("table");
            this.disableMouseEvent(table);
            ORBIT.map.appendChild(table);

            ORBIT.rowA = document.createElement("tr");
            this.disableMouseEvent(ORBIT.rowA);

            ORBIT.labelA = this.createTc('labelA', '半长轴：');
            ORBIT.valueA = this.createTc('valueA', a);
            ORBIT.rowA.appendChild(ORBIT.labelA);
            ORBIT.rowA.appendChild(ORBIT.valueA);
            table.appendChild(ORBIT.rowA);

            ORBIT.rowE = document.createElement("tr");
            this.disableMouseEvent(ORBIT.rowE);
            ORBIT.labelE = this.createTc('labelE', '偏心率：');
            ORBIT.valueE = this.createTc('valueE', e);
            ORBIT.rowE.appendChild(ORBIT.labelE);
            ORBIT.rowE.appendChild(ORBIT.valueE);
            table.appendChild(ORBIT.rowE);

            ORBIT.rowI = document.createElement("tr");
            this.disableMouseEvent(ORBIT.rowI);
            ORBIT.labelI = this.createTc('labelI', '轨道倾角：');
            ORBIT.valueI = this.createTc('valueI', i);
            ORBIT.rowI.appendChild(ORBIT.labelI);
            ORBIT.rowI.appendChild(ORBIT.valueI);
            table.appendChild(ORBIT.rowI);

            ORBIT.rowO = document.createElement("tr");
            this.disableMouseEvent(ORBIT.rowO);
            ORBIT.labelO = this.createTc('labelO', '升交点赤经:');
            ORBIT.valueO = this.createTc('valueO', o);
            ORBIT.rowO.appendChild(ORBIT.labelO);
            ORBIT.rowO.appendChild(ORBIT.valueO);
            table.appendChild(ORBIT.rowO);

            ORBIT.rowW = document.createElement("tr");
            this.disableMouseEvent(ORBIT.rowW);
            ORBIT.labelW = this.createTc('labelW', '近心点幅角:');
            ORBIT.valueW = this.createTc('valueW', w);
            ORBIT.rowW.appendChild(ORBIT.labelW);
            ORBIT.rowW.appendChild(ORBIT.valueW);
            table.appendChild(ORBIT.rowW);

            ORBIT.rowT = document.createElement("tr");
            this.disableMouseEvent(ORBIT.rowT);
            ORBIT.labelT = this.createTc('labelT', '真近点角:');
            ORBIT.valueT = this.createTc('valueT', t);
            ORBIT.rowT.appendChild(ORBIT.labelT);
            ORBIT.rowT.appendChild(ORBIT.valueT);
            table.appendChild(ORBIT.rowT);
            ORBIT.satelliteParaVisible = true;
        } else if (ORBIT.satelliteParaVisible == true) {
            //该面板已经存在，并且已经显示了出来
            ORBIT.valueA.innerHTML = a;
            ORBIT.valueE.innerHTML = e;
            ORBIT.valueI.innerHTML = i;
            ORBIT.valueO.innerHTML = o;
            ORBIT.valueW.innerHTML = w;
            ORBIT.valueT.innerHTML = t;
        } else if (ORBIT.satelliteParaVisible == false) {
            //该面板已经存在,但是被隐藏了起来
            ORBIT.valueA.innerHTML = a;
            ORBIT.valueE.innerHTML = e;
            ORBIT.valueI.innerHTML = i;
            ORBIT.valueO.innerHTML = o;
            ORBIT.valueW.innerHTML = w;
            ORBIT.valueT.innerHTML = t;
            ORBIT.canvas.parentNode.appendChild(ORBIT.map);
            ORBIT.canvas.parentNode.appendChild(ORBIT.map2);
            ORBIT.satelliteParaVisible = true;
        }
    },
    initBigSunDiv: function () {
        ORBIT.sunDiv = document.createElement("img");
        ORBIT.sunDiv.src = "../../resources/images/bigSun.png";
        var position = ORBIT.planet['sun'].object.position;
        var vector3 = new THREE.Vector3(position.x, position.y, position.z);
        var position2D = this.getObjectScreenPosition(vector3);
        var x = position2D.x;
        var y = position2D.y;
        ORBIT.sunDiv.style.left = x - 13 + "px";//539 503
        ORBIT.sunDiv.style.top = y - 13 + "px";
        ORBIT.sunDiv.style.position = "fixed";
        ORBIT.sunDiv.style.display = "block";
        ORBIT.sunDiv.style.height = 25 + "px";
        ORBIT.sunDiv.style.width = 30 + "px";
        this.disableMouseEvent(ORBIT.sunDiv);
//    ORBIT.map.style.border = "solid 2px red";
        ORBIT.canvas.parentNode.appendChild(ORBIT.sunDiv);
    },
    //刷新大太阳div
    refreshBigSun: function () {
        var position = ORBIT.planet['sun'].object.position;
        var vector3 = new THREE.Vector3(position.x, position.y, position.z);
        var position2D = this.getObjectScreenPosition(vector3);
        var x = position2D.x;
        var y = position2D.y;
        ORBIT.sunDiv.style.left = x - 13 + "px";//539 503
        ORBIT.sunDiv.style.top = y - 13 + "px";
    },
//修改视角（当前视角为卫星视角时，如果删除该卫星或者打开另一文件或删除当前文件时，调用此函数）
    changeAngle: function () {
        var pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
        ORBIT.tracedObject = ORBIT.planet[pid].object;
        ORBIT.tracedTarget = ORBIT.planet[pid];
        ORBIT.tracedTargetTpye = 'Planet';
        ORBIT.states_View = "inertial";
    },
    createTc: function (id, text) {
        var tc = document.createElement("tc");
        this.disableMouseEvent(tc)
        tc.id = id;
        tc.style.color = "#748590";
        tc.innerHTML = '<B>' + text + '</B>';
        return tc;
    },
    createHovertextForPlanet: function () {
        this.drawHoverTextForPlanet('mercury', ORBIT.planet['mercury'].object.position, '#153F54', 'new');
        this.drawHoverTextForPlanet('venus', ORBIT.planet['venus'].object.position, '#9A5B16', 'new');
        this.drawHoverTextForPlanet('earth', ORBIT.planet['earth'].object.position, '#B1A184', 'new');
        this.drawHoverTextForPlanet('mars', ORBIT.planet['mars'].object.position, '#C75050', 'new');
        this.drawHoverTextForPlanet('jupiter', ORBIT.planet['jupiter'].object.position, '#B2642F', 'new');
        this.drawHoverTextForPlanet('saturn', ORBIT.planet['saturn'].object.position, '#F8CA88', 'new');
        this.drawHoverTextForPlanet('uranus', ORBIT.planet['uranus'].object.position, '#A0C0CB', 'new');
        this.drawHoverTextForPlanet('neptune', ORBIT.planet['neptune'].object.position, '#5577D0', 'new');
        this.drawHoverTextForPlanet('sun', ORBIT.planet['sun'].object.position, '#5577D0', 'new');
        this.drawHoverTextForPlanet('moon', ORBIT.planet['moon'].object.position, '#5577D0', 'new');
    },
    refreshHovertextForPlanet: function () {
        this.drawHoverTextForPlanet('mercury', ORBIT.planet['mercury'].object.position, '#153F54', 'refresh');
        this.drawHoverTextForPlanet('venus', ORBIT.planet['venus'].object.position, '#9A5B16', 'refresh');
        this.drawHoverTextForPlanet('earth', ORBIT.planet['earth'].object.position, '#B1A184', 'refresh');
        this.drawHoverTextForPlanet('mars', ORBIT.planet['mars'].object.position, '#C75050', 'refresh');
        this.drawHoverTextForPlanet('jupiter', ORBIT.planet['jupiter'].object.position, '#B2642F', 'refresh');
        this.drawHoverTextForPlanet('saturn', ORBIT.planet['saturn'].object.position, '#F8CA88', 'refresh');
        this.drawHoverTextForPlanet('uranus', ORBIT.planet['uranus'].object.position, '#A0C0CB', 'refresh');
        this.drawHoverTextForPlanet('neptune', ORBIT.planet['neptune'].object.position, '#5577D0', 'refresh');
        this.drawHoverTextForPlanet('sun', ORBIT.planet['sun'].object.position, '#5577D0', 'refresh');
        this.drawHoverTextForPlanet('moon', ORBIT.planet['moon'].object.position, '#5577D0', 'refresh');
    },
    refreshHoverText: function (text, circle, x, y) {
        text.style.left = x - ORBIT.circleR + 20 + "px";
        text.style.top = y - ORBIT.circleR + "px";
        text.style.height = ORBIT.textY + "px";
        text.style.width = ORBIT.textX + "px";
        text.style.fontSize = ORBIT.textZ + "px";
        if (x - ORBIT.circleR + 20 < ORBIT.canvas.getBoundingClientRect().left || y - ORBIT.circleR < ORBIT.canvas.getBoundingClientRect().top) {
            text.display = 'none';
        } else {
            text.display = 'block';
        }
        circle.style.left = x - ORBIT.circleR + "px";
        circle.style.top = y - ORBIT.circleR + "px";
        circle.style.height = ORBIT.textY + "px";
        circle.style.width = ORBIT.textX + "px";
        var pid;
        if(-1 != navigator.userAgent.indexOf('Firefox')){
            pid = text.textContent.charAt(0).toLocaleLowerCase() + text.textContent.substring(1);
        }
        else{
            pid = text.innerText.charAt(0).toLocaleLowerCase() + text.innerText.substring(1);
        }
        if (x - ORBIT.circleR < ORBIT.canvas.getBoundingClientRect().left || y - ORBIT.circleR < ORBIT.canvas.getBoundingClientRect().top) {
            circle.display = 'none';
            if (this.detectHoverText(pid)) {
                ORBIT.canvas.parentNode.removeChild(text);
                ORBIT.canvas.parentNode.removeChild(circle);
            }
        } else {
            circle.display = 'block';
            if (ORBIT.planetaryTrackVisibility) {
                if (!this.detectHoverText(pid)) {
                    if (pid == "moon") {
                        if (ORBIT.tracedObject.id == "earth" || ORBIT.tracedObject.id == "moon") {
                            if (ORBIT.tracedObject.id == pid) {
                                if (ORBIT.zoom >= 4 * ORBIT.v_minzoom) {
                                    ORBIT.canvas.parentNode.appendChild(text);
                                    ORBIT.canvas.parentNode.appendChild(circle);
                                }
                            }
                            else {
                                ORBIT.canvas.parentNode.appendChild(text);
                                ORBIT.canvas.parentNode.appendChild(circle);
                            }
                        }
                    }
                    else {
                        if (ORBIT.tracedObject.id == pid) {
                            if (ORBIT.zoom >= 4 * ORBIT.v_minzoom) {
                                ORBIT.canvas.parentNode.appendChild(text);
                                ORBIT.canvas.parentNode.appendChild(circle);
                            }
                        }
                        else {
                            ORBIT.canvas.parentNode.appendChild(text);
                            ORBIT.canvas.parentNode.appendChild(circle);
                        }
                    }
                }
            }
        }
        //检测该星体是否在摄像机的前面，如果在摄像机的后面将其隐藏
        if(!this.planetIsBeforeCamera(pid)) {
            this.hideHoverTextById(pid);
        }
    },
    darwHoverText: function (pname, color, position2D) {
        var orbitNameText = document.createElement("span");
        var orbitCircle = document.createElement("span");
        this.disableMouseEvent(orbitNameText);
        this.disableMouseEvent(orbitCircle);
        var x = position2D.x;
        var y = position2D.y;
        orbitNameText.style.left = x + 20 - ORBIT.circleR + "px";
        orbitNameText.style.top = y - ORBIT.circleR + "px";
        orbitCircle.style.left = x - ORBIT.circleR + "px";
        orbitCircle.style.top = y - ORBIT.circleR + "px";
        orbitNameText.style.position = "fixed";
        orbitCircle.style.position = "fixed";
        orbitNameText.style.display = "block";
        orbitCircle.style.display = "block";
        orbitNameText.style.zIndex = 0;
        orbitCircle.style.zIndex = 0;
        orbitNameText.style.color = "#ffffff";//color;
        orbitCircle.style.color = "#ffffff";//color;
      //  不设置标签和字体大小
        orbitNameText.style.height = ORBIT.textY + "px";
        orbitNameText.style.width = ORBIT.textX + "px";
        orbitCircle.style.height = ORBIT.textY + "px";
        orbitCircle.style.width = ORBIT.textX + "px";
        orbitNameText.style.fontSize = ORBIT.textZ + "px";
        var text;
        switch (pname) {
            case "sun":
                text = 'Sun';
                break;
            case "mercury":
                text = 'Mercury';
                break;
            case "venus":
                text = 'Venus';
                break;
            case "earth":
                text = 'Earth';
                break;
            case "mars":
                text = 'Mars';
                break;
            case "jupiter":
                text = 'Jupiter';
                break;
            case "saturn":
                text = 'Saturn';
                break;
            case "uranus":
                text = 'Uranus';
                break;
            case "neptune":
                text = 'Neptune';
                break;
            case "moon":
                text = 'Moon';
                break;
            default:
                text = pname;
                break;
        }
        orbitCircle.innerHTML = '<canvas id = "circle" width =  20  height =  20></canvas>';
        orbitNameText.innerHTML = '<B>' + text + '</B>';

        ORBIT.canvas.parentNode.appendChild(orbitNameText);
        ORBIT.canvas.parentNode.appendChild(orbitCircle);
        var cans = orbitCircle.children[0].getContext('2d');
        this.drawCircle(cans, 10, 10, ORBIT.circleR);
        return new Array(orbitNameText, orbitCircle);
    },
    drawHoverTextForPlanet: function (pname, position, color, newOrEdit) {
        var vector3 = new THREE.Vector3(position.x, position.y, position.z);
        var position2D = this.getObjectScreenPosition(vector3);
        if (newOrEdit == 'new') {
            var divText = this.darwHoverText(pname, color, position2D);
            switch (pname) {
                case "sun":
                    ORBIT.sunText = divText[0];
                    ORBIT.sunCircle = divText[1];
                    ORBIT.sunText.style.display = "none";
                    ORBIT.sunCircle.style.display = "none";
                    break;
                case "mercury":
                    ORBIT.mercuryText = divText[0];
                    ORBIT.mercuryCircle = divText[1];
                    ORBIT.mercuryText.style.display = "none";
                    ORBIT.mercuryCircle.style.display = "none";
                    break;
                case "venus":
                    ORBIT.venusText = divText[0];
                    ORBIT.venusCircle = divText[1];
                    ORBIT.venusText.style.display = "none";
                    ORBIT.venusCircle.style.display = "none";
                    break;
                case "earth":
                    ORBIT.earthText = divText[0];
                    ORBIT.earthCircle = divText[1];
                    ORBIT.earthText.style.display = "none";
                    ORBIT.earthCircle.style.display = "none";
                    break;
                case "mars":
                    ORBIT.marsText = divText[0];
                    ORBIT.marsCircle = divText[1];
                    ORBIT.marsText.style.display = "none";
                    ORBIT.marsCircle.style.display = "none";
                    break;
                case "jupiter":
                    ORBIT.jupiterText = divText[0];
                    ORBIT.jupiterCircle = divText[1];
                    break;
                case "saturn":
                    ORBIT.saturnText = divText[0];
                    ORBIT.saturnCircle = divText[1];
                    break;
                case "uranus":
                    ORBIT.uranusText = divText[0];
                    ORBIT.uranusCircle = divText[1];
                    break;
                case "neptune":
                    ORBIT.neptuneText = divText[0];
                    ORBIT.neptuneCircle = divText[1];
                    break;
                case "moon":
                    ORBIT.moonText = divText[0];
                    ORBIT.moonCircle = divText[1];
                    break;
            }
        }
        else if (newOrEdit == 'refresh') {
            switch (pname) {
                case "sun":
                    this.refreshHoverText(ORBIT.sunText, ORBIT.sunCircle, position2D.x, position2D.y);
                    break;
                case "mercury":
                    this.refreshHoverText(ORBIT.mercuryText, ORBIT.mercuryCircle, position2D.x, position2D.y);
                    break;
                case "venus":
                    this.refreshHoverText(ORBIT.venusText, ORBIT.venusCircle, position2D.x, position2D.y);
                    break;
                case "earth":
                    this.refreshHoverText(ORBIT.earthText, ORBIT.earthCircle, position2D.x, position2D.y);
                    break;
                case "mars":
                    this.refreshHoverText(ORBIT.marsText, ORBIT.marsCircle, position2D.x, position2D.y);
                    break;
                case "jupiter":
                    this.refreshHoverText(ORBIT.jupiterText, ORBIT.jupiterCircle, position2D.x, position2D.y);
                    break;
                case "saturn":
                    this.refreshHoverText(ORBIT.saturnText, ORBIT.saturnCircle, position2D.x, position2D.y);
                    break;
                case "uranus":
                    this.refreshHoverText(ORBIT.uranusText, ORBIT.uranusCircle, position2D.x, position2D.y);
                    break;
                case "neptune":
                    this.refreshHoverText(ORBIT.neptuneText, ORBIT.neptuneCircle, position2D.x, position2D.y);
                    break;
                case "moon":
                    this.refreshHoverText(ORBIT.moonText, ORBIT.moonCircle, position2D.x, position2D.y);
                    break;
            }
        }
    },

    hideHoverText: function () {
        if (this.detectHoverText("mercury")) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.mercuryText);
            ORBIT.canvas.parentNode.removeChild(ORBIT.mercuryCircle);
        }
        if (this.detectHoverText("venus")) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.venusText);
            ORBIT.canvas.parentNode.removeChild(ORBIT.venusCircle);
        }
        if (this.detectHoverText("earth")) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.earthText);
            ORBIT.canvas.parentNode.removeChild(ORBIT.earthCircle);
        }
        if (this.detectHoverText("mars")) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.marsText);
            ORBIT.canvas.parentNode.removeChild(ORBIT.marsCircle);
        }
        if (this.detectHoverText("jupiter")) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.jupiterText);
            ORBIT.canvas.parentNode.removeChild(ORBIT.jupiterCircle);
        }
        if (this.detectHoverText("saturn")) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.saturnText);
            ORBIT.canvas.parentNode.removeChild(ORBIT.saturnCircle);
        }
        if (this.detectHoverText("uranus")) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.uranusText);
            ORBIT.canvas.parentNode.removeChild(ORBIT.uranusCircle);
        }
        if (this.detectHoverText("neptune")) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.neptuneText);
            ORBIT.canvas.parentNode.removeChild(ORBIT.neptuneCircle);
        }
        if (this.detectHoverText("sun")) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.sunText);
            ORBIT.canvas.parentNode.removeChild(ORBIT.sunCircle);
        }
        if (this.detectHoverText("moon")) {
            ORBIT.canvas.parentNode.removeChild(ORBIT.moonText);
            ORBIT.canvas.parentNode.removeChild(ORBIT.moonCircle);
        }
    },
    showHoverText: function () {
        if (!this.detectHoverText("mercury")) {
            ORBIT.canvas.parentNode.appendChild(ORBIT.mercuryText);
            ORBIT.canvas.parentNode.appendChild(ORBIT.mercuryCircle);
        }
        if (!this.detectHoverText("venus")) {
            ORBIT.canvas.parentNode.appendChild(ORBIT.venusText);
            ORBIT.canvas.parentNode.appendChild(ORBIT.venusCircle);
        }
        if (!this.detectHoverText("earth")) {
            ORBIT.canvas.parentNode.appendChild(ORBIT.earthText);
            ORBIT.canvas.parentNode.appendChild(ORBIT.earthCircle);
        }
        if (!this.detectHoverText("mars")) {
            ORBIT.canvas.parentNode.appendChild(ORBIT.marsText);
            ORBIT.canvas.parentNode.appendChild(ORBIT.marsCircle);
        }
        if (!this.detectHoverText("jupiter")) {
            ORBIT.canvas.parentNode.appendChild(ORBIT.jupiterText);
            ORBIT.canvas.parentNode.appendChild(ORBIT.jupiterCircle);
        }
        if (!this.detectHoverText("saturn")) {
            ORBIT.canvas.parentNode.appendChild(ORBIT.saturnText);
            ORBIT.canvas.parentNode.appendChild(ORBIT.saturnCircle);
        }
        if (!this.detectHoverText("uranus")) {
            ORBIT.canvas.parentNode.appendChild(ORBIT.uranusText);
            ORBIT.canvas.parentNode.appendChild(ORBIT.uranusCircle);
        }
        if (!this.detectHoverText("neptune")) {
            ORBIT.canvas.parentNode.appendChild(ORBIT.neptuneText);
            ORBIT.canvas.parentNode.appendChild(ORBIT.neptuneCircle);
        }
        if (!this.detectHoverText("sun")) {
            ORBIT.canvas.parentNode.appendChild(ORBIT.sunText);
            ORBIT.canvas.parentNode.appendChild(ORBIT.sunCircle);
        }
        if (!this.detectHoverText("moon")) {
            ORBIT.canvas.parentNode.appendChild(ORBIT.moonText);
            ORBIT.canvas.parentNode.appendChild(ORBIT.moonCircle);
        }
    },
    //隐藏指定行星的span
    hideHoverTextById: function (pid) {
        switch (pid) {
            case "sun":
                if (this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.removeChild(ORBIT.sunText);
                    ORBIT.canvas.parentNode.removeChild(ORBIT.sunCircle);
                }
                break;
            case "mercury":
                if (this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.removeChild(ORBIT.mercuryText);
                    ORBIT.canvas.parentNode.removeChild(ORBIT.mercuryCircle);
                }
                break;
            case "venus":
                if (this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.removeChild(ORBIT.venusText);
                    ORBIT.canvas.parentNode.removeChild(ORBIT.venusCircle);
                }
                break;
            case "earth":
                if (this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.removeChild(ORBIT.earthText);
                    ORBIT.canvas.parentNode.removeChild(ORBIT.earthCircle);
                }
                break;
            case "mars":
                if (this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.removeChild(ORBIT.marsText);
                    ORBIT.canvas.parentNode.removeChild(ORBIT.marsCircle);
                }
                break;
            case "jupiter":
                if (this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.removeChild(ORBIT.jupiterText);
                    ORBIT.canvas.parentNode.removeChild(ORBIT.jupiterCircle);
                }
                break;
            case "saturn":
                if (this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.removeChild(ORBIT.saturnText);
                    ORBIT.canvas.parentNode.removeChild(ORBIT.saturnCircle);
                }
                break;
            case "uranus":
                if (this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.removeChild(ORBIT.uranusText);
                    ORBIT.canvas.parentNode.removeChild(ORBIT.uranusCircle);
                }
                break;
            case "neptune":
                if (this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.removeChild(ORBIT.neptuneText);
                    ORBIT.canvas.parentNode.removeChild(ORBIT.neptuneCircle);
                }
                break;
            case "moon":
                if (this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.removeChild(ORBIT.moonText);
                    ORBIT.canvas.parentNode.removeChild(ORBIT.moonCircle);
                }
                break;
        }
    },
    //显示指定行星的span
    showHoverTextById: function (pid, text, circle) {
        switch (pid) {
            case "sun":
                if (!this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.appendChild(ORBIT.sunText);
                    ORBIT.canvas.parentNode.appendChild(ORBIT.sunCircle);
                }
                break;
            case "mercury":
                if (!this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.appendChild(ORBIT.mercuryText);
                    ORBIT.canvas.parentNode.appendChild(ORBIT.mercuryCircle);
                }
                break;
            case "venus":
                if (!this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.appendChild(ORBIT.venusText);
                    ORBIT.canvas.parentNode.appendChild(ORBIT.venusCircle);
                }
                break;
            case "earth":
                if (!this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.appendChild(ORBIT.earthText);
                    ORBIT.canvas.parentNode.appendChild(ORBIT.earthCircle);
                }
                break;
            case "mars":
                if (!this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.appendChild(ORBIT.marsText);
                    ORBIT.canvas.parentNode.appendChild(ORBIT.marsCircle);
                }
                break;
            case "jupiter":
                if (!this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.appendChild(ORBIT.jupiterText);
                    ORBIT.canvas.parentNode.appendChild(ORBIT.jupiterCircle);
                }
                break;
            case "saturn":
                if (!this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.appendChild(ORBIT.saturnText);
                    ORBIT.canvas.parentNode.appendChild(ORBIT.saturnCircle);
                }
                break;
            case "uranus":
                if (!this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.appendChild(ORBIT.uranusText);
                    ORBIT.canvas.parentNode.appendChild(ORBIT.uranusCircle);
                }
                break;
            case "neptune":
                if (!this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.appendChild(ORBIT.neptuneText);
                    ORBIT.canvas.parentNode.appendChild(ORBIT.neptuneCircle);
                }
                break;
            case "moon":
                if (!this.detectHoverText(pid)) {
                    ORBIT.canvas.parentNode.appendChild(ORBIT.moonText);
                    ORBIT.canvas.parentNode.appendChild(ORBIT.moonCircle);
                }
                break;
        }
    },
    //检测父div中是否存在相应行星的span
    detectHoverText: function(pid){
        var PID = pid.charAt(0).toLocaleUpperCase() + pid.substring(1);
        for(var i in ORBIT.canvas.parentNode.children){
            if(-1 != navigator.userAgent.indexOf('Firefox')){
                if(PID == ORBIT.canvas.parentNode.children[i].textContent){
                    return true;
                }
            }
            else{
                if(PID == ORBIT.canvas.parentNode.children[i].innerText){
                    return true;
                }
            }
        }
        return false;
    },
    //检测该星体是否在摄像机的前面
    planetIsBeforeCamera: function(pid){
        var pidPosition = ORBIT.planet[pid].object.position;
        var targetPosition = ORBIT.tracedObject.position;
        var cameraPosition = ORBIT.camera.position;
        var directionVector = new THREE.Vector3(pidPosition.x - targetPosition.x, pidPosition.y - targetPosition.y, pidPosition.z - targetPosition.z);
        var normalVector = new THREE.Vector3(cameraPosition.x - targetPosition.x, cameraPosition.y - targetPosition.y, cameraPosition.z - targetPosition.z);
        if(Matrix.angleVector3(directionVector, normalVector) < Math.PI / 2){
            var interSection = Matrix.calculateInterSectionLAndP(targetPosition, directionVector, cameraPosition, normalVector);
            if(Matrix.distanceVector3(pidPosition, targetPosition) < Matrix.distanceVector3(interSection, targetPosition)){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return true;
        }
    },
    darwHoverText: function (pname, color, position2D) {
        var orbitNameText = document.createElement("span");
        var orbitCircle = document.createElement("span");
        this.disableMouseEvent(orbitNameText);
        this.disableMouseEvent(orbitCircle);
        var x = position2D.x;
        var y = position2D.y;
        orbitNameText.style.left = x + 20 - ORBIT.circleR + "px";
        orbitNameText.style.top = y - ORBIT.circleR + "px";
        orbitCircle.style.left = x - ORBIT.circleR + "px";
        orbitCircle.style.top = y - ORBIT.circleR + "px";
        orbitNameText.style.position = "fixed";
        orbitCircle.style.position = "fixed";
        orbitNameText.style.display = "block";
        orbitCircle.style.display = "block";
        orbitNameText.style.zIndex = 0;
        orbitCircle.style.zIndex = 0;
//    orbitNameText.style.color = "#748590";
        orbitNameText.style.color = "#ffffff";//color;
        orbitCircle.style.color = "#ffffff";//color;
        orbitNameText.style.height = ORBIT.textY + "px";
        orbitNameText.style.width = ORBIT.textX + "px";
        orbitCircle.style.height = ORBIT.textY + "px";
        orbitCircle.style.width = ORBIT.textX + "px";
        orbitNameText.style.fontSize = ORBIT.textZ + "px";
        var text;
        switch (pname) {
            case "sun":
                text = 'Sun';
                break;
            case "mercury":
                text = 'Mercury';
                break;
            case "venus":
                text = 'Venus';
                break;
            case "earth":
                text = 'Earth';
                break;
            case "mars":
                text = 'Mars';
                break;
            case "jupiter":
                text = 'Jupiter';
                break;
            case "saturn":
                text = 'Saturn';
                break;
            case "uranus":
                text = 'Uranus';
                break;
            case "neptune":
                text = 'Neptune';
                break;
            case "moon":
                text = 'Moon';
                break;
            default:
                text = pname;
                break;
        }
        orbitCircle.innerHTML = '<canvas id = "circle" width =  20  height =  20></canvas>';
        orbitNameText.innerHTML = '<B>' + text + '</B>';
        ORBIT.canvas.parentNode.appendChild(orbitNameText);
        ORBIT.canvas.parentNode.appendChild(orbitCircle);
        var cans = orbitCircle.children[0].getContext('2d');
        this.drawCircle(cans, 10, 10, ORBIT.circleR);
        return new Array(orbitNameText, orbitCircle);
    },
    drawCircle: function (cans, x, y, r){
        cans.beginPath();
        cans.arc(x, y, r, 0, 2 * Math.PI, 1);
        cans.closePath();
        cans.strokeStyle = 'white';
        cans.lineWidth = 0.7;
        cans.stroke();
    },
    getObjectScreenPosition: function (worldPosition) {
        (new THREE.Projector).projectVector(worldPosition, ORBIT.camera);
        return { x: (1 + worldPosition.x) * ORBIT.canvas.width / 2 + ORBIT.canvas.getBoundingClientRect().left,
            y: (1 - worldPosition.y) * ORBIT.canvas.height / 2 + ORBIT.canvas.getBoundingClientRect().top };
    }
};















