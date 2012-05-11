Ext.define('MyApp.view.MainPanel', {
	extend: 'Ext.Panel',
	requires: [
		'MyApp.view.TodoListItem'
	],

	config: {
		fullscreen: true,
		layout: 'fit',
		items: [
			{
				xtype: 'toolbar',
				docked: 'top',
				title: 'List',
				items: [
					{
						xtype: 'button',
						iconCls: 'refresh',
						iconMask: true,
						pack: 'right',
						action: 'doRefreshList'
					}
				]
			},
			{
				xtype: 'dataview',
				useComponents: true,
				defaultType: 'todolistitem',
				store: 'Tasks',
				height: 400,
				listeners: {
					refresh: function (me)
					{
						var items = me.getInnerItems();
						items = items[0].items.items;

						Ext.each(items, function (item, i) {
							item.index = i;
							item.initialIndex = i;
							item.parentItems = items;
							item.parentElement = me;
							if (item.getTranslatable && item.getTranslatable())
							{
								item.getTranslatable().translate(0, 0, false);
							}
						});

					}
				}
			}
		]
	}

});