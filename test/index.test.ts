import { JavaProperties } from "../src";

describe("JavaProperties", () => {
  describe("stringify", () => {
    it("empty", () => {
      expect(JavaProperties.stringify({})).toBe("");
    });

    it("empty with fileComment", () => {
      expect(JavaProperties.stringify({}, { fileComment: "comment" })).toBe(
        "#comment\n",
      );
    });

    it("single property", () => {
      expect(JavaProperties.stringify({ foo: "bar" })).toBe("foo=bar\n");
    });

    it("single property with fileComment", () => {
      expect(
        JavaProperties.stringify({ foo: "bar" }, { fileComment: "comment" }),
      ).toBe("#comment\nfoo=bar\n");
    });

    it("single property with fileComment and escapeUnicode", () => {
      expect(
        JavaProperties.stringify(
          { fōō: "backspace \b" },
          { fileComment: "😀", escapeUnicode: true },
        ),
      ).toBe("#\\ud83d\\ude00\nf\\u014d\\u014d=backspace \\u0008\n");
    });

    it("multiple properties", () => {
      expect(
        JavaProperties.stringify({
          undefined: undefined,
          null: null,
          boolean: true,
          number: 3.14,
          string: "foobar",
          object: {},
        }),
      ).toBe(
        "undefined=undefined\nnull=null\nboolean=true\nnumber=3.14\nstring=foobar\nobject=[object Object]\n",
      );
    });
  });

  describe("constructor", () => {
    expect(() => new (JavaProperties as any)()).toThrow(
      TypeError("JavaProperties is not constructible."),
    );
  });
});
