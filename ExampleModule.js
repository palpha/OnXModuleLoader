var init, arm;

init = function (signal) {
    var loader = signal.data.loader;
    loader.register('MathExt', {
        square: function (n) {
            console.log('Squaring ' + n);
            return n * n;
        },
        cube: function (n) {
            console.log('Cubing ' + n);
            return n * n * n;
        }
    });
};

arm = function (e) {
    if (e) { console.log('ModuleLoader updated, re-arming.'); }
    device.signals.emit('loader:load', { scriptId: __scriptId__ });
};

device.signals.on('loader:loaded:' + __scriptId__, init);
arm();
device.signals.on('loader:updated', arm);