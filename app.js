Ext.Loader.setConfig({
	enabled: true
});

Ext.application({
	name: 'MyApp',
	models: [
		'Task'
	],
	stores: [
		'Tasks'
	],
	views: [
		'MainPanel'
	],
	controllers: [
		'List'
	],

	requires: [
		'MyApp.StateManager'
	],

	launch: function ()
	{
		MyApp.StateManager.init();
	}

});