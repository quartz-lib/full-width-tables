import { describe, expect, it } from "vitest";
import type { Root as HastRoot } from "hast";
import { VFile } from "vfile";
import { FullWidthTables } from "../src/transformer";
import { createCtx } from "./helpers";

describe("FullWidthTables", () => {
  it("adds class to table elements only", () => {
    const tree: HastRoot = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "table",
          properties: {},
          children: [],
        },
      ],
    };

    const transformer = FullWidthTables();
    const plugins = transformer.htmlPlugins?.(createCtx()) ?? [];
    const rehypePlugin = plugins[0] as () => (tree: HastRoot, file: VFile) => void;
    rehypePlugin()(tree, new VFile(""));

    const table = tree.children[0];
    if (table?.type !== "element") {
      throw new Error("expected table element");
    }

    expect(table.properties?.className).toContain("full-width-tables");
  });

  it("injects full-width table CSS", () => {
    const transformer = FullWidthTables({ tableLayout: "fixed" });
    const resources = transformer.externalResources?.(createCtx());

    expect(resources?.css?.[0]?.content).toContain("width: 100%");
    expect(resources?.css?.[0]?.content).toContain("table-layout: fixed");
    expect(resources?.css?.[0]?.content).toContain(":has(> table.full-width-tables)");
  });

  it("supports viewport stretch mode", () => {
    const transformer = FullWidthTables({ stretchToViewport: true });
    const resources = transformer.externalResources?.(createCtx());

    expect(resources?.css?.[0]?.content).toContain("100vw");
  });
});
