console.log('Loading test.');

var init,
    postInit,
    MathExt,
    glob = this;

init = function (signal) {
    MathExt = signal.data.modules.MathExt;

    postInit();
};

postInit = function () {
    glob.console.log('Modules loaded.');
    glob.console.log(MathExt.square(2));
    console.log('I belong to test rule.');
};

device.signals.on('loader:loaded:' + __scriptId__, init);
device.signals.emit('loader:load', { scriptId: __scriptId__, require: ['MathExt'] });

console.log('Loaded test.');