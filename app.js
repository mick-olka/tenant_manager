define(function(require) {
	var $ = require('jquery'),
		_ = require('lodash'),
		monster = require('monster');

	var app = {
		name: 'accounts',
		// subModules: appSubmodules,
		css: [ 'app' ],
		i18n: {
			'en-US': { customCss: false }
		},
		//	define external APIs consumed by app
		requests: {},
		//	map of events app can expose to the framework and apps
		subscribe: {
			'accountsManager.activate': '_render'
			// 'app.event': 'eventName'
		},
		load: function(callback) {
			var self = this;
			self.initApp(function() {
				callback && callback(self);
			});
		},
		initApp: function(callback) {
			var self = this;

			//	publish event from monster to init app
			monster.pub('auth.initApp', {
				app: self,
				callback: callback
			});
		},

		render: function() {
			var self = this;
			monster.ui.generateAppLayout(self, {
				menus: [
					{
						tabs: [
							{
								text: 'Tenants',
								callback: self.tenantsPageRender
							}
						]
					},
					{
						tabs: [
							{
								text: 'Resources',
								callback: self.resourcesPageRender
							}
						]
					}
				]
			});
		},

		rerenderManager: function(args) {
			var self = args.self,
				accountsManager = $(self.getTemplate({
					name: 'accountsManager'
				})),
				parent = args.container || $('#monster_content'),
				child = args.child || $(self.getTemplate({
					name: 'accountsManagerLanding'
				}));

			accountsManager.find('.main-content')
				.append(child);

			parent.empty()
				.append(accountsManager);
		},

		// subscription handlers
		resourcesPageRender: function(pArgs) {
			var self = this,
				accountsManagerLanding = $(self.getTemplate({
					name: 'accountsManagerLanding'
				}));

			self.rerenderManager({
				child: accountsManagerLanding,
				self: self,
				...pArgs
			});
		},

		tenantsPageRender: function(pArgs) {
			var self = this,
				$tenantsPage = $(self.getTemplate({
					name: 'tenantsPage',
					data: {
						user: monster.apps.auth.currentUser
					}
				}));

			self.rerenderManager({
				child: $tenantsPage,
				self: self,
				...pArgs
			});

			$tenantsPage.find('#edit_tenant').on('click', function(e) {
				self.tenantEditPageRender(pArgs);
			});
		},

		tenantEditPageRender: function(args) {
			var self = this,
				$tenantEditPage = $(self.getTemplate({
					name: 'tenantEditPage'
				}));
			self.rerenderManager({
				child: $tenantEditPage,
				self: self,
				...args
			});
			$tenantEditPage.find('#save_tenant').on('click', function(ev) {
				ev.preventDefault();
				var formData = monster.ui.getFormData('tenant_edit_form');
				console.log('form_data:', formData);
			});
		}
	};

	return app;
});
