console.group("Diagnostics");

console.table({

Kernel:!!Engine,

Storage:!!Engine.storage,

Config:!!Engine.config,

EventBus:!!Engine.events,

UI:!!Engine.ui,

Router:!!Engine.router,

Bootstrap:!!Engine.bootstrap

});

console.groupEnd();
