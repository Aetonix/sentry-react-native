import { __awaiter } from "tslib";
import { logger } from '@sentry/utils';
import { isHardCrash } from '../misc';
import { hasHooks } from '../utils/clientutils';
import { isExpoGo, notMobileOs } from '../utils/environment';
import { NATIVE } from '../wrapper';
import { enrichXhrBreadcrumbsForMobileReplay } from './xhrUtils';
export const MOBILE_REPLAY_INTEGRATION_NAME = 'MobileReplay';
const defaultOptions = {
    maskAllText: true,
    maskAllImages: true,
    maskAllVectors: true,
};
/**
 * The Mobile Replay Integration, let's you adjust the default mobile replay options.
 * To be passed to `Sentry.init` with `replaysOnErrorSampleRate` or `replaysSessionSampleRate`.
 *
 * ```javascript
 * Sentry.init({
 *  _experiments: {
 *    replaysOnErrorSampleRate: 1.0,
 *    replaysSessionSampleRate: 1.0,
 *  },
 *  integrations: [mobileReplayIntegration({
 *    // Adjust the default options
 *  })],
 * });
 * ```
 *
 * @experimental
 */
export const mobileReplayIntegration = (initOptions = defaultOptions) => {
    if (isExpoGo()) {
        logger.warn(`[Sentry] ${MOBILE_REPLAY_INTEGRATION_NAME} is not supported in Expo Go. Use EAS Build or \`expo prebuild\` to enable it.`);
    }
    if (notMobileOs()) {
        logger.warn(`[Sentry] ${MOBILE_REPLAY_INTEGRATION_NAME} is not supported on this platform.`);
    }
    if (isExpoGo() || notMobileOs()) {
        return mobileReplayIntegrationNoop();
    }
    const options = Object.assign(Object.assign({}, defaultOptions), initOptions);
    function processEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasException = event.exception && event.exception.values && event.exception.values.length > 0;
            if (!hasException) {
                // Event is not an error, will not capture replay
                return event;
            }
            const recordingReplayId = NATIVE.getCurrentReplayId();
            if (recordingReplayId) {
                logger.debug(`[Sentry] ${MOBILE_REPLAY_INTEGRATION_NAME} assign already recording replay ${recordingReplayId} for event ${event.event_id}.`);
                return event;
            }
            const replayId = yield NATIVE.captureReplay(isHardCrash(event));
            if (!replayId) {
                logger.debug(`[Sentry] ${MOBILE_REPLAY_INTEGRATION_NAME} not sampled for event ${event.event_id}.`);
                return event;
            }
            return event;
        });
    }
    function setup(client) {
        if (!hasHooks(client)) {
            return;
        }
        client.on('createDsc', (dsc) => {
            if (dsc.replay_id) {
                return;
            }
            // TODO: For better performance, we should emit replayId changes on native, and hold the replayId value in JS
            const currentReplayId = NATIVE.getCurrentReplayId();
            if (currentReplayId) {
                dsc.replay_id = currentReplayId;
            }
        });
        client.on('beforeAddBreadcrumb', enrichXhrBreadcrumbsForMobileReplay);
    }
    // TODO: When adding manual API, ensure overlap with the web replay so users can use the same API interchangeably
    // https://github.com/getsentry/sentry-javascript/blob/develop/packages/replay-internal/src/integration.ts#L45
    return {
        name: MOBILE_REPLAY_INTEGRATION_NAME,
        setupOnce() {
            /* Noop */
        },
        setup,
        processEvent,
        options: options,
    };
};
const mobileReplayIntegrationNoop = () => {
    return {
        name: MOBILE_REPLAY_INTEGRATION_NAME,
        setupOnce() {
            /* Noop */
        },
        options: defaultOptions,
    };
};
//# sourceMappingURL=mobilereplay.js.map