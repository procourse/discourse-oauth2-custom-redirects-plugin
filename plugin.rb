# name: oauth2-custom-redirects
# version: 0.1
# author: Muhlis Budi Cahyono
# url: https://github.com/procourse/discourse-oauth2-custom-redirects-plugin

enabled_site_setting :oauth2_custom_redirects_enabled

after_initialize {

  OmniAuth::Strategies::Oauth2Basic.class_eval {
    def setup_phase
      super

      if SiteSetting.oauth2_custom_redirects_enabled && request.params["button"] == "createAccount"
        env["omniauth.strategy"].options[:client_options][:authorize_url] = SiteSetting.oauth2_signup_url
      end

    end
  }

}
