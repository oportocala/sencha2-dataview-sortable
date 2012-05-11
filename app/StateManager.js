Ext.define('MyApp.StateManager', {
	singleton: true,
	/**
	 *
	 */
	init: function ()
	{
		this.views =
		{
			mainView:  Ext.create('MyApp.view.MainPanel',  { fullscreen: true })
		};

		Ext.Viewport.add(this.views.mainView);
	}
});