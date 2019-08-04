function makeDraggable(evt) {
    var svg = evt.target;
    let selectedElement = null, offset = null;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('contextmenu', showmenu)



    var svgPan=false;

    function showmenu(evt){
        evt.preventDefault();
        addnew(evt);
    }

    function startDrag(evt) {
        if (evt.target.parentNode.classList.contains('draggable')) {
            selectedElement = evt.target.parentNode;
        }
        else if(evt.target.classList.contains('main')) {
            selectedElement = document.getElementById("main-group");
        }
        
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
    }

    function drag(evt) {
        if (selectedElement!==null) {
            evt.preventDefault();

            var coords = getMousePosition(evt);

            transform.setTranslate(coords.x - offset.x, coords.y - offset.y);
            //selectedElement.setAttribute("x", coords.x - offset.x);
            //selectedElement.setAttribute("y", coords.y - offset.y);
        }
    }

    function endDrag(evt) {
        selectedElement = null;
    }

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    function screenCoordsToSVG(screenX, screenY, svgRef){
        // translate that to svg points
        pt = svgRef.createSVGPoint();
        pt.x = screenX;
        pt.y = screenY;

        var svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        
        return {
            x:svgP.x,
            y:svgP.y
        }
    }

    function addnew(evt)
    {
        var svgP = screenCoordsToSVG(evt.clientX, evt.clientY, svg);
        
        newG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttributeNS(null, 'cx', svgP.x);
        circle.setAttributeNS(null, 'cy', svgP.y);
        circle.setAttributeNS(null, 'r', 100);
        newG.appendChild(circle);
        newG.setAttributeNS(null,'class','draggable');
        document.getElementById('main-group').appendChild(newG);
    }
}
