import { QuartzTransformerPlugin } from '@quartz-community/types';
export { QuartzTransformerPlugin, QuartzTransformerPluginInstance } from '@quartz-community/types';
import { FullWidthTablesOptions } from './types.js';

/**
 * Makes Markdown tables span the full available content width.
 */
declare const FullWidthTables: QuartzTransformerPlugin<Partial<FullWidthTablesOptions>>;

export { FullWidthTables, FullWidthTablesOptions };
