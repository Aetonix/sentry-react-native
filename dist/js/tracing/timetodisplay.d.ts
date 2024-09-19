import type { Span, StartSpanOptions } from '@sentry/types';
import * as React from 'react';
/**
 * Flags of active spans with manual initial display.
 */
export declare const manualInitialDisplaySpans: WeakMap<Span, true>;
export type TimeToDisplayProps = {
    children?: React.ReactNode;
    spanName?: string;
    record?: boolean;
};
/**
 * Component to measure time to initial display.
 *
 * The initial display is recorded when the component prop `record` is true.
 *
 * <TimeToInitialDisplay record />
 */
export declare function TimeToInitialDisplay(props: TimeToDisplayProps): React.ReactElement;
/**
 * Component to measure time to full display.
 *
 * The initial display is recorded when the component prop `record` is true.
 *
 * <TimeToInitialDisplay record />
 */
export declare function TimeToFullDisplay(props: TimeToDisplayProps): React.ReactElement;
/**
 * Starts a new span for the initial display.
 *
 * Returns current span if already exists in the currently active span.
 */
export declare function startTimeToInitialDisplaySpan(options?: Omit<StartSpanOptions, 'op' | 'name'> & {
    name?: string;
    isAutoInstrumented?: boolean;
}): Span | undefined;
/**
 * Starts a new span for the full display.
 *
 * Returns current span if already exists in the currently active span.
 */
export declare function startTimeToFullDisplaySpan(options?: Omit<StartSpanOptions, 'op' | 'name'> & {
    name?: string;
    timeoutMs?: number;
}): Span | undefined;
//# sourceMappingURL=timetodisplay.d.ts.map