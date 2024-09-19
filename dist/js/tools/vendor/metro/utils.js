// Vendored / modified from @facebook/metro
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultMetroSerializer = exports.getSortedModules = void 0;
const baseJSBundle = require("metro/src/DeltaBundler/Serializers/baseJSBundle");
const sourceMapString = require("metro/src/DeltaBundler/Serializers/sourceMapString");
const bundleToString = require("metro/src/lib/bundleToString");
/**
 * This function ensures that modules in source maps are sorted in the same
 * order as in a plain JS bundle.
 *
 * https://github.com/facebook/metro/blob/9b85f83c9cc837d8cd897aa7723be7da5b296067/packages/metro/src/Server.js#L984
 */
const getSortedModules = (graph, { createModuleId, }) => {
    const modules = [...graph.dependencies.values()];
    // Sort by IDs
    return modules.sort((a, b) => createModuleId(a.path) - createModuleId(b.path));
};
exports.getSortedModules = getSortedModules;
/**
 * Creates the default Metro plain bundle serializer.
 * Because Metro exports only the intermediate serializer functions, we need to
 * assemble the final serializer ourselves. We have to work with the modules the same as Metro does
 * to avoid unexpected changes in the final bundle.
 *
 * This is used when the user does not provide a custom serializer.
 *
 * https://github.com/facebook/metro/blob/9b85f83c9cc837d8cd897aa7723be7da5b296067/packages/metro/src/Server.js#L244-L277
 */
const createDefaultMetroSerializer = () => {
    return (entryPoint, preModules, graph, options) => {
        // baseJSBundle assigns IDs to modules in a consistent order
        let bundle = baseJSBundle(entryPoint, preModules, graph, options);
        if (options.sentryBundleCallback && !graph.transformOptions.hot) {
            bundle = options.sentryBundleCallback(bundle);
        }
        const { code } = bundleToString(bundle);
        if (graph.transformOptions.hot) {
            // Hot means running in dev server, sourcemaps are generated on demand
            return code;
        }
        let sourceMapStringFunction;
        if (typeof sourceMapString === 'function') {
            sourceMapStringFunction = sourceMapString;
        }
        else if (typeof sourceMapString === 'object' &&
            sourceMapString != null &&
            'sourceMapString' in sourceMapString &&
            typeof sourceMapString['sourceMapString'] === 'function') {
            sourceMapStringFunction = sourceMapString.sourceMapString;
        }
        else {
            throw new Error(`
[@sentry/react-native/metro] Cannot find sourceMapString function in 'metro/src/DeltaBundler/Serializers/sourceMapString'.
Please check the version of Metro you are using and report the issue at http://www.github.com/getsentry/sentry-react-native/issues
`);
        }
        // Always generate source maps, can't use Sentry without source maps
        const map = sourceMapStringFunction([...preModules, ...(0, exports.getSortedModules)(graph, options)], {
            processModuleFilter: options.processModuleFilter,
            shouldAddToIgnoreList: options.shouldAddToIgnoreList,
        });
        return { code, map };
    };
};
exports.createDefaultMetroSerializer = createDefaultMetroSerializer;
//# sourceMappingURL=utils.js.map