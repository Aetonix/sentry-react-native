/**
 * @deprecated Use `Integration` from `@sentry/types` and `startIdleTransaction` from `@sentry/core` instead.
 *
 * Or use `startIdleNavigationSpan` from `@sentry/react-native@^6`.
 */
export class RoutingInstrumentation {
    constructor() {
        this.name = RoutingInstrumentation.instrumentationName;
    }
    /** @inheritdoc */
    registerRoutingInstrumentation(listener, beforeNavigate, onConfirmRoute) {
        this._tracingListener = listener;
        this._beforeNavigate = beforeNavigate;
        this._onConfirmRoute = onConfirmRoute;
    }
    /** @inheritdoc */
    onRouteWillChange(context) {
        var _a, _b;
        const transaction = (_a = this._tracingListener) === null || _a === void 0 ? void 0 : _a.call(this, context);
        if (transaction) {
            (_b = this._onConfirmRoute) === null || _b === void 0 ? void 0 : _b.call(this, context);
        }
        return transaction;
    }
}
RoutingInstrumentation.instrumentationName = 'base-routing-instrumentation';
/**
 * Internal base routing instrumentation where `_onConfirmRoute` is not called in onRouteWillChange
 */
export class InternalRoutingInstrumentation extends RoutingInstrumentation {
    /** @inheritdoc */
    onRouteWillChange(context) {
        var _a;
        return (_a = this._tracingListener) === null || _a === void 0 ? void 0 : _a.call(this, context);
    }
}
//# sourceMappingURL=routingInstrumentation.js.map