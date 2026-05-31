/**
 * socialAuth.js - Social SDK wrappers for Google and Facebook Sign-In
 * ====================================================================
 * 
 * Provides easy interfaces for triggering native Google & Facebook implicit grant flows.
 */

import toast from "react-hot-toast";

// Load Client IDs from environment variables with safe fallbacks
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || "";
const isRTL = document.documentElement.dir === "rtl";

/**
 * Trigger the Google Sign-In Identity Services popup and request an access token.
 * 
 * @param {Function} onSuccess - Callback received with the access token string
 * @param {Function} onError - Callback received with the Error object
 */
export const loginWithGoogle = (onSuccess, onError) => {
  if (!window.google) {
    const err = new Error("Google Sign-In SDK is still loading. Please try again in a moment.");
    toast.error("جاري تحميل نظام تسجيل دخول جوجل... يرجى المحاولة بعد قليل.");
    console.error(err);
    if (onError) onError(err);
    return;
  }


  try {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid profile email",
      callback: (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          onSuccess(tokenResponse.access_token);
        } else if (tokenResponse && tokenResponse.error) {
          onError(new Error(`Google Authentication Error: ${tokenResponse.error_description || tokenResponse.error}`));
        } else {
          onError(new Error("Google Authentication was canceled or did not return an access token."));
        }
      },
      error_callback: (err) => {
        onError(new Error(err?.message || "Google client initialization or request failed."));
      }
    });

    client.requestAccessToken();
  } catch (error) {
    console.error("Error launching Google Auth token client:", error);
    onError(error);
  }
};

/**
 * Initialize the Facebook Javascript SDK.
 * Should be called once upon application startup.
 */
export const initFacebookSdk = () => {
  if (!FACEBOOK_APP_ID) {
    console.warn("VITE_FACEBOOK_APP_ID environment variable is missing. Facebook login will not function.");
    return;
  }

  // Setup the async init hook
  window.fbAsyncInit = function() {
    try {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0"
      });
    } catch (e) {
      console.error("Facebook SDK init error inside fbAsyncInit:", e);
    }
  };

  // In case the Facebook SDK is already loaded before this init script runs
  if (window.FB) {
    try {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0"
      });
    } catch (e) {
      console.error("Direct Facebook SDK initialization failed:", e);
    }
  }
};

/**
 * Trigger the Facebook login dialog and request user profile permissions.
 * 
 * @param {Function} onSuccess - Callback received with the access token string
 * @param {Function} onError - Callback received with the Error object
 */
export const loginWithFacebook = (onSuccess, onError) => {
  if (!window.FB) {
    const err = new Error("Facebook SDK is still loading. Please try again in a moment.");
    toast.error("جاري تحميل نظام تسجيل دخول فيسبوك... يرجى المحاولة بعد قليل.");
    console.error(err);
    if (onError) onError(err);
    return;
  }


  try {
    window.FB.login(
      (response) => {
        if (response.authResponse && response.authResponse.accessToken) {
          onSuccess(response.authResponse.accessToken);
        } else {
          onError(new Error("Facebook Authentication was canceled or the application was not authorized."));
        }
      },
      { scope: "public_profile,email" }
    );
  } catch (error) {
    console.error("Error launching Facebook login window:", error);
    onError(error);
  }
};
