class PlayPlug {
    constructor() {
        this.steps = [
            {
                element: 'body > app-root > app-dashboard > div > app-sidebar > app-sidebar-nav > app-sidebar-nav-items > app-sidebar-nav-link:nth-child(4) > a',
                title: 'Show All the NDC List',
                content: 'This will show you all the NDC List, which is created and you have an option to create a new one.',    
            },
            {
                element: 'body > app-root > app-dashboard > div > main > div > app-ndc > div > div > div > div > div.card-header > button',
                title: 'Click to open the New NDC Form',
                content: 'This will show you all the NDC List, which is created and you have an option to create a new one.',    
            }
        ];
        this.stepIndex = 0;
        this.isRunning = false;
        this.isPaused = false;
        //elements
        this.window = window;
        this.document = document;
        this.options = {
            animate: true,
            opacity: 0.5,
            offset: 20,
            borderRadius: 3,
            allowClose: true,
            highlight: true,
            highlightOffset: 5,
            keyboard: true,
            width: '300px',
            zIndex: 10050,
            removeArrow: false,
            onNext: () => null,
            onPrevious: () => null,
        }
        //events
        this.onClick = this.onClick.bind(this);
        this.bind();
    }
    //start the Play Plug Tour
    start(startIndex = 0) {
        this.isRunning = true;
        this.stepIndex = startIndex;
        this.render(this.steps[this.stepIndex]);
    }
    //add the popover to document
    render(step) {
        var element = step.element ? this.document.querySelector(step.element) : null;
        //check if element is present if not make it floating
        if (element) {
            element.style.position = !element.style.position ? 'relative' : element.style.position;
            const step_highlight = !step.highlight ? true : step.highlight;                
            //highlight is set to true
            if (this.options.highlight && step_highlight ) {
                element.setAttribute('pp-highlight', 'true');
            }
        }
        //popoverpopover
        const popover = this.document.createElement('div');        
        popover.classList.add('pp-popover');
        popover.style.borderRadius = this.options.borderRadius + 'px';
        popover.style.zIndex = this.options.zIndex + 10;

        if (this.options.width) {
            if (typeof this.options.width === 'string') {
                popover.style.width = this.options.width;
            } else if (this.options.width > 0) {
                popover.style.width = this.options.width + 'px';
            }
        }
        //popover inner container
        const popoverInner = this.document.createElement('div');
        popoverInner.classList.add('pp-popover-inner');

        //title
        const title = this.document.createElement('div');
        title.classList.add('pp-title');
        if (step.title) title.innerText = step.title;
        if (step.title) popoverInner.append(title);

        //content
        const content = this.document.createElement('div');
        content.classList.add('pp-content');
        popoverInner.append(content);
        content.innerHTML = (step.content ? step.content : '');

        //popover arrow
        const arrow = this.document.createElement('div');
        arrow.classList.add('pp-arrow');
        arrow.setAttribute('data-popper-arrow', 'true');
        popover.append(arrow);
        //buttons
        const showBtns = (step.showBtns == null || step.showBtns == 'undefined') ? true : Boolean(step.showBtns);
        if (showBtns){
            const btnNext = this.document.createElement('button');
            const btnBack = this.document.createElement('button');
            btnNext.onclick = function(){
                this.next()
            };
            btnNext.classList.add('pp-btns', 'pp-btn-next');
            btnBack.classList.add('pp-btns', 'pp-btn-back');
            btnNext.innerHTML = (step.btnNext && step.btnNext.text ? step.btnNext.text : (this.stepIndex == this.steps.length - 1 ? 'Done' : 'Next &#8594;'));
            btnBack.innerHTML = (step.btnBack && step.btnBack.text ? step.btnBack.text : (this.stepIndex == 0 ? 'Close' : '	&#8592; Back'));
            popoverInner.append(btnNext);
            popoverInner.append(btnBack);
        }
        //append popover inner container to main pop over
        popover.append(popoverInner);

        //append popover to body
        this.document.body.appendChild(popover);
        if (element) {
            this.positionPopover(element, popover, arrow, step);
            if (this.options.highlight){
                this.createOverlay(element, step);
            }            
        }
    }
    //position popover
    positionPopover(element, popover, arrow, step) {
        var placement = 'auto';
        var strategy = 'absolute';

        popover.style.position = strategy;
        arrow.style.position = 'absolute';

        //element top & left
        var el_top = this.getElementPosition(element).top; 
        var el_left = this.getElementPosition(element).left; 
    
        //if placement is not defined or auto then calculate location
        if (placement == 'auto' || placement == 'auto-start' || placement == 'auto-end') {
            const arrow = placement.replace('auto', '').trim();
            var new_arrow = '';
            //position popover to top
            if (el_top + (popover.offsetHeight + this.options.offset) > this.window.innerHeight - 100) {
                //divide the screen into 3 sections
                //if left is within section 1/3 of the screen then arrow is in the start position
                if (el_left < (this.window.innerWidth / 3)) {
                    new_arrow = arrow.length > 0 ? arrow : '-start';
                }
                //if left is within that section 3/3 of the screen then arrow is in the end position
                else if (el_left > (this.window.innerWidth - (this.window.innerWidth / 3))) {
                    new_arrow = arrow.length > 0 ? arrow : '-end';
                }
                placement = 'top' + new_arrow;
            }

            //position popover to the left
            if ((el_left + element.offsetWidth + popover.offsetWidth) > this.window.innerWidth) {
                //divide the screen into 3 sections
                //if left is within section 1/3 of the screen then arrow is in the start position
                if (el_top < (this.window.innerHeight / 3)) {
                    new_arrow = arrow.length > 0 ? arrow : '-start';
                }
                    //if left is within that section 3/3 of the screen then arrow is in the end position
                else if (el_top > (this.window.innerHeight - (this.window.innerHeight / 3))) {
                    new_arrow = arrow.length > 0 ? arrow : '-start';
                }
                placement = 'left' + new_arrow;
            }

            //position popover to the right
            if (el_left < popover.offsetWidth && (element.offsetWidth + popover.offsetWidth) < this.window.innerWidth) {
                //divide the screen into 3 sections
                //if left is within section 1/3 of the screen then arrow is in the start position
                if (el_top < (this.window.innerHeight / 3)) {
                    new_arrow = arrow.length > 0 ? arrow : '-start';
                }
                    //if left is within that section 3/3 of the screen then arrow is in the end position
                else if (el_top > (this.window.innerHeight - (this.window.innerHeight / 3))) {
                    new_arrow = arrow.length > 0 ? arrow : '-start';
                }
                placement = 'right' + new_arrow;
            }

            //position popover to bottom
            if (el_top < (popover.offsetHeight + this.options.offset) || el_top < 100) {
                //divide the screen into 3 sections
                //if left is within section 1/3 of the screen then arrow is in the start position
                if (el_left < (this.window.innerWidth / 3)) {
                    new_arrow = arrow.length > 0 ? arrow : '-start';
                }
                    //if left is within that section 3/3 of the screen then arrow is in the end position
                else if (el_left > (this.window.innerWidth - (this.window.innerWidth / 3))) {
                    new_arrow = arrow.length > 0 ? arrow : '-end';
                }
                placement = 'bottom' + new_arrow;
            }

            //add to class for css
            popover.classList.add(placement);
        }

        //top
        if (placement == 'top') {
            popover.style.top = (el_top - (popover.offsetHeight + this.options.offset)) + 'px';
            popover.style.left = (el_left + ((element.offsetWidth / 2) - (popover.offsetWidth / 2))) + 'px';
        } else if (placement == 'top-start') {
            popover.style.top = (el_top - (popover.offsetHeight + this.options.offset)) + 'px';
            popover.style.left = el_left - this.options.highlightOffset + 'px';
        } else if (placement == 'top-end') {
            popover.style.top = (el_top - (popover.offsetHeight + this.options.offset)) + 'px';
            popover.style.left = ((el_left + element.offsetWidth + this.options.highlightOffset) - popover.offsetWidth) + 'px';
        }

        //bottom
        else if (placement == 'bottom') {
            popover.style.top = (el_top + element.offsetHeight) + this.options.offset + 'px';
            popover.style.left = (el_left + (element.offsetWidth / 2) - popover.offsetWidth / 2) + 'px';
        } else if (placement == 'bottom-start') {
            popover.style.top = (el_top + element.offsetHeight) + this.options.offset + 'px';
            popover.style.left = (el_left - this.options.highlightOffset) + 'px';
        } else if (placement == 'bottom-end') {
            popover.style.top = (el_top + element.offsetHeight) + this.options.offset + 'px';
            popover.style.left = ((el_left + element.offsetWidth + this.options.highlightOffset) - popover.offsetWidth) + 'px';
        }

        //left
        else if (placement == 'right') {
            popover.style.top = (el_top + (Math.abs(popover.offsetHeight - element.offsetHeight) / 2)) + 'px';
            popover.style.left = (el_left + (element.offsetWidth + this.options.offset)) + 'px';
        } else if (placement == 'right-start') {
            popover.style.top = el_top - this.options.highlightOffset + 'px';
            popover.style.left = (el_left + (element.offsetWidth + this.options.offset)) + 'px';
        } else if (placement == 'right-end') {
            popover.style.top = ((el_top + element.offsetHeight) - popover.offsetHeight) + this.options.highlightOffset + 'px';
            popover.style.left = (el_left + (element.offsetWidth + this.options.offset)) + 'px';
        }

        //right
        else if (placement == 'left') {
            popover.style.top = (el_top + (Math.abs(popover.offsetHeight - element.offsetHeight) / 2)) + 'px';
            popover.style.left = (el_left - (popover.offsetWidth + this.options.offset)) + 'px';
        } else if (placement == 'left-start') {
            popover.style.top = el_top - this.options.highlightOffset + 'px';
            popover.style.left = (el_left - (popover.offsetWidth + this.options.offset)) + 'px';
        } else if (placement == 'left-end') {
            popover.style.top = ((el_top + element.offsetHeight) - popover.offsetHeight) + this.options.highlightOffset + 'px';
            popover.style.left = (el_left - (popover.offsetWidth + this.options.offset)) + 'px';
        }

        //if position is fixed scroll to top
        if (strategy === 'fixed'){
            this.window.scrollTo(0, 0);
        }else{
            popover.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        }            
    }

    createOverlay(element, step = null){
        var strategy = (step && step.strategy) ? step.strategy : 'absolute';

        var overlay1 = document.createElement('div');
        overlay1.classList.add('pp-overlay', 'open', 'overlay1');
        overlay1.style.zIndex = this.options.zIndex - 10;

        var overlay2 = document.createElement('div');
        overlay2.classList.add('pp-overlay', 'open', 'overlay2');
        overlay2.style.zIndex = this.options.zIndex - 10;

        var overlay3 = document.createElement('div');
        overlay3.classList.add('pp-overlay', 'open', 'overlay3');
        overlay3.style.zIndex = this.options.zIndex - 10;

        var overlay4 = document.createElement('div');
        overlay4.classList.add('pp-overlay', 'open', 'overlay4');
        overlay4.style.zIndex = this.options.zIndex - 10;
    
        //append to body
        this.document.body.appendChild(overlay1);
        this.document.body.appendChild(overlay2);
        this.document.body.appendChild(overlay3);
        this.document.body.appendChild(overlay4);

        //element top & left
        var el_top = this.getElementPosition(element).top; 
        var el_left = this.getElementPosition(element).left;
        
        var highlight_offset = this.options.highlightOffset;

        //overlays top-left
        overlay1.style.position = strategy;
        overlay1.style.top = 0;
        overlay1.style.width =  el_left - highlight_offset + 'px';
        overlay1.style.height =  (el_top + element.offsetHeight + highlight_offset) + 'px';
        overlay1.style.left = 0;

        //overlays top-right
        overlay2.style.position = strategy;
        overlay2.style.top = 0;
        overlay2.style.right = 0;
        overlay2.style.height = (el_top - highlight_offset) + 'px';
        overlay2.style.left = (el_left - highlight_offset) + 'px';

        //overlays bottom-right
        overlay3.style.position = strategy;
        overlay3.style.top = (el_top - highlight_offset) + 'px';
        overlay3.style.right = 0;
        overlay3.style.bottom = 0 - (this.document.body.offsetHeight - this.window.innerHeight) + 'px';
        overlay3.style.left = (el_left + element.offsetWidth + highlight_offset) + 'px';

        //overlays bottom-left
        overlay4.style.position = strategy;
        overlay4.style.top = (el_top + element.offsetHeight + highlight_offset) + 'px';
        overlay4.style.width =   el_left + element.offsetWidth + highlight_offset  + 'px';
        overlay4.style.bottom = 0 - (this.document.body.offsetHeight - this.window.innerHeight) + 'px';
        overlay4.style.left = 0;
    }

    getElementPosition(element){
        return {
            top: (this.getOffset(element).top + this.getTranslate3D(element).Y) - (element.style.transform ? this.getTranslateXY(element).translateY : 0),
            left: (this.getOffset(element).left + this.getTranslate3D(element).X) -( element.style.transform ? this.getTranslateXY(element).translateX : 0)
        }
    }
    //get css transform property to fixed issues with transform elements
    getTranslate3D(element){
        var transform = window.getComputedStyle(element, null).getPropertyValue('-webkit-transform');
        var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)(?:, (-{0,1}.+))(?:, (-{0,1}.+))\))/);

        let x, y, z;
        if (!results) {            
            return { X: 0, Y: 0, Z: 0 };
        }
        if (results[1] == '3d') {
            [x, y, z] = results.slice(2, 5);
            return { X: parseInt(x), Y: parseInt(y), Z: parseInt(z) };            
        }

        results.push(0);
        [x, y, z] = results.slice(5, 8);
        return { X: parseInt(x), Y: parseInt(y), Z: parseInt(z) };      
    }
    getOffset( el ) {
        var _x = 0;
        var _y = 0;
        var rect = el.getBoundingClientRect();

        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        
        _y = parseInt(rect.y) > parseInt(_y) ? rect.y : _y;
        _x = parseInt(rect.x) > parseInt(_x) ? rect.x : _x;
       
        return { top:  _y , left: _x };
    }
    //get css transform property to fixed issues with transform elements
    getTranslateXY(element) {
        
        const style = window.getComputedStyle(element)
        const matrix = new DOMMatrixReadOnly(style.transform)

        return {
            translateX:  Math.abs(element.offsetWidth * (matrix.m41 / 100)),
            translateY:  Math.abs(element.offsetHeight * (matrix.m42 / 100))
        }
    }
    // go to next step
    next() {
        this.stepIndex++;
        if (this.steps.length === 0) return false;
        if (this.stepIndex >= this.steps.length) {
            return;
        }
        this.render(this.steps[this.stepIndex]);
    }
    bind() {
        if (!('ontouchstart' in this.document.documentElement)) {
            this.window.addEventListener('click', this.onClick, false);
        }
    }
    onClick(e) {
        e.stopPropagation();
        if (e.target.classList.contains('pp-btn-next')) {
            this.next();
        }

        if (e.target.classList.contains('pp-btn-back')) {
            this.previous();
        }
    }

}
(function(){
    var tour = new PlayPlug();
    setTimeout(() => {
        tour.start(); 
    }, 10000);
})();
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}