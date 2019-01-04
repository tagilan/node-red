var config = require("config").get("node-red");

module.exports = {
	uiPort: config.ui.port,

	uiHost: config.ui.host,

	mqttReconnectTime: 15000,

	serialReconnectTime: 15000,

	debugMaxLength: 1000,

	debugUseColors: true,

	flowFile: config.flowFilename,

	userDir: config.userDir,

	adminAuth: {
		type: "credentials",
		users: [{
			username: "admin",
			password: "$2a$08$94ofUwG8ZrOfDDNernXipeCSxcx66A4l2RGlBGCFAriCJPEr6T2sK",
			permissions: "*"
		},{
			username: "guest",
			password: "$2a$08$YPtQjfyxx7K2b8.aTPYBJuK.Nruck.R1KqBMH3rwRE267Zd57/LOC",
			permissions: "read"
		}]
	},
	httpNodeCors: {
		origin: "*",
		methods: "GET,PUT,POST,DELETE"
	},
	functionGlobalContext: {
		os: require("os")
	},
	contextStorage: {
		default: {
			module: "localfilesystem"
		}
	},
	paletteCategories: config.paletteCategoriesOrder,
	logging: {
		console: {
			level: "info",
			metrics: false,
			audit: false
		}
	},
	editorTheme: {
		projects: {
			enabled: false
		}
	}
};