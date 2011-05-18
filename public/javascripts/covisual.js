// Cove Visual Javascript Library
// Visuals for Timeline Manipulation using jQuery and Canvas Support

// Timeline Framework
var global = {};

function getGlobalVar(varname) {
	if (typeof(global[varname]) !== "undefined") {
		return global[varname];
	} else {
		return undefined;
	}
}

function setGlobalVar(varname,value) {
	var escaped_var = varname.replace(/[^A-Za-z0-9\.\_\-]/g,'');
	var escaped_val;
	try {
		escaped_val = value.replace(/[^A-Za-z0-9\.\_\-]/g,'');
	} catch(er) {
		escaped_val = value;
	}
	try {
		global[escaped_var] = escaped_val;
	} catch(err) {
		return undefined;
	}
}

function TimeLine () {
	
	var ctx = new Object();
	var target = new Object();
	var c_width = '500px';
	var c_height = '100px';
	var c_scale = '1'; // 1 second per pixel
	var fill_list = {};
	var color_list = [];
	var label_options = {};
	var point_options = {};
	var line_options = {};
	var autoscale = false;
	var options = {};
	var data = {};
	var errOut = "false";
	var intervalID;
	
	// Scaler
	function scaler(video_data_,type_) {
		data_width = parseInt(c_width,10) - 100;
		if (type_ === "frequency") {
			data_width += 100;
		}
		time = video_data_.duration.split(":");
		if (time.length == 3) {
			seconds = parseInt(time[0],10)*3600 + parseInt(time[1],10)*60 + parseInt(time[2],10);
		} else if (time.length == 2) {
			seconds = parseInt(time[0],10)*60 + parseInt(time[1],10);
		} else if (time.length == 1) {
			seconds = time[0];
		} else {
			console.error("Covisuals.js: Invalid Time Format for Video Duration.");
			throw "1";
		}
		spp = seconds/data_width; // seconds per pixel
		return spp;
	}

	// Line Subfunction. line_options_ is a JSON object
	function line(start_x,length,series_number,line_options_) {
		ctx.lineWidth = 3;
		// Repeats Colors. If more than the color_list is rendered.
		if (series_number < color_list.length) {
			ctx.strokeStyle = color_list[series_number - 1];
		} else {
			ctx.strokeStyle = color_list[(series_number % color_list.length + color_list.length - 1) % color_list.length]
		}
		parseOptions(line_options_,false);
		ctx.beginPath();
		y = series_number * 15 + 4; 
		ctx.moveTo(start_x, y);
		ctx.lineTo(start_x + length, y);
		ctx.stroke();
		ctx.closePath();
	}

	function vector(start_x,start_y,end_x,end_y,line_options_) {
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		//parseOptions(line_options_,false); // BUG WITH PARSE OPTIONS FROM FREQUENCY PLOTTING VECTORS
		if (line_options_["strokeStyle"] !== "undefined") {
			ctx.strokeStyle = line_options_["strokeStyle"];
		}
		// END BUG QUICK FIX
		ctx.beginPath();
		ctx.moveTo(start_x, start_y);
		ctx.lineTo(end_x, end_y);
		ctx.stroke();
		ctx.closePath();
	}

	function triangle(start_x,start_y,end_x,end_y,line_options_) {
		ctx.lineWidth = 1;
		ctx.fillStyle = 'black';
		//parseOptions(line_options_,false); // BUG WITH PARSE OPTIONS FROM FREQUENCY PLOTTING VECTORS
		if (line_options_["fillStyle"] !== "undefined") {
			ctx.fillStyle = line_options_["fillStyle"];
		}
		// END BUG QUICK FIX
		ctx.beginPath();
		ctx.moveTo(start_x, start_y);
		ctx.lineTo(end_x, end_y);
		ctx.lineTo(end_x,c_height)
		ctx.lineTo(start_x,c_height)
		ctx.lineTo(start_x,start_y)
		ctx.fill();
		ctx.closePath();
	}

	function point(x,y,series_number,point_options_) {
		var radius = 3;
		parseOptions(point_options_,false);
		if (series_number < color_list.length) {
			ctx.fillStyle = color_list[series_number - 1];
		} else {
			ctx.fillStyle = color_list[(series_number % color_list.length + color_list.length - 1) % color_list.length]
		}
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI*2,true); // arc(x,y,radius,startAngle,endAngle,clockwise)
		ctx.closePath();
		ctx.fill();
	}

	function label(labeltext, series_number, label_options_) {
		ctx.textBaseline = 'top';
		ctx.textAlign = 'left';
		if (series_number < color_list.length) {
			ctx.fillStyle = color_list[series_number - 1];
		} else {
			ctx.fillStyle = color_list[(series_number % color_list.length + color_list.length - 1) % color_list.length]
		}			
		ctx.font = "12pt Arial";
		maxWidth = 100;
		parseOptions(label_options_,false);
		
		y = series_number*15 - 6; 
		ctx.fillText(labeltext,4, y,maxWidth);
	}
	
	function text(labeltext,x,y,size,color,label_options_) {
		ctx.textBaseline = 'top';
		ctx.textAlign = 'left';
		ctx.fillStyle = color || 'black';
		ctx.font = parseInt(size,10).toString() + "pt Arial";
		maxWidth = 100;
		parseOptions(label_options_,false);
		ctx.fillText(labeltext,x, y,maxWidth);
	}

	// Option Parsing function. Escapes most javascript functions
	function parseOptions(opts,global_flag) {
		$.each(opts, function(i,val) {
			var escaped_var = i.replace(/[^A-Za-z0-9\.]/g,'');
    		var escaped_val;
			try {escaped_val = val.replace(/[^A-Za-z0-9\.]/g,'');} catch(er) {escaped_val = val;}
			try {
      			$.parseJSON(val); 
      			isJSON = true;
    		} catch(error){
      			isJSON = false; 
    		}
			if (eval('ctx.' + escaped_var)) {
				eval('var ctx.' + escaped_var + ' = \'' + val + '\'')
			} else if (isJSON) {
				if (i == "label") {
					label_options = $.parseJSON(val) || val;
				} else if (i == "point") {
					point_options = $.parseJSON(val) || val;
				} else if (i == "line") {
					line_options = $.parseJSON(val) || val;
				} else if (i === "css" && global_flag === true) {
					css = $.parseJSON(val) || val;
					$.each(css, function(j,cval) {
						if (target.css(j) || target.css(j) === "") {
							target.css(j,cval);
						}
					});
				} else if (typeof(eval(escaped_var)) !== "undefined") {
					try {
						eval('var ' + escaped_var + ' = ' + escaped_val);
					} catch(er) {
						eval('var ' + escaped_var + ' = \'' + escaped_val + '\'');
					}
				};
			} else if (target.css(i) && global_flag === true) {
				target.css(i,val)
			} else if (typeof(window[escaped_var] !== "undefined")) {
				eval('var ' + escaped_var + ' = \'' + val + '\'');
			}
		});
	}

	// Fill Generator from FLOT (see https://github.com/flot/flot)
	// Needs manipulation for adding new colors to existing colors and for more than 3 colors
	function fillGenerator(number,schema) {
		var colors = [], variation = 0;
		i = 0;
		var neededColors = schema.length || number - color_list.length; // Will Repeat colors if more series than schema colors. Remove [schema.length ||] if random colors will be generated for extra series instead.
		while (colors.length < neededColors) {
			var color = schema[i] || '#'+(Math.random()*0xFFFFFF<<0).toString(16);
			colors.push(color);
			i++;
		}
		$.each(colors, function(obj) {
			color_list.push(colors[obj].toString());
		});
	}
	
	function update () {
		if (errOut === "false") {
			if (Object.keys(data.data).length > 0 && Object.keys(data.video).length > 0) {
				try {
					clear();
					render();
				} catch (renderErr) {
					errOut = "true";
					throw("Covisual Render Error")
				}
			}
		} else {
			clearInterval(intervalID);
			throw("Covisual cannot update " + target.id + ". Exiting with error");
		}
	}
	
	function render () {
		
	}
	
	function clear() {
		var c_width = getGlobalVar("c_width");
		var c_height = getGlobalVar("c_height");
		target.clearRect(0,0,c_width,c_height);
	}
	
	function setOffset(offset_time) {
		setGlobalVar("offset",offset_time);
	}
	
	function initialize() {
		if (errOut === "false") {
			intervalID = setInterval(update, 10);
		} else {
			throw("CoVisual cannot initialize. Exiting with Error")
		}
	}
	
	function setup(obj, type, data_, options_) {
		target = $(obj);
		if (target.length > 0 && target[0].tagName === "CANVAS") {
			ctx = target[0].getContext("2d");
		
			if (target.css('width')) {
				c_width = parseInt(target.css('width'), 10);
			}
			if (target.css('height')) {
				c_height = parseInt(target.css('height'), 10);
			}

			target.attr('width', c_width).attr('height', c_height);
		
			setGlobalVar("c_width",c_width);
			setGlobalVar("c_height",c_height);
			setGlobalVar("target",target)
			setGlobalVar("offset",0);
			setGlobalVar("type",type);
		
			try {
				options = JSON.parse(options_);
			} catch (err) {
				options = options_;
			}
			setGlobalVar("options",options);
		
			try {
				data = JSON.parse(data_);
			} catch (error) {
				data = data_;
			}
			setGlobalVar("data",data);
		
			parseOptions(options, true);
		
			// BUG (autoscale set to false in parseOptions)
			if (type !== "frequency") {
				autoscale = true; 
			}
			// END BUG
			if (autoscale === true) {
				c_height = Object.keys(data.data).length * 15 + 20;
				target.css('height', c_height.toString() + "px");
				target.attr('height', c_height);
			}

		} else {
				errOut = "true";
				throw("CoVisual TimeLines require HTML5 Canvas Support. Target must be a canvas.");
		}
		
	}
	
	return {
		initialize : initialize,
		setup : setup,
		setOffset : setOffset
	}
	
};
/*
(function ($) {
	$.fn.timeline = function (type, data_, options_) {
		// data_ should be formatted as {"video":{"duration":"hh:mm:ss"},"data":{"series_1_name": [{"start_time": "hh:mm:ss", "duration": "hh:mm:ss"}]}}

		//console.warn("Type:" + type + ",Data:" + data_ + ",Options:" + options_) // DEBUGGING INPUT

		if (this[0].tagName === "CANVAS") {
			ctx = this[0].getContext("2d");
			// Parses input options (see function below)
			parseOptions(options, true);
			// Height and width of target if set. Else, 500px X 100px is default. Can also be set in options.


			if (Object.keys(data.data).length > 0 && Object.keys(data.video).length > 0) {
				// Vertical Scaling


				// Generate Colors
				var colorschema = options.colorschema || {};
				fillGenerator(Object.keys(data.data).length,colorschema);

				var scale_ratio = scaler(data.video,type);
				if (type === "line") {
					vector(100, 0, 100, c_height, {});
					text("t->",102,c_height-12,8,'black',{})
					text(data.video.duration, c_width - 6 * data.video.duration.length + 2 * Math.floor(data.video.duration.length / 4), c_height - 12, 8, 'black', {})
					vector(100, c_height - 12, c_width, c_height - 12, {});
					line_display(data, options, scale_ratio);
				} else if (type === "frequency") {
					frequency_display(data, options, scale_ratio);
				} else {
					console.error('CoVisual Plot Type not recognized. See Documentation for Details');
				}
			} else {
				console.error('No Data. See Documentation for JSON formatting');
			}

		

		function line_display(line_data_,line_options_,scale_data_) {
			var i=1;
			$.each(data.data, function (series_name,series_data) {
				label(series_name,i,label_options);
				$.each(series_data, function (item) {
					interval = series_data[item]
					time = interval["start_time"].split(":");
					if (time.length == 3) {
						start_time = parseInt(time[0],10)*3600 + parseInt(time[1],10)*60 + parseInt(time[2],10);
					} else if (time.length === 2) {
						start_time = parseInt(time[0],10)*60 + parseInt(time[1],10);
					} else 	if (time.length === 1) {
						start_time = time[0];
					} else {
						console.error("Covisuals.js: Invalid Time Format for Video Duration.");
						throw "1";
					}
					time = interval.duration.split(":");
					if (time.length == 3) {
						duration = parseInt(time[0],10)*3600 + parseInt(time[1],10)*60 + parseInt(time[2],10);
					} else if (time.length == 2) {
						duration = parseInt(time[0],10)*60 + parseInt(time[1],10);
					} else if (time.length == 1) {
						duration = time[0];
					} else {
						console.error("Covisuals.js: Invalid Time Format for Video Duration.");
						throw "1";
					}
					start = Math.ceil(start_time/scale_data_) + 100;
					length = Math.ceil(duration/scale_data_);
					line(start,length,i,line_options_);
				});
				i++;
			});
		}

		function frequency_display(freq_data,freq_options,scale_data_) {
			var i=1;
			var max = 0;
			var fdata = {};
			var duration = 0;
			time = data.video.duration.split(":");
			if (time.length == 3) {
				duration = parseInt(time[0],10)*3600 + parseInt(time[1],10)*60 + parseInt(time[2],10);
			} else if (time.length == 2) {
				duration = parseInt(time[0],10)*60 + parseInt(time[1],10);
			} else if (time.length == 1) {
				duration = time[0];
			} else {
				console.error("Covisuals.js: Invalid Time Format for Video Duration.");
				throw "1";
			}
			$.each(data.data, function (series_name,series_data) {
				label(series_name,i,label_options);
				fdata[i.toString()] = {};
				sdata = fdata[i.toString()];
				for (var second = 1; second <= duration; second++) {
					sdata[second.toString()] = 0;
				}
				$.each(series_data, function (item) {
					interval = series_data[item]
					time = interval["start_time"].split(":");
					if (time.length == 3) {
						start_time = parseInt(time[0],10)*3600 + parseInt(time[1],10)*60 + parseInt(time[2],10);
					} else if (time.length === 2) {
						start_time = parseInt(time[0],10)*60 + parseInt(time[1],10);
					} else 	if (time.length === 1) {
						start_time = time[0];
					} else {
						console.error("Covisuals.js: Invalid Time Format for Video Duration.");
						throw "1";
					}
					time = interval.duration.split(":");
					if (time.length == 3) {
						length = parseInt(time[0],10)*3600 + parseInt(time[1],10)*60 + parseInt(time[2],10);
					} else if (time.length == 2) {
						length = parseInt(time[0],10)*60 + parseInt(time[1],10);
					} else if (time.length == 1) {
						length = time[0];
					} else {
						console.error("Covisuals.js: Invalid Time Format for Video Duration.");
						throw "1";
					}
					for (var instance = start_time; instance <= start_time + length; instance++ ) {
						sdata[instance.toString()] += 1;
						if (sdata[instance.toString()] > max) {
							max = sdata[instance.toString()];
						}
					}
				});
				i++;
			});
			var v_scale = c_height * 0.9 / max;
			var t_options = {};
			for (var snumber in fdata) {
				for (var graph = 1; graph <= duration; graph++) {
					if (fdata[snumber][graph.toString()] > 0) {
						point(Math.ceil(graph / scale_data_), c_height - fdata[snumber][graph.toString()] * v_scale, parseInt(snumber, 10), {});
					}
					if (graph > 1 && (fdata[snumber][graph.toString()] > 0 || fdata[snumber][(graph - 1).toString()] > 0)) {
						if (snumber < color_list.length) {
							t_options["fillStyle"] = color_list[snumber - 1];
						} else {
							t_options["fillStyle"] = color_list[(snumber % color_list.length + color_list.length - 1) % color_list.length]
						}
						triangle((graph - 1) / scale_data_, c_height - fdata[snumber][(graph - 1).toString()] * v_scale, graph / scale_data_, c_height - fdata[snumber][graph.toString()] * v_scale, t_options);
					}
				}
			}
			for (var tick = 1; tick <= max; tick++) {
				text(tick.toString(), c_width - 8, c_height - tick * v_scale - 6, 8, 'black', {})
			}
		}

	};
})(jQuery);
*/