import '../vendor/nested-sortable/bundle.js';
import './css/style.css';

var parseHTML = require('./functions');

jQuery.fn.extend({
	bNestedSortable: function(config) {
		var defaultConfig = {
			attribute : 'data-id',
			handle: 'div',
			items: 'li',
			excludeRoot : true,
			toleranceElement: '> div',
			wrapEl: this,
			addItem: function(item) {
				parseHTML.addItem(item, this);
			},
			removeItem: function(item) {
				parseHTML.removeItem(item, this);
			},
			setData : function(newData){
				parseHTML.setData(newData,this);
			},
			getData : function(){
				return parseHTML.getData(this);
			}
		}
		if (config != null) {
			$.extend(defaultConfig, config);
			config = defaultConfig;
		} else
			config = defaultConfig;

		if (config.bdata != undefined) {
			parseHTML.parseHTMLItems(config);
		}

		return config;
	}
});