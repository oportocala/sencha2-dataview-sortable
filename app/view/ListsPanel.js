Ext.define('MyApp.view.ListsPanel', {
	extend: 'Ext.Container',
	alias: 'widget.listsPanel',

	config: {
		layout: 'fit',
		items: [],
		//height: 100,
		listeners:
		{
			initialize: function (obj, options)
			{

				var ref = this,
					usersStore = Ext.getStore('Users');

				if (usersStore.isLoaded())
				{
					this.createEachUserPanel(usersStore);
				}

				usersStore.on('load', function () {
					ref.createEachUserPanel(usersStore);
				});
			}
		}
	},

	createEachUserPanel: function (store)
	{
		var ref = this;

		var container = Ext.create('Ext.Container', {layout: 'card', id: 'taskListsContainer'});
		ref.removeAll();
		MyApp.store.usersStores = {};
		store.each(function (record)
		{
			if(record.isAssignable())
			{
				var
					id = record.get('id'),

					store = MyApp.store.usersStores[id] = Ext.create('Ext.data.Store', {
						model: 'MyApp.model.Task',
						autoLoad: true,
						remoteFilter: true,
						proxy: {
							type: 'rest',
							url: MyApp.Config.getAPIUrl('tasks'),
							headers: { 'x-token': MyApp.Session.getToken() },
							reader: {
								rootProperty: 'data.list'
							}
						},
						filters: [
							{ property: 'assigned_to', value: id },
							{ property: 'completed', value: 0 }
						]
					}),

					tmpPanel = Ext.create('Ext.Panel', {
						layout: 'fit',
						items:
							[
								{
									xtype: 'container',
									layout: 'fit',
									items:
										[
											{
												xtype: 'toolbar',
												docked: 'top',
												title: record.get('name'),
												layout: {
													pack: 'end',
													type: 'hbox'
												},
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
												store: store,
												height: 800,
												scrollable: true,
												listeners: {
													refresh: function (me)
													{
														//console.log('refresh');
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
							]
					});

				if (id == MyApp.Session.getData().account_id) {
					store.on('load', function () {
						Ext.getStore('Stats').load();
					})
				}

				setInterval(function (s) {s.load()}, 30e3, store);

				container.add(tmpPanel);
			}
		});

		ref.add(container);
	}
});