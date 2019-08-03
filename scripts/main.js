function makeDraggable(evt) {
    var svg = evt.target;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('wheel', zoom)

    let selectedElement = null, offset = null;;

    let mainGroup = document.getElementById('main-g');

    function zoom(evt) {
        let scaleMatrix = mainGroup.transform.baseVal.getItem(0).matrix;
            let sx = scaleMatrix.a;
            let sy = scaleMatrix.d;
        if (evt.deltaY > 0) {
            mainGroup.setAttribute('transform', `scale(${sx + 0.1},${sy + 0.1})`)
        }
        else if (evt.deltaY < 0) {
            let sc = {x:sx-0.1, y: sy-0.1}
            if(sc.x<0.1 || sc.y<0.1)
            {
                mainGroup.setAttribute('transform', `scale(${0.1},${0.1})`);
                return;
            }
            mainGroup.setAttribute('transform', `scale(${sc.x},${sc.y})`)
        }
    }

    function startDrag(evt) {
        if (evt.target.parentNode.classList.contains('draggable'))
            selectedElement = evt.target.parentNode;
        else if(evt.target.classList.contains('main'))
        {
            selectedElement = mainGroup;
        }

        offset = getMousePosition(evt);

        var transforms = selectedElement.transform.baseVal;

        if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            var translate = svg.createSVGTransform();

            translate.setTranslate(0, 0);

            selectedElement.transform.baseVal.insertItemBefore(translate, 0);
        }

        transform = transforms.getItem(0);

        //offset.x -= parseFloat(selectedElement.getAttribute("x"));
        //offset.y -= parseFloat(selectedElement.getAttribute("y"));
        offset.x -= transform.matrix.e;
        offset.y -= transform.matrix.f;
    }
    function drag(evt) {
        if (selectedElement) {
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
}

function addnew(){
    document.getElementsByClassName("main")[0].children[0].innerHTML += "<g class='draggable'>" + 
        "<rect x='0' y='0' width='10' height='10' fill='blue' />"
        "<rect x='0' y='0' width='5' height='5' fill='red' />"
    "</g>"
}

