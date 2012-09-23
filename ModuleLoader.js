console.log('Executing ModuleLoader.');

var ModuleLoader,
    modules = {},
    glob = this;

ModuleLoader =
    function (targetId, awaits) {
        var onRegistered, self = this;

        self.targetId = targetId;
        self.awaits = awaits || [];

        self.tryLoadModules();

        onRegistered = function (signal) {
            glob.console.log('Module ' + signal.data.name + ' registered.');

            if (self.awaits.length && self.awaits.indexOf(signal.data.name) > -1) {
                glob.console.log(self.targetId + ' is waiting for it, trying to load modules.');

                self.tryLoadModules(self.awaits);
            }
        };

        device.signals.on('loader:registered', onRegistered);

        glob.console.log('Loader for script ' + self.targetId + ' created.');
    };

ModuleLoader.prototype.tryLoadModules =
    function () {
        var found = {},
            self = this,
            loadModules =
                function () {
                    glob.console.log(self.targetId + ' requires ' + self.awaits + '.');

                    var all = self.awaits.slice(0),
                        name,
                        l = self.awaits.length,
                        module;

                    while (name = self.awaits.pop()) {
                        module = modules[name];
                        if (module) {
                            found[name] = module;
                        } else {
                            self.awaits = all;
                            break;
                        }
                    }

                    if (self.awaits.length) {
                        glob.console.log('We don\'t have everything ' + self.targetId + ' requires.');
                        return false;
                    }

                    glob.console.log('Found all required modules for ' + self.targetId + '.');

                    return found;
                };

        if (self.awaits.length && !loadModules()) { return; }

        device.signals.emit('loader:loaded:' + self.targetId, { loader: self, modules: found });
    };

ModuleLoader.prototype.register =
    function (name, module) {
        modules[name] = module;

        device.signals.emit('loader:registered', { name: name });

        glob.console.log(this.targetId + ' registered ' + name + '.');
    };

device.signals.on('loader:load', function (e) {
    var targetId = e.scriptId,
        awaits = e.require,
        moduleLoader = new ModuleLoader(targetId, awaits);
});

device.signals.emit('loader:updated', { version: '0.0.2' });

console.log('ModuleLoader executed.');