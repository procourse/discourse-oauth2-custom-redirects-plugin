import ApplicationRoute from "discourse/routes/application";
import LoginController from "discourse/controllers/login";

function isPluginEnabled(setting) {
  return setting.oauth2_enabled && setting.oauth2_custom_redirects_enabled;
}

export default {
  name: "extend-for-oauth2-custom-redirects",
  initialize() {
    ApplicationRoute.reopen({
      _autoLogin(modal) {
        if (isPluginEnabled(this.siteSettings)) $.cookie("auth_button", modal);
        this._super(...arguments);
      }
    });

    LoginController.reopen({
      actions: {
        externalLogin(loginMethod) {
          const name = loginMethod.get("name");

          if (isPluginEnabled(this.siteSettings) && name == "oauth2_basic") {
            const el = document.createElement("a");
            el.href = loginMethod.get("customUrl") || Discourse.getURL("/auth/" + name);

            const authUrl = `${el.protocol}//${el.host}${el.pathname}?button=${ encodeURIComponent( $.cookie("auth_button") ) }`;
            loginMethod.set("customUrl", authUrl);
          }

          this._super(loginMethod);
        }
      }
    });
  }
};
