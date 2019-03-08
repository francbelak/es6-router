"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("custom-event-polyfill");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var log = function log(message) {
  console.log("%c[Router]%c ".concat(message), 'color: rgb(255, 105, 100);', 'color: inherit');
};
/**
 * Client side router with hash history
 */


var Router =
/*#__PURE__*/
function () {
  /**
   * Create a new instance of a client side router
   * @param {Object} options Router options
   * @param {boolean} [options.debug=false] - Enable debugging console messages
   * @param {Object} [options.context=window] - Context to listen for changes on
   * @param {boolean} [options.startListening=true] - Initiate listen on construct
   */
  function Router(options) {
    _classCallCheck(this, Router);

    this.options = Object.assign({
      debug: false,
      context: window,
      startListening: true
    }, options);
    this.isListening = false;
    this.routes = [];
    this.onHashChange = this.check.bind(this);

    if (this.options.startListening) {
      this.listen();
    }
  }
  /**
   * Add a new route
   * @param {string|RegExp|function} route - Name of route to match or global function
   * @param {function=} handler - Method to execute when route matches
   * @returns {Router} - This router instance
   */


  _createClass(Router, [{
    key: "add",
    value: function add(route, handler) {
      var newRoute = typeof route === 'string' ? Router.cleanPath(route) : route;

      if (typeof route === 'function') {
        handler = route;
        newRoute = '';
      }

      newRoute = new RegExp(newRoute);
      this.routes.push({
        route: newRoute,
        handler: handler
      });
      return this;
    }
    /**
     * Remove a route from the router
     * @param {string|RegExp} route - Name of route to remove
     * @param {function} [handler] - Function handler to remove
     * @returns {Router} - This router instance
     */

  }, {
    key: "remove",
    value: function remove(route, handler) {
      var routeName = String(new RegExp(route));
      this.routes = this.routes.filter(function (activeRoute) {
        return String(new RegExp(activeRoute.route)) !== routeName || (handler ? activeRoute.handler !== handler : false);
      });
      return this;
    }
    /**
     * Reload the current route
     * @returns {Router} - This router instance
     */

  }, {
    key: "reload",
    value: function reload() {
      return this.check();
    }
    /**
     * Recheck the path and reload the page
     * @private
     * @returns {Router} - This router instance
     */

  }, {
    key: "check",
    value: function check() {
      var hash = this.currentRoute;
      var hasMatch = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var route = _step.value;
          var match = hash.match(route.route);

          if (match !== null) {
            match.shift();
            route.handler.apply({}, match);
            hasMatch = true;

            if (this.options.debug) {
              log("Fetching: /".concat(hash));
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!hasMatch) {
        this.navigateError(hash);
      }

      return this;
    }
    /**
     * Start listening for hash changes on the context
     * @param {any} [instance=Window] - Context to start listening on
     * @returns {Router} - This router instance
     */

  }, {
    key: "listen",
    value: function listen(instance) {
      this.check();

      if (!this.isListening || instance) {
        (instance || this.options.context).addEventListener('hashchange', this.onHashChange);
        this.isListening = true;
      }

      return this;
    }
    /**
     * Stop listening for hash changes on the context
     * @param {any} [instance=Window] - Context to stop listening on
     * @returns {Router} - This router instance
     */

  }, {
    key: "stopListen",
    value: function stopListen(instance) {
      if (this.isListening || instance) {
        (instance || this.options.context).removeEventListener('hashchange', this.onHashChange);
        this.isListening = false;
      }

      return this;
    }
    /**
     * Navigate router to path
     * @param {string} path - Path to navigate the router to
     * @returns {Router} - This router instance
     */

  }, {
    key: "navigate",
    value: function navigate(path) {
      if (this.options.debug) {
        log("Redirecting to: /".concat(Router.cleanPath(path || '')));
      }

      this.options.context.history.pushState(null, null, '#/' + Router.cleanPath(path || ''));

      if (path !== 'error') {
        window.dispatchEvent(new CustomEvent('hashchange'));
      }

      return this;
    }
    /**
     * Navigate to the error page
     * @param {string} hash
     * @returns {Router} - This router instance
     */

  }, {
    key: "navigateError",
    value: function navigateError(hash) {
      if (this.options.debug) {
        log("Fetching: /".concat(hash, ", not a valid route."));
      }

      this.navigate('error');
      return this;
    }
    /**
     * Name of the current route
     * @returns {string} - Current route
     */

  }, {
    key: "currentRoute",
    get: function get() {
      return Router.cleanPath(this.options.context.location.hash);
    }
    /**
     * Strip the path of slashes and hashes
     * @param {string} path - Path to clean of hashes
     * @returns {string} - Cleaned path
     */

  }], [{
    key: "cleanPath",
    value: function cleanPath(path) {
      if (!path) {
        return '';
      }

      return String(path).replace(/^[#\/]+|\/+$|\?.*$/g, '');
    }
    /**
     * Parse a route URL to get all parts
     * @param {string} path - Route to split into parts
     * @returns {string[]} - Parts of the URL
     */

  }, {
    key: "parseRoute",
    value: function parseRoute(path) {
      return Router.cleanPath(path).split('/');
    }
  }]);

  return Router;
}();

exports.default = Router;