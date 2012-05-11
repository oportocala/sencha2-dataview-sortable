Ext.define('MyApp.mixin.Sortable', {
	extend: 'Ext.mixin.Mixin',
	requires: [],

	mixinConfig: {
		id: 'sortableList'
	},

	config: {
		recordSortField: 'ord',
		cssClass: 'sortable',
		handleClass: 'list',
		handleSelector: null
	},

	direction: 'vertical',
	disabled: false,
	sorting: false,
	vertical: true,
	el: false,

	constructor : function(el, config)
	{
		this.el = el;
		var target = el.draggableBehavior.draggable,
			events = {
				dragstart: 'onDragStart',
				drag: 'onDrag',
				dragend: 'onDragEnd',
				scope: el
			};
		target.onBefore(events);

		el.addCls(this.config.cssClass);
		this.callParent(arguments);
	},

	onDragStart: function (obj, e)
	{
		var dragStartTarget = e.getTarget('', 10, true);
		if (dragStartTarget && dragStartTarget.classList && dragStartTarget.classList[1] && dragStartTarget.classList[1] == this.config.handleClass) {

			this.parentElement.setScrollable(false);
			currentDragObj = this;
			this.tmpIndex = this.index;

		}else{
			// Stop drag
			return false;
		}

	},

	onDragEnd: function ()
	{
		Ext.each ( this.parentItems, function (item) {

			if(item.index != item.tmpIndex) {
				item.index = item.tmpIndex;
				var rec = item.getRecord();
				this.log('Setting record ' + rec.get('id') + ' /' + this.config.recordSortField + ' to ' + item.tmpIndex);
				rec.set(this.config.recordSortField, item.tmpIndex);
				rec.save();
			}

		});

		this.parentElement.setScrollable(true);
	},

	onDrag: function (obj, e, oX, oY)
	{
		var draggableObject = this.draggableBehavior.draggable,
			height         = this.getHeight(),
			initialOffset  = this.initialIndex * height,
			absoluteY    = oY + initialOffset,
			targetIndex  = Math.round (absoluteY / height);

		if (targetIndex < 0)
		{
			targetIndex = 0;
		}

		if (targetIndex >= this.parentItems.length)
		{
			targetIndex = this.parentItems.length - 1;
		}

		var targetY = targetIndex * height - initialOffset;
		this.log('height:', height, 'initialOffset', initialOffset, 'absoluteY', absoluteY, 'targetIndex', targetIndex, targetY);
		if (targetIndex != this.tmpIndex)
		{
			this.repositionSiblings(targetIndex);
			draggableObject.doDrag(draggableObject, e, oX, targetY);
			this.tmpIndex = targetIndex;
		}

		return false;
	},

	repositionSiblings: function (tmpIndex)
	{
		this.log('Position index changed on ' , this.index ,' moved to', tmpIndex);
		var siblings = this.parentItems,
			self = this;

		var upperBoundIndex = Math.max(tmpIndex, self.index),
			lowerBoundIndex = Math.min(tmpIndex, self.index),
			offset          = self.index < tmpIndex?-1:1,
			dir = offset==-1?'up':'down',
			allCount = siblings.length;

		this.log('Moving indexes between ', lowerBoundIndex, ' and ', upperBoundIndex, ' operator: ', dir);

		Ext.each (siblings,
			function (sibling)
			{
				if(sibling.id != self.id)
				{
					var siblingIndex = sibling.index;
					if (siblingIndex <= upperBoundIndex && siblingIndex >= lowerBoundIndex)
					{

						var targetIndex = siblingIndex + offset;
						targetIndex = Math.max(0, targetIndex);
						targetIndex = Math.min(targetIndex, allCount);
						self.log('Moving item with index', siblingIndex, dir, offset, 'targetIndex:', targetIndex);
						sibling.moveToIndex(sibling, targetIndex);
					}
					else
					{
						sibling.moveToIndex(sibling, sibling.index);
					}
				}
			}
		);
	},

	moveToIndex: function (target, targetIndex) {
		var targetY = (targetIndex - target.initialIndex) * this.getHeight();
		this.log('Moving item', target.index, 'to index', targetIndex, targetY);
		if (target.getTranslatable()) {
			target.getTranslatable().translate(0, targetY, false);
		}else{
			console.warn("Get Translatable was not found, weird");
		}

		target.tmpIndex = targetIndex;
	},

	/**
	 * Debug functionality
	 */
	log: function () {
		if (true) {
			console.log.apply(console, arguments);
		}
	}
});