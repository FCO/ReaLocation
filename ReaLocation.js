function QS(obj) {
	if(obj == null || obj == "") {
		return;
	} else if(obj instanceof Object) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key)) {
				this[key] = obj[key];
			}
		}
		return;
	} else {
		var arr = obj.split("&");
		for(var i = 0; i < arr.length; i++) {
			var data = arr[i].split("=");
			var new_name;
			if(new_name = data[0].replace(/\[\d*\]/, "")) {
				if(this[new_name] == null) this[new_name] = [];
				this[new_name].push(data[1]);
			} else {
				this[data[0]] = data[1] || "";
			}
		}
		return;
	}
}

QS.prototype = {
	reset:	function() {
		for(var key in this) {
			if(this.hasOwnProperty(key)) {
				this[key] = undefined;
			}
		}
	},
	toString:	function() {
		var arr = [];
		for(var key in this) {
			if(this.hasOwnProperty(key)) {
				if(this[key] instanceof Array) {
					for(var i = 0; i < this[key].length; i++) {
						arr.push(key + "[" + i + "]=" + this[key][i]);
					}
				} else {
					arr.push(key + "=" + this[key]);
				}
			}
		}
		return arr.join("&");
	},
};

function Domain(domain) {
	var arr = domain.split(".");
	var tmp = [];
	this.levels = [];
	this.parts = [];
	for(var i = arr.length - 1; i >= 0; i--) {
		tmp.unshift(arr[i]);
		this.parts.unshift(arr[i]);
		this.levels.push(tmp.join("."));
	}
	this.hostname = this.levels[this.levels.length - 1];
}

Domain.prototype = {
	toString:	function() {
		return this.hostname;
	},
};

function ReaLocation(url) {
	var data = this._parse((url || location).toString());
	console.log(JSON.stringify(data));
	for(var key in data) {
		if(data.hasOwnProperty(key)) {
			this[key] = data[key];
		}
	}
}

function Path(path) {
	this.dirs = [];
	if(path.substr(0, 1) == "/") {
		this.is_absolute = true;
		//this.dirs.push(null);
	}
	var arr = path.split("/");
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] != null) {
			this.dirs.push(arr[i]);
		}
	}
}

Path.prototype = {
	is_absolute:	false,
	get is_relative() {
		return !this.is_absolute;
	},
	toString:	function() {
		return this.dirs.join("/");
	}
};

ReaLocation.defaults = {
	proto:		"http",
	user:		"",
	password:	"",
	host:		new Domain(""),
	port:		80,
	path:		new Path("/"),
	queryString:	new QS(""),
	hash:		"",
};

ReaLocation.prototype = {
	toString:	function() {
		var has_user = this._has("user");
		var str = this.proto + "://"
			+ (has_user && this._has("host")? this.user + (this._has("password") ? ":" + this.password : "") + "@" : "")
			+ (this._has("host") ? this.host : "")
			+ (this._has("port") ? ":" + this.port : "")
			+ this.path
			+ (this._has("queryString") ? "?" + this.queryString : "")
			+ (this._has("hash") ? "#" + this.hash : "");
		return str;
	},
	go:		function() {
		window.location = this.toString();
	},
	_has:		function(name) {
		var key = "_" + name;
		return this[key] != null && this[key] != "";
	},
	_parse:		function(url) {
		var data = url.match(RegExp("^(\\w+)://(?:([^@:]+)(?::([^@]+))?@)?((?:[\\w]+)(?:\\.(?:[\\w]+))+)?(?::(\\d+))?(?:([^?]+))?(?:\\?([^#]+))?(?:#(.+))?$", "i"));
		return {
			proto:		data[1],
			user:		data[2],
			password:	data[3],
			host:		new Domain(data[4]),
			port:		data[5],
			path:		data[6],
			queryString:	new QS(data[7]),
			hash:		data[8],
		};
	},
	get proto()		{return this._has("proto"	)	? this._proto		: ReaLocation.defaults.proto		},
	get user()		{return this._has("user"	)	? this._user		: ReaLocation.defaults.user		},
	get password()		{return this._has("password"	)	? this._password	: ReaLocation.defaults.password		},
	get host()		{return this._has("host"	)	? this._host		: ReaLocation.defaults.host		},
	get port()		{return this._has("port"	)	? this._port		: ReaLocation.defaults.port		},
	get path()		{return this._has("path"	)	? this._path		: ReaLocation.defaults.path		},
	get queryString()	{return this._has("queryString"	)	? this._queryString	: ReaLocation.defaults.queryString	},
	get hash()		{return this._has("hash"	)	? this._hash		: ReaLocation.defaults.hash		},

	set proto(data)		{this._proto		= data},
	set user(data)		{this._user		= data},
	set password(data)	{this._password		= data},
	set host(data)		{this._host		= data},
	set port(data)		{this._port		= data},
	set path(data)		{this._path		= data},
	set queryString(data)	{this._queryString	= data},
	set hash(data)		{this._hash		= data},
};
