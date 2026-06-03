export { BuildCtx, CSSResource, QuartzTransformerPlugin, QuartzTransformerPluginInstance, StaticResources } from '@quartz-community/types';

interface FullWidthTablesOptions {
    /** CSS class added to table wrappers for scoped styling. */
    containerClass: string;
    /** table-layout value applied to markdown tables. */
    tableLayout: "auto" | "fixed";
    /** Stretch tables to the full viewport width, breaking out of the content column. */
    stretchToViewport: boolean;
}

export type { FullWidthTablesOptions };
