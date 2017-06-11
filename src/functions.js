var support = {
	getData : function(menu){
		return menu.wrapEl.nestedSortable('toArray', {startDepthCount: 0});
	},
	setData : function(newData, menu){
		menu.bdata = newData;
		menu.bdataTemp = null;
		this.parseHTMLItems(menu);
	},
	removeItem : function(itemID, menu){
		if (menu.bdata.length <= 1) return;
		var indexOfItem = this.findItem(menu.bdata,itemID);
		menu.bdata.splice(indexOfItem,1);
		if (menu.bdata == null)
			menu.bdata = [];

		for(var i=0; i< menu.bdata.length; i++){
			if (menu.bdata[i].parentID == itemID)
				menu.bdata[i].parentID = 0;
		}
		menu.bdataTemp = null;
		this.parseHTMLItems(menu);
	},
	addItem: function(item, menu) {
		menu.bdata.push(item);
		menu.bdataTemp = null;
		this.parseHTMLItems(menu);
	},
	parseHTMLItems: function(menu) {
		var html = "";
		var bdata = menu.bdata;
		for (var i = 0; i < bdata.length; i++) {
			this.parseLevelItem(bdata[i], menu);
		}
		this.removeDuplicateItem(menu.bdataTemp);

		var doneSorted = false;
		while (!doneSorted) {
			for (var i = 0; i < menu.bdataTemp.length; i++) {
				this.sortItem(menu.bdataTemp[i], menu);
			}
			doneSorted = this.checkSortDone(menu);
		}

		for (var i = 0; i < menu.bdataTemp.length; i++) {
			menu.bdataTemp[i].html = this.addHTMLItem(menu.bdataTemp[i], menu);
		}
		this.refresh(menu);
		menu.wrapEl.nestedSortable(menu);
		this.registerEvent(menu);
	},
	refresh: function(menu) {
		var html='';
		for (var i = 0; i < menu.bdataTemp.length; i++) {
			html += menu.bdataTemp[i].html;
		}

		var wrapEl = menu.wrapEl;
		wrapEl.empty();
		wrapEl.html(html);
	},
	parseLevelItem: function(item, menu) { // return level of item parse

		var itemAdd = item;

		if (item.parentID == 0) {
			itemAdd.level = 0;
			if (menu.bdataTemp != null) {
				menu.bdataTemp.push(itemAdd);
			} else {
				menu.bdataTemp = [itemAdd];
			}

			return 0;

		} else {
			var indexOfParent = this.findItem(menu.bdata, item.parentID);
			var itemParent = menu.bdata[indexOfParent];
			itemAdd.level = this.parseLevelItem(itemParent, menu) + 1;
			menu.bdataTemp.push(itemAdd);

			return itemAdd.level;
		}
	},
	findItem: function(bdata, itemID) { // return index of item in bdata array
		for (var i = 0; i < bdata.length; i++) {
			if (bdata[i].id == itemID)
				return i;
		}
	},
	removeDuplicateItem: function(bdata) {
		bdata.sort(function(a, b) {
			return (a.id < b.id) ? -1 : (a.id > b.id) ? 1 : 0;
		});
		for (var i = 0; i < bdata.length; i++) {
			var endIndex = bdata.length - 1;
			if (i <= (endIndex - 1)) {
				if (bdata[i].id == bdata[i + 1].id) {
					bdata.splice(i, 1);
					i = -1;
					continue;
				}
			}
		}

	},
	sortItem: function(item, menu) { // sort item after parse level
		var indexOfItem = this.findItem(menu.bdataTemp, item.id);
		if (item.parentID == 0) {
			menu.bdataTemp[indexOfItem].sorted = 1;
			return indexOfItem;
		} else {
			var indexOfParent = this.findItem(menu.bdataTemp, item.parentID);

			var parentPosition = this.sortItem(menu.bdataTemp[indexOfParent], menu);

			//refresh index of item;
			indexOfItem = this.findItem(menu.bdataTemp, item.id);

			// remove item at current position
			menu.bdataTemp.splice(indexOfItem, 1);
			if (indexOfItem < parentPosition)
				parentPosition--;

			// insert item after parentPosition
			menu.bdataTemp.splice(parentPosition + 1, 0, item);

			menu.bdataTemp[parentPosition + 1].sorted = 1;
			return parentPosition + 1;
		}
	},
	checkSortDone: function(menu) {
		var count = 0;
		for (var i = 0; i < menu.bdataTemp.length; i++) {
			if (menu.bdataTemp[i].sorted != undefined && menu.bdataTemp[i].sorted != null && menu.bdataTemp[i].sorted == 1)
				count++;
		}
		return count >= menu.bdataTemp.length;
	},
	addHTMLItem: function(item, menu) {
		var handleEl = menu.handle;
		var itemEl = menu.items;
		var itemLevel = item.level;

		html = "<" + itemEl + " " + menu.attribute + "= 'menuItem_" + item.id + "'><" + handleEl + ">" + item.content +'<span class="b-menu-delete d-flex align-items-center justify-content-center"><span>x</span></span>' + "</" + handleEl + ">";

		var indexOfItem = this.findItem(menu.bdataTemp, item.id);
		var indexOfNextItem = indexOfItem == (menu.bdataTemp.length - 1) ? indexOfItem : indexOfItem + 1;

		if (indexOfNextItem != indexOfItem) {
			var itemNextLevel = menu.bdataTemp[indexOfNextItem].level;
			if (itemLevel == itemNextLevel)
				html += "</" + itemEl + ">";
			if (itemLevel < itemNextLevel)
				html += "<ol>";
			if (itemLevel > itemNextLevel) {
				html += "</" + itemEl + ">";
				for (var i = itemNextLevel; i < itemLevel; i++) {
					html += "</ol></" + itemEl + ">";
				}
			}
		} else {
			for (var i = 0; i < itemLevel; i++) {
				html += "</" + itemEl + "></ol>";
			}
			html += "</" + itemEl + ">";
		}
		return html;
	},
	registerEvent : function(menu){
		menu.wrapEl.find('.b-menu-delete').on('click', function(e){
			var is = $(this);
			e.preventDefault();
			var id = is.parent().parent().attr('data-id');
			id = id.split("menuItem_")[1];
			menu.removeItem(id);
		})
	}

}

module.exports = support;