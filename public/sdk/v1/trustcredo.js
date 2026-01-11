/**
 * TrustCredo Verification SDK v1.0.0
 *
 * Embed identity verification into your website with just a few lines of code.
 *
 * Usage:
 *   TrustCredo.init({ apiKey: 'your_api_key' });
 *   TrustCredo.startVerification({ userEmail: 'user@example.com' });
 *
 * Documentation: https://docs.trustcredo.com/sdk
 */
(function(window, document) {
  'use strict';

  var SDK_VERSION = '1.0.0';
  var BASE_URL = 'https://verify.trustcredo.com';
  var IFRAME_ID = 'trustcredo-verification-iframe';
  var OVERLAY_ID = 'trustcredo-overlay';

  // Default configuration
  var defaultConfig = {
    apiKey: null,
    theme: 'light',
    language: 'en',
    showBranding: true,
    allowedDocumentTypes: null,
    onReady: function() {},
    onSuccess: function() {},
    onFailure: function() {},
    onError: function() {},
    onClose: function() {},
    onStepChange: function() {}
  };

  var TrustCredo = {
    _config: null,
    _iframe: null,
    _overlay: null,
    _isInitialized: false,
    _verificationInProgress: false,

    /**
     * Initialize the SDK with your API key and configuration
     * @param {Object} options - Configuration options
     * @param {string} options.apiKey - Your TrustCredo API key (required)
     * @param {string} options.theme - 'light' or 'dark' (default: 'light')
     * @param {string} options.language - Language code (default: 'en')
     * @param {boolean} options.showBranding - Show TrustCredo branding (default: true)
     * @param {string[]} options.allowedDocumentTypes - Allowed document types
     * @param {Function} options.onReady - Called when verification is ready
     * @param {Function} options.onSuccess - Called on successful verification
     * @param {Function} options.onFailure - Called when verification fails
     * @param {Function} options.onError - Called on errors
     * @param {Function} options.onClose - Called when user closes the modal
     * @param {Function} options.onStepChange - Called when step changes
     */
    init: function(options) {
      if (!options || !options.apiKey) {
        console.error('[TrustCredo] API key is required. Call TrustCredo.init({ apiKey: "your_api_key" })');
        return false;
      }

      this._config = this._extend({}, defaultConfig, options);
      this._isInitialized = true;

      // Add message listener
      this._addMessageListener();

      // Inject styles
      this._injectStyles();

      console.log('[TrustCredo] SDK initialized (v' + SDK_VERSION + ')');
      return true;
    },

    /**
     * Start the verification process
     * @param {Object} userData - Optional user data to pre-fill
     * @param {string} userData.userId - Your internal user ID
     * @param {string} userData.userEmail - User's email address
     * @param {string} userData.userName - User's full name
     */
    startVerification: function(userData) {
      if (!this._isInitialized) {
        console.error('[TrustCredo] SDK not initialized. Call TrustCredo.init() first.');
        return false;
      }

      if (this._verificationInProgress) {
        console.warn('[TrustCredo] Verification already in progress.');
        return false;
      }

      userData = userData || {};
      this._verificationInProgress = true;

      // Build iframe URL
      var params = new URLSearchParams();
      params.append('apiKey', this._config.apiKey);
      params.append('embed', 'true');
      params.append('theme', this._config.theme);
      params.append('showBranding', this._config.showBranding);

      if (userData.userId) params.append('userId', userData.userId);
      if (userData.userEmail) params.append('userEmail', userData.userEmail);
      if (userData.userName) params.append('userName', userData.userName);
      if (this._config.allowedDocumentTypes) {
        params.append('documentTypes', this._config.allowedDocumentTypes.join(','));
      }

      var iframeUrl = BASE_URL + '/embed?' + params.toString();

      // Create and show modal
      this._createModal(iframeUrl);

      return true;
    },

    /**
     * Close the verification modal
     */
    close: function() {
      this._destroyModal();
      this._verificationInProgress = false;
    },

    /**
     * Check if SDK is initialized
     */
    isInitialized: function() {
      return this._isInitialized;
    },

    /**
     * Get SDK version
     */
    getVersion: function() {
      return SDK_VERSION;
    },

    // Private methods
    _extend: function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (source.hasOwnProperty(key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    },

    _addMessageListener: function() {
      var self = this;
      window.addEventListener('message', function(event) {
        // In production, verify origin
        // if (event.origin !== BASE_URL) return;

        var data = event.data;
        if (!data || data.type !== 'TRUSTCREDO_EVENT') return;

        switch (data.event) {
          case 'ready':
            self._config.onReady(data.data);
            break;

          case 'verification_success':
            self._config.onSuccess(data.data);
            // Auto-close after success (configurable)
            setTimeout(function() {
              self.close();
            }, 2000);
            break;

          case 'verification_failed':
            self._config.onFailure(data.data);
            break;

          case 'error':
            self._config.onError(data.data);
            break;

          case 'close':
            self._config.onClose();
            self.close();
            break;

          case 'step_change':
            self._config.onStepChange(data.data);
            break;

          case 'retry':
            // User clicked retry
            break;
        }
      });
    },

    _injectStyles: function() {
      if (document.getElementById('trustcredo-sdk-styles')) return;

      var styles = document.createElement('style');
      styles.id = 'trustcredo-sdk-styles';
      styles.textContent = [
        '#' + OVERLAY_ID + ' {',
        '  position: fixed;',
        '  top: 0;',
        '  left: 0;',
        '  right: 0;',
        '  bottom: 0;',
        '  background: rgba(0, 0, 0, 0.6);',
        '  z-index: 2147483647;',
        '  display: flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  opacity: 0;',
        '  transition: opacity 0.3s ease;',
        '}',
        '#' + OVERLAY_ID + '.visible {',
        '  opacity: 1;',
        '}',
        '#' + OVERLAY_ID + ' .trustcredo-modal {',
        '  position: relative;',
        '  width: 100%;',
        '  max-width: 480px;',
        '  height: 90vh;',
        '  max-height: 750px;',
        '  background: white;',
        '  border-radius: 16px;',
        '  overflow: hidden;',
        '  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);',
        '  transform: scale(0.95);',
        '  transition: transform 0.3s ease;',
        '}',
        '#' + OVERLAY_ID + '.visible .trustcredo-modal {',
        '  transform: scale(1);',
        '}',
        '#' + OVERLAY_ID + ' .trustcredo-close-btn {',
        '  position: absolute;',
        '  top: -12px;',
        '  right: -12px;',
        '  width: 36px;',
        '  height: 36px;',
        '  background: white;',
        '  border: none;',
        '  border-radius: 50%;',
        '  font-size: 20px;',
        '  cursor: pointer;',
        '  display: flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);',
        '  z-index: 1;',
        '  color: #666;',
        '  transition: all 0.2s ease;',
        '}',
        '#' + OVERLAY_ID + ' .trustcredo-close-btn:hover {',
        '  background: #f3f4f6;',
        '  color: #333;',
        '}',
        '#' + IFRAME_ID + ' {',
        '  width: 100%;',
        '  height: 100%;',
        '  border: none;',
        '}',
        '@media (max-width: 520px) {',
        '  #' + OVERLAY_ID + ' .trustcredo-modal {',
        '    max-width: 100%;',
        '    height: 100%;',
        '    max-height: 100%;',
        '    border-radius: 0;',
        '  }',
        '  #' + OVERLAY_ID + ' .trustcredo-close-btn {',
        '    top: 8px;',
        '    right: 8px;',
        '  }',
        '}'
      ].join('\n');

      document.head.appendChild(styles);
    },

    _createModal: function(iframeUrl) {
      var self = this;

      // Create overlay
      this._overlay = document.createElement('div');
      this._overlay.id = OVERLAY_ID;

      // Create modal container
      var modal = document.createElement('div');
      modal.className = 'trustcredo-modal';

      // Create close button
      var closeBtn = document.createElement('button');
      closeBtn.className = 'trustcredo-close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Close verification');
      closeBtn.onclick = function() {
        self.close();
        self._config.onClose();
      };

      // Create iframe
      this._iframe = document.createElement('iframe');
      this._iframe.id = IFRAME_ID;
      this._iframe.src = iframeUrl;
      this._iframe.setAttribute('allow', 'camera; microphone');
      this._iframe.setAttribute('allowfullscreen', 'true');

      // Assemble modal
      modal.appendChild(closeBtn);
      modal.appendChild(this._iframe);
      this._overlay.appendChild(modal);

      // Add to DOM
      document.body.appendChild(this._overlay);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Trigger animation
      requestAnimationFrame(function() {
        self._overlay.classList.add('visible');
      });

      // Close on overlay click
      this._overlay.addEventListener('click', function(e) {
        if (e.target === self._overlay) {
          self.close();
          self._config.onClose();
        }
      });

      // Close on escape key
      this._escapeHandler = function(e) {
        if (e.key === 'Escape') {
          self.close();
          self._config.onClose();
        }
      };
      document.addEventListener('keydown', this._escapeHandler);
    },

    _destroyModal: function() {
      var self = this;

      if (this._overlay) {
        this._overlay.classList.remove('visible');

        setTimeout(function() {
          if (self._overlay && self._overlay.parentNode) {
            self._overlay.parentNode.removeChild(self._overlay);
          }
          self._overlay = null;
          self._iframe = null;
        }, 300);
      }

      // Restore body scroll
      document.body.style.overflow = '';

      // Remove escape handler
      if (this._escapeHandler) {
        document.removeEventListener('keydown', this._escapeHandler);
        this._escapeHandler = null;
      }

      this._verificationInProgress = false;
    }
  };

  // Expose to global scope
  window.TrustCredo = TrustCredo;

  // AMD support
  if (typeof define === 'function' && define.amd) {
    define(function() { return TrustCredo; });
  }

  // CommonJS support
  if (typeof module === 'object' && module.exports) {
    module.exports = TrustCredo;
  }

})(window, document);
