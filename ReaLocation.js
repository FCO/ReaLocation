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

function Port(port) {
	console.log("port: " + port);
	if(/^\d+$/.test(port)) {
		this.number = port;
	} else {
		this.number = Port.service2port[port];
	}
}

Port.port2service = {
1:	"tcpmux",		5:	"rje",			7:	"echo",			9:	"discard",
11:	"systat",		13:	"daytime",		17:	"qotd",			18:	"msp",
19:	"chargen",		20:	"ftp-data",		21:	"ftp",			22:	"ssh",
23:	"telnet",		25:	"smtp",			37:	"time",			39:	"rlp",
42:	"nameserver",		43:	"nicname",		49:	"tacacs",		50:	"re-mail-ck",
53:	"domain",		63:	"whois++",		67:	"bootps",		68:	"bootpc",
69:	"tftp",			70:	"gopher",		71:	"netrjs-1",		72:	"netrjs-2",
73:	"netrjs-3",		73:	"netrjs-4",		79:	"finger",		80:	"http",
88:	"kerberos",		95:	"supdup",		101:	"hostname",		102:	"iso-tsap",
105:	"csnet-ns",		107:	"rtelnet",		109:	"pop2",			110:	"pop3",
111:	"sunrpc",		113:	"auth",			115:	"sftp",			117:	"uucp-path",
119:	"nntp",			123:	"ntp",			137:	"netbios-ns",		138:	"netbios-dgm",
139:	"netbios-ssn",		143:	"imap",			161:	"snmp",			162:	"snmptrap",
163:	"cmip-man",		164:	"cmip-agen",		174:	"mailq",		177:	"xdmcp",
178:	"nextstep",		179:	"bgp",			191:	"prospero",		194:	"irc",
199:	"smux",			201:	"at-rtmp",		202:	"at-nbp",		204:	"at-echo",
206:	"at-zis",		209:	"qmtp",			210:	"z39.50",		213:	"ipx",
220:	"imap3",		245:	"link",			347:	"fatserv",		363:	"rsvp_tunnel",
369:	"rpc2portmap",		370:	"codaauth2",		372:	"ulistproc",		389:	"ldap",
427:	"svrloc",		434:	"mobileip-agent",	435:	"mobilip-mn",		443:	"https",
444:	"snpp",			445:	"microsoft-ds",		464:	"kpasswd",		468:	"photuris",
487:	"saft",			488:	"gss-http",		496:	"pim-rp-disc",		500:	"isakmp",
535:	"iiop",			538:	"gdomap",		546:	"dhcpv6-client",	547:	"dhcpv6-server",
554:	"rtsp",			563:	"nntps",		565:	"whoami",		587:	"submission",
610:	"npmp-local",		611:	"npmp-gui",		612:	"hmmp-ind",		631:	"ipp",
636:	"ldaps",		674:	"acap",			694:	"ha-cluster",		749:	"kerberos-adm",
750:	"kerberos-iv",		765:	"webster",		767:	"phonebook",		873:	"rsync",
992:	"telnets",		993:	"imaps",		994:	"ircs",			995:	"pop3s",
};

Port.service2port = {};

for(var num in Port.port2service) {
	if(Port.port2service[num] != null) {
		Port.service2port[Port.port2service[num]] = num;
	}
}

Port.prototype = {
	get service() {
		return Port.port2service[this.number];
	},
	set service(data) {
		this.number = Port.service2port[data];
	},
	toString:	function() {
		return this.number + "";
	}
};

function ReaLocation(url) {
	var data = this._parse((url || location).toString());
	console.log(JSON.stringify(data));
	for(var key in data) {
		if(data.hasOwnProperty(key)) {
			if(data[key] == null) continue;
			this[key] = data[key];
		}
	}
}

ReaLocation.defaults = {
	proto:		"http",
	user:		"",
	password:	"",
	host:		new Domain(""),
	port:		new Port(80),
	path:		new Path("/"),
	queryString:	new QS(""),
	hash:		"",
};

for(var key in ReaLocation.defaults) {
	if(ReaLocation.defaults[key] instanceof Object) {
		ReaLocation.defaults[key].is_default = true;
	}
}

ReaLocation.prototype = {
	toString:		function() {
		var str = this._proto_part
			+ this._auth_part
			+ this._host_part
			+ this._port_part
			+ this._path_part
			+ this._querstring_part
			+ this._hash_part
		;
		return str;
	},
	get _proto_part() {
		return this.proto + "://";
	},
	get _auth_part() {
		if(!this._has("user") || !this._has("host")) return "";
		return this.user + (this._has("password") ? ":" + this.password : "") + "@";
	},
	get _host_part() {
		if(!this._has("host")) return "";
		return this.host;
	},
	get _port_part() {
		if(!this._has("port")) return "";
		return ":" + this.port;
	},
	get _path_part() {
		return this.path;
	},
	get _querstring_part() {
		if(!this._has("queryString")) return "";
		return "?" + this.queryString;
	},
	get _hash_part() {
		if(!this._has("hash")) return "";
		return "#" + this.hash;
	},
	go:			function() {
		window.location = this.toString();
	},
	_has:			function(name) {
		var key = "_" + name;
		return this[key] != null && this[key] != "" && this[key].toString() !== (ReaLocation.defaults[key]||"").toString();
	},
	_parse:		function(url) {
		var data = url.match(RegExp("^(\\w+)://(?:([^@:]+)(?::([^@]+))?@)?((?:[\\w]+)(?:\\.(?:[\\w]+))+)?(?::(\\d+))?(?:([^?]+))?(?:\\?([^#]+))?(?:#(.+))?$", "i"));
		console.log(JSON.stringify(data));
		return {
			proto:		data[1],
			user:		data[2],
			password:	data[3],
			host:		new Domain(data[4]),
			port:		new Port(data[5] || ReaLocation.defaults.port),
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
