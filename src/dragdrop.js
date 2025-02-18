import ko from 'knockout';

(function() {
    var zones = {};

    function getSource(zone) {
        return zones[zone] && zones[zone].source || null;
    }

    function setSource(zone, source) {
        if (!zones[zone]) {
            zones[zone] = {};
        }
        zones[zone].source = source;
    }

    ko.bindingHandlers.dropzone = {
        init: function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var zone = value.name;
            var drop = value.drop;

            ko.utils.registerEventHandler(element, 'dragenter', function(event) {
                event.preventDefault();
                var source = getSource(zone);
                if (source !== null && source !== element) {
                    element.classList.add('dragover');
                }
                return false;
            });

            ko.utils.registerEventHandler(element, 'dragleave', function(event) {
                element.classList.remove('dragover');
                return false;
            });

            ko.utils.registerEventHandler(element, 'dragover', function(event) {
                event.preventDefault();
                return false;
            });

            ko.utils.registerEventHandler(element, 'drop', function(event) {
                event.preventDefault();
                element.classList.remove('dragover');
                var source = getSource(zone);
                
                if (drop && source) {
                    drop.call(ko.dataFor(element), ko.dataFor(source), ko.dataFor(element), event);
                }
                return false;
            });
        }
    };

    ko.bindingHandlers.dragzone = {
        init: function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var zone = value.name;

            element.draggable = true;

            ko.utils.registerEventHandler(element, 'dragstart', function(event) {
                setSource(zone, element);
                event.dataTransfer.effectAllowed = 'move';
                element.classList.add('dragging');

                event.dataTransfer.setData('text/plain', '');
            });

            ko.utils.registerEventHandler(element, 'dragend', function(event) {
                element.classList.remove('dragging');
                setSource(zone, null);
            });
        }
    };
})(); 