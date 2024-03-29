function makeDraggable(evt) {
    var svg = evt.target;
    let selectedElement = null, offset = null;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('contextmenu', showmenu)
    svg.addEventListener('wheel', scroll)

    var svgPan = false;

    var currentMousePos;

    function showmenu(evt) {
        evt.preventDefault();
        addnew(evt);
    }

    function scroll(evt){
        console.log('scrolled');
        zoomFactor = evt.deltaY;
        if(zoomFactor<0) {
            // zoom in
            viewBoxVal = svg.viewBox.baseVal;
            viewBoxVal.height -= 90;
            viewBoxVal.width -= 90;
            //debugger;
        }
        else if(zoomFactor>0) {
            // zoom out
            viewBoxVal = svg.viewBox.baseVal;
            viewBoxVal.height += 90;
            viewBoxVal.width += 90;
        }
    }

    function startDrag(evt) {
        if (evt.target.parentNode.classList.contains('draggable')) {
            selectedElement = evt.target.parentNode;
            svgPan = false;

            // get the mouse position offset in SVG units
            offset = getMousePosition(evt);

            // get the transform - if no transform exists add a default transform
            var transforms = selectedElement.transform.baseVal;
            if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                var translate = svg.createSVGTransform();
                translate.setTranslate(0, 0);
                selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            }

            transform = transforms.getItem(0);

            //offset.x -= parseFloat(selectedElement.getAttribute("x"));
            //offset.y -= parseFloat(selectedElement.getAttribute("y"));

            // change the offset
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;
        } else if (evt.target.classList.contains('main')) {
            selectedElement = null;
            svgPan = true;
            currentMousePos = {
                x:evt.clientX,
                y:evt.clientY
            }
        }


    }

    function drag(evt) {
        if(svgPan)
        {
            updatedMouseVal = {
                x:evt.clientX,
                y:evt.clientY
            }

            deltaMouseVal = {
                x:updatedMouseVal.x - currentMousePos.x,
                y:updatedMouseVal.y - currentMousePos.y
            }

            currentSVGViewBox = svg.viewBox.baseVal;
            
            // calculate pan speed
            let viewBoxDimensions = {
                height:currentSVGViewBox.height,
                width:currentSVGViewBox.width
            }

            let SvgDimensions = {
                height:svg.height.baseVal.value,
                width:svg.height.baseVal.value    
            }

            svgPanFactor = {
                height:viewBoxDimensions.height/SvgDimensions.height,
                width:viewBoxDimensions.width/SvgDimensions.width
            }

            svgPanFactor = svgPanFactor.height>svgPanFactor.width?svgPanFactor.height:svgPanFactor.width;
            currentSVGViewBox.x -= (deltaMouseVal.x*svgPanFactor);
            currentSVGViewBox.y -= (deltaMouseVal.y*svgPanFactor);
            currentMousePos = updatedMouseVal;
            return;
        }

        if (selectedElement !== null) {
            evt.preventDefault();

            var coords = getMousePosition(evt);

            transform.setTranslate(coords.x - offset.x, coords.y - offset.y);
            //selectedElement.setAttribute("x", coords.x - offset.x);
            //selectedElement.setAttribute("y", coords.y - offset.y);
        }
    }

    function endDrag(evt) {
        selectedElement = null;
        svgPan = false;
    }

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    function screenCoordsToSVG(screenX, screenY, svgRef) {
        // translate that to svg points
        pt = svgRef.createSVGPoint();
        pt.x = screenX;
        pt.y = screenY;

        var svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

        return {
            x: svgP.x,
            y: svgP.y
        }
    }

    function addnew(evt) {
        var svgP = screenCoordsToSVG(evt.clientX, evt.clientY, svg);

        newG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttributeNS(null, 'cx', svgP.x);
        circle.setAttributeNS(null, 'cy', svgP.y);
        circle.setAttributeNS(null, 'r', 100);
        newG.appendChild(circle);
        newG.setAttributeNS(null, 'class', 'draggable');
        document.getElementById('main-group').appendChild(newG);
    }
}