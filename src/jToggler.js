(function ( $ ) {

    $.widget("custom.jToggler", {

        // default options, can be overwritten within init
        options: {
            id: false,
            active: true,
            label: {
                on: 'On',
                off: 'Off'
            },
            switchColor: {
                on: '#0B7BC0',
                off: '#A1A1A1'
            },
            textColor: {
                on: '#0B7BC0',
                off: '#A1A1A1'
            },
            bgColor: {
                on: '#AAAAAA',
                off: '#555555'
            },
            border: {
                size: '2px',
                color: '#ffffff'
            },
            borderRadius: {
                containerRad: '50px',
                switchRad: '50px'
            },
            size: {
                width: '116px',
                height: '40px',
                switchSize: '38px'
            },
            font: {
                family: 'Open Sans, Arial, sans-serif',
                size: '18px',
                weight: 700,
                style: 'normal',
                spacing: '14px'
            }
        },

        // function called to init a new widget
        _create: function(){

            // calls to _getColor function
            var bgColor = this._getColor('bgColor');
            var switchColor = this._getColor('switchColor');
            var textColor = this._getColor('textColor');

            // check for id
            if (this.options.id == false) {
                var containerId = this.element.attr('id');
                if (containerId == undefined) {
                    throw 'no specific id given and container has no id';
                } else {
                    var id = '#'+containerId+' ';
                }
            } else {
                var id = '#'+this.options.id+' ';
            }

            // check if should be active on startup
            if (this.options.active == true) {
                var checked = 'checked';
            } else {
                var checked = '';
            }

            // calc switchMargin and switch right offset
            var switchMargin = (parseInt(this.options.size.height) - parseInt(this.options.size.switchSize)) / 2;
            var switchRightOffset = parseInt(this.options.size.width) - (parseInt(this.options.size.switchSize) + (switchMargin*2) + 4);

            // concat font styles to one font attribute
            var font = this.options.font.style + ' ' + this.options.font.weight + ' ' + this.options.font.size + '/' + this.options.size.height + ' ' + this.options.font.family;

            // create the necessary html markup and add it to the container
            var html = '<div class="onoffswitch">'+
                '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" '+checked+'>'+
                '<label class="onoffswitch-label" for="myonoffswitch">'+
                '<div class="onoffswitch-inner"></div>'+
                '<div class="onoffswitch-switch"></div>'+
                '</label>'+
                '</div>';

            this.element.html(html).css('display', 'inline-block');

            // create css styles with changeable options
            var rules = '';
            rules += id+'.onoffswitch {width: '+this.options.size.width+';}';
            rules += id+'.onoffswitch-label {border: '+this.options.border.size+' solid '+this.options.border.color+'; border-radius: '+this.options.borderRadius.containerRad+';}';
            rules += id+'.onoffswitch-switch {background-color: '+switchColor.off+';border: '+this.options.border.size+' solid '+this.options.border.color+'; width: '+this.options.size.switchSize+'; margin: '+switchMargin+'px; right: '+switchRightOffset+'px; border-radius: '+this.options.borderRadius.switchRad+';}';
            rules += id+'.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {background-color: '+switchColor.on+'}';
            rules += id+'.onoffswitch-inner:before {content: "'+this.options.label.on+'"; color: '+textColor.on+'; background-color: '+bgColor.on+'; padding-left: '+this.options.font.spacing+';}';
            rules += id+'.onoffswitch-inner:after {content: "'+this.options.label.off+'"; color: '+textColor.off+'; background-color: '+bgColor.off+'; padding-right: '+this.options.font.spacing+'}';
            rules += id+'.onoffswitch-inner:before, '+id+'.onoffswitch-inner:after {height: '+this.options.size.height+'; font: '+font+';}';

            // create style tag with before declared rules and append it to head
            $("<style>")
                .attr("type", "text/css")
                .attr("rel", "stylesheet")
                .html(rules)
                .appendTo("head");

            // binds click function to button, which calls the _changeStatus function
            var that = this;
            this.element.on('click', function(){
                that._changeStatus();
            });
        },

        // checks if given color is array with on/off values or a single hex string
        // gets the options which should be checked (e.g. bgColor)
        // returns array with on/off value -> values are set equal if a single hex string was given
        _getColor: function(el){

            var on = null;
            var off = null;

            if ($.type(this.options[el]) === 'object') {
                on = this.options[el].on;
                off = this.options[el].off;
            } else {
                on = off = this.options[el];
            }

            return {on: on, off: off};

        },

        // getter and setter for the current status
        status: function(value) {
            var checkbox = this.element.find('input[type="checkbox"]');

            if ( value === undefined ) {
                return ( checkbox.prop('checked') == true ? true : false);
            } else {
                if ($.type(value) == 'boolean' || (value == 1) || (value == 0)) {
                    checkbox.prop('checked', value);
                    this._trigger( "statusChange", null, { 'status':checkbox.prop('checked') } );
                } else {
                    throw 'invalid value given; accepting only 1/0 or true/false';
                }

            }
        },

        status_silent: function(value) {
            var checkbox = this.element.find('input[type="checkbox"]');

            if ( value === undefined ) {
                return ( checkbox.prop('checked') == true ? true : false);
            } else {
                if ($.type(value) == 'boolean' || (value == 1) || (value == 0)) {
                    checkbox.prop('checked', value);
                } else {
                    throw 'invalid value given; accepting only 1/0 or true/false';
                }

            }
        },

        // private function for changing the status, triggered on each button click
        // triggers the statusChange callback
        _changeStatus: function(){
            var checkbox = this.element.find('input[type="checkbox"]');

            var set = checkbox.prop('checked') == true ? false : true;
            checkbox.prop('checked', set);

            this._trigger( "statusChange", null, { 'status':checkbox.prop('checked') } );
        },

        switchRightOffset: function(){
            return (parseInt(this.options.size.width) - (parseInt(this.options.size.height) + 4));
        },

        makeSwipeable: function() {

            var _this = this;
            var hasMoved = false;
            var mousePressed = false;
            var start = null;
            var onoffswitch = _this.element.find('.onoffswitch-switch');

            // unbind default actions
            _this.element.off().unbind();

            // Check if touch events or pointer are supported
            touch = 'ontouchstart' in window;
            iePointerOld = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled;
            iePointerNew = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;

            // Supports touch events? Affects most touch devices except ones with IE
            if ('ontouchstart' in window) {

                // Prevent browsers default actions (and removes the 300ms delay)
                _this.element.css('touch-action', 'none');

                _this.element.on('touchstart', function (e) {
                    _this._setSwitchPosition(e, function (pos) {
                        start = pos;
                    });
                });

                _this.element.on('touchmove', function (e) {
                    e.preventDefault(); // Prevent scrolling
                    _this._setSwitchPosition(e);
                    hasMoved = true;
                });

                _this.element.on('touchend', function (e) {
                    if (!hasMoved) // Was just a click
                        _this._changeStatus();
                    else // Was a move
                        _this._setSwitchPosition(e, function (pos) {
                            // Check if moved to left or right, change the state only if differs
                            var newState = (pos <= start);
                            if (newState != _this.status())
                                _this._changeStatus();
                        });

                    // Reset
                    onoffswitch.attr('style', '');
                    hasMoved = false;
                });
            }
            else if (iePointerOld || iePointerNew) { // Pointer events for IE
                var blocked = false;

                /* Unimpressive but very important line, without this the pointermove event isn't fired on touch devices
                 Thanks to Patrick H. Lauke, check the article here: http://webkrauts.de/artikel/2013/drei-unter-einem-dach */
                _this.element.css('touch-action', 'none');

                // Distinguish between old ms prefixed and new (>= IE 11) events
                var downE = (iePointerNew) ? 'pointerdown' : 'MSPointerDown';
                var moveE = (iePointerNew) ? 'pointermove' : 'MSPointerMove';
                var upE = (iePointerNew) ? 'pointerup pointerleave' : 'MSPointerUp MSPointerLeave';

                _this.element.on(downE, function (e) {
                    blocked = false;
                    mousePressed = true;

                    _this._setSwitchPosition(e, function (pos) {
                        start = pos;
                    });
                });

                _this.element.on(moveE, function (e) {
                    if (!mousePressed)
                        return;

                    _this._setSwitchPosition(e);
                });

                _this.element.on(upE, function (e) {
                    if (blocked)
                        return;

                    // Block until next pointerdown, needed because IE fires both events on up (up and leave)
                    blocked = true;

                    var curr = _this._getSwitchPosition(e);

                    // Check if the current position is in a range near the start, if so: handle as click
                    if ( (start-5) >= curr <= (start+5) ) {
                        _this._changeStatus();
                    }
                    else {
                        // Otherwise the move was bigger, so check the direction and change the state only if differs
                        var newState = (curr <= start);
                        if (newState != _this.status())
                            _this._changeStatus();
                    }

                    // Reset
                    mousePressed = false;
                    onoffswitch.attr('style', '');
                });
            }
            else { // Default mouse events for non touch devices

                _this.element.on('mousedown', function (e) {
                    mousePressed = true;
                    _this._setSwitchPosition(e, function (pos) {
                        start = pos;
                    });
                });

                _this.element.on('mousemove', function (e) {
                    if (!mousePressed)
                        return;

                    _this._setSwitchPosition(e);
                    hasMoved = true;
                });

                _this.element.on('mouseup mouseleave', function (e) {
                    if (!mousePressed)
                        return;

                    if (!hasMoved) // Was just a click
                        _this._changeStatus();
                    else // Was a move
                        _this._setSwitchPosition(e, function (pos) {
                            var newState = (pos <= start);
                            if (newState != _this.status())
                                _this._changeStatus();
                        });

                    // Reset
                    mousePressed = false;
                    hasMoved = false;
                    onoffswitch.attr('style', '');
                });
            }
        },

        _getSwitchPosition: function(e) {

            // Get the event target
            var t;
            if ('ontouchstart' in window) {
                t = e.originalEvent.touches[0];

                // In Chrome the "touches" array isn't there on touchend, so get the changed touches
                if (typeof(t) == "undefined")
                    t = e.originalEvent.changedTouches[0];

            } else {
                // Take the whole event, for pointer (and mouse) events this should contain the coordinates
                t = e;

                // Check if the target contains the pageX, otherwise get the original event
                if (typeof(t.pageX) == "undefined")
                    t = e.originalEvent;
            }

            // Position of the event (inside the toggler, in px from the right border)
            var eventPosition = this.element.outerWidth() - (t.pageX - this.element.offset().left);

            // The dimens of the switch: Size + 2* Border + Margin (= height - switchSize)
            var switchDimens = parseInt(this.options.size.switchSize) + parseInt(this.options.border.size) * 2 + (parseInt(this.options.size.height) - parseInt(this.options.size.switchSize));

            // The final position - brings the center of the switch to the exact event position (as value from the right border inside the toggler)
            var pos =  eventPosition - switchDimens / 2;

            return pos;
        },

        _setSwitchPosition: function(e, callback){

            var pos = this._getSwitchPosition(e);
            var onoffswitch = this.element.find('.onoffswitch-switch');

            // Update the switch position while in toggler boundaries (or set to left/right if outside)
            if (pos < this.switchRightOffset() && pos >= 0)
                onoffswitch.attr('style', 'right: ' + pos + 'px !important');
            else if (pos < 0)
                onoffswitch.attr('style', 'right: ' + 0 + 'px !important');
            else
                onoffswitch.attr('style', 'right: ' + this.switchRightOffset() + 'px !important');

            // execute callback if given
            if (typeof(callback) == "function")
                callback(pos);
        }
    });

}( jQuery ));
