Ext.define('MyApp.controller.List', {
	extend: 'Ext.app.Controller',
	requires: [],
	config: {
		control: {
			'[action=doRefreshList]': {
				tap: 'doRefreshList'
			}
		}
	},

	doRefreshList: function (obj)
	{
		Ext.getStore('Tasks').load();
	}
});
