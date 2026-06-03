import type { PluggableList, Plugin } from "unified";
import type { Root as HastRoot, Element } from "hast";
import type { VFile } from "vfile";
import { visit } from "unist-util-visit";
import type { QuartzTransformerPlugin } from "@quartz-community/types";
import type { FullWidthTablesOptions } from "./types";

const defaultOptions: FullWidthTablesOptions = {
  containerClass: "full-width-tables",
  tableLayout: "auto",
  stretchToViewport: false,
};

const appendClass = (node: Element, className: string) => {
  const existing = node.properties?.className;
  const classes: string[] = Array.isArray(existing)
    ? existing.filter((value): value is string => typeof value === "string")
    : typeof existing === "string"
      ? [existing]
      : [];

  if (classes.includes(className)) {
    return;
  }

  node.properties = {
    ...node.properties,
    className: [...classes, className],
  };
};

const rehypeFullWidthTables = (containerClass: string): Plugin<[], HastRoot> => {
  return () => (tree: HastRoot, _file: VFile) => {
    // Quartz wraps tables in `.table-container` later during htmlToJsx — only the
    // `<table>` node exists in the HAST at this stage.
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "table") {
        appendClass(node, containerClass);
      }
    });
  };
};

const buildStyles = (options: FullWidthTablesOptions) => {
  const { containerClass, tableLayout, stretchToViewport } = options;
  const tableSelector = `article .table-container > table.${containerClass}`;
  const containerSelector = `article .table-container:has(> table.${containerClass})`;

  const containerRules = stretchToViewport
    ? `
${containerSelector} {
  width: 100vw;
  max-width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}`
    : `
${containerSelector} {
  width: 100%;
  max-width: 100%;
}`;

  return `
${containerRules}

${tableSelector} {
  width: 100%;
  max-width: 100%;
  margin: 1rem 0;
  padding: 0;
  table-layout: ${tableLayout};
  box-sizing: border-box;
}
`.trim();
};

/**
 * Makes Markdown tables span the full available content width.
 */
export const FullWidthTables: QuartzTransformerPlugin<Partial<FullWidthTablesOptions>> = (
  userOptions?: Partial<FullWidthTablesOptions>,
) => {
  const options = { ...defaultOptions, ...userOptions };

  return {
    name: "FullWidthTables",
    htmlPlugins(): PluggableList {
      return [rehypeFullWidthTables(options.containerClass)];
    },
    externalResources() {
      return {
        css: [
          {
            content: buildStyles(options),
            inline: true,
          },
        ],
      };
    },
  };
};
