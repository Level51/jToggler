# jToggler
A jQuery UI plugin, that creates a on/off toggler inside a specified container element.

## Maintainers
- Daniel Kliemsch [dk@lvl51.de](mailto:dk@lvl51.de)
- Julian Scheuchenzuber [js@lvl51.de](mailto:js@lvl51.de)

## Setup
Get the repo, check the dependencies and take a look to the example.
You can also get the dependencies via bower.

### Options
- id: 			uses id of element if not explicit set
- label:		array with ( on | off )
- textColor:	hex or array with on/off values
- switchColor:	hex or array with on/off values
- bgColor:		hex or array with on/off values
- border: 		array with ( size | color )
- size:			array with ( width | height | switchSize )
- font:			array with ( family | size | weight | style | spacing )

### Methods
#### status (getter/setter)
- getter: el.jTrigger('status')
- setter: el.jTrigger('status', value) // value can be either 0/1 or true/false

#### status_silent
Same as status, but doesn't trigger the statusChanged callback

#### makeSwipeable
Allows to swipe the toggler. Since v0.2.0 this is custom logic, so the the jquery-touchswipe lib isn't necessary anymore.

### Callback
#### statusChange
triggered on every status change


## Dependencies
- jQuery
- jQuery UI
- jQuery UI Touch Punch