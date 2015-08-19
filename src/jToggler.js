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
            return (parseInt(this.options.size.width) - (parseInt(this.options.size.switchSize) + (((parseInt(this.options.size.height) - parseInt(this.options.size.switchSize)) / 2)*2) + 4));
        },

        makeSwipeable: function() {

            var _this = this;

            // unbind default actions
            _this.element.off().unbind();

            var onoffswitch = _this.element.find('.onoffswitch-switch');
            var switchInner = _this.element.find('.onoffswitch-inner');

            // make the container swipeable
            _this.element.swipe({
                threshold: 15, // min pixels must be moved before swipe event is triggered
                triggerOnTouchLeave: true,
                excludedElements: "",
                // callback if a swipe was detected
                swipe:function(event, direction, distance, duration, fingerCount) {
                    if (direction == "left") {
                        onoffswitch.attr('style', '');
                        switchInner.attr('style', '');
                        _this.status(false);
                    } else if (direction == "right") {
                        onoffswitch.attr('style', '');
                        switchInner.attr('style', '');
                        _this.status(true);
                    }
                },
                // callback while swiping
                swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {

                    // adjust the swipe handle
                    if (direction == "left") {
                        if (distance < _this.switchRightOffset()) {
                            onoffswitch.attr('style', 'right: ' + distance + 'px !important');
                            // switchInner.attr('style', 'margin-left: -' + distance);
                        } else {
                            onoffswitch.attr('style', 'right: ' + _this.switchRightOffset() + 'px !important');
                        }

                    } else if (direction == "right") {
                        if (distance < _this.switchRightOffset()) {
                            onoffswitch.attr('style', 'right: ' + (_this.switchRightOffset()-distance) + 'px !important');
                            // switchInner.attr('style', 'margin-left: -' + (114 - distance));
                        } else {
                            onoffswitch.attr('style', 'right: ' + '0px !important');
                        }

                    }

                    // if user stops swiping before the threshold is reached, the cancel phase is entered
                    // here we reset the handle position or change the status of the toggler if the distance was 0 (same as simple click event)
                    if (phase == "cancel") {
                        onoffswitch.attr('style', '');
                        if (distance == 0) {
                            if (_this.status() == true) {
                                _this.status(false);
                            } else {
                                _this.status(true);
                            }
                        }
                    }

                }
            });
        }

    });

}( jQuery ));
