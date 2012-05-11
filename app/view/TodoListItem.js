Ext.define('MyApp.view.TodoListItem',
	{
		xtype: 'todolistitem',
		extend: 'Ext.dataview.component.DataItem',
		requires: [
			'Ext.Button',
			'MyApp.mixin.Sortable'
		],
		mixins: {
			sortable: 'MyApp.mixin.Sortable'
		},

		config:
		{
			draggable : {
				direction: 'vertical',
				constraint: false
			},

			listeners : {
				initialize: function ()
				{
					this.mixins.sortable.constructor(this, this.config);
				}
			},

			height: 40,
			cls: 'todo-list-item',

			dataMap: {
				getName: {
					setHtml: 'name'
				},

				getSortBtn: {
					setItemId: 'id'
				}
			},

			name: {
				cls: 'x-name',
				flex: 1,
				action: 'doShowComments'
			},

			sortBtn: {
				action: 'doSort',
				iconMask: true,
				ui: 'plain',
				iconCls: 'list'
			},

			layout: {
				type: 'hbox',
				align: 'center'
			}
		},


		applyName: function (config)
		{
			return Ext.factory(config, Ext.Component);
		},

		updateName: function(newBtn, oldBtn) {
			if (oldBtn) {
				this.remove(oldBtn);
			}

			if (newBtn) {
				this.add(newBtn);
			}
		},


		applySortBtn: function(config) {
			return Ext.factory(config, Ext.Button, this.getSortBtn());
		},

		updateSortBtn: function(newName, oldName) {
			if (newName) {
				this.add(newName);
			}

			if (oldName) {
				this.remove(oldName);
			}
		},


		updateRecord: function(newRecord) {
			if (!newRecord) {
				return;
			}
			this._record = newRecord;

			var me = this,
				dataview = me.config.dataview,
				data = dataview.prepareData(newRecord.getData(true), dataview.getStore().indexOf(newRecord), newRecord),
				items = me.getItems(),
				item = items.first(),
				dataMap = me.getDataMap(),
				componentName, component, setterMap, setterName;

			if (!item) {
				return;
			}
			for (componentName in dataMap) {
				setterMap = dataMap[componentName];
				component = me[componentName]();
				//console.log('componentName', componentName, 'setterMap', setterMap, 'component', component);

				switch (componentName)
				{
					default:
						if (component) {
							for (setterName in setterMap) {
								if (component[setterName]) {
									component[setterName](data[setterMap[setterName]]);
								}
							}
						}
					break;
				}
			}

			/**
			 * @event updatedata
			 * Fires whenever the data of the DataItem is updated
			 * @param {Ext.dataview.component.DataItem} this The DataItem instance
			 * @param {Object} newData The new data
			 */
			me.fireEvent('updatedata', me, data);

			// Bypassing setter because sometimes we pass the same object (different properties)
			item.updateData(data);
		}

	});