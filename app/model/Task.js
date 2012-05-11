Ext.define('MyApp.model.Task', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{
				name: 'id'
			},
			{
				name: 'name',
				type: 'string',
				allowNull: false
			},
			{
				name: 'ord',
				type: 'int'
			}
		],


		proxy: {
			type: 'rest',
			url: 'data/tasks.json',
			reader: {
				rootProperty: 'data'
			}
		}
	}
});