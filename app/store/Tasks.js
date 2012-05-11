Ext.define('MyApp.store.Tasks', {
	extend: 'Ext.data.Store',
	config: {
		model: 'MyApp.model.Task',
		storeId: 'Tasks',
		autoLoad: true
	}
});