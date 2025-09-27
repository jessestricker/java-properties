import { escapeComment, escapeKey, escapeValue } from "../src/escaping";

describe("escapeComment", () => {
  it("empty", () => {
    expect(escapeComment("", false)).toBe("");
  });

  it("one line", () => {
    expect(escapeComment("foo", false)).toBe("foo");
  });

  it("with Unicode", () => {
    expect(escapeComment("fōō", false)).toBe("fōō");
    expect(escapeComment("fōō", true)).toBe("f\\u014d\\u014d");
    expect(escapeComment("😀", true)).toBe("\\ud83d\\ude00");
  });

  it("multi line", () => {
    expect(escapeComment("foo\nbar", false)).toBe("foo\n#bar");
    expect(escapeComment("foo\rbar", false)).toBe("foo\n#bar");
    expect(escapeComment("foo\r\nbar", false)).toBe("foo\n#bar");
  });

  it("multi line with hash sign", () => {
    expect(escapeComment("foo\n#bar", false)).toBe("foo\n#bar");
    expect(escapeComment("foo\r#bar", false)).toBe("foo\n#bar");
    expect(escapeComment("foo\r\n#bar", false)).toBe("foo\n#bar");
  });

  it("multi line with exclamation mark", () => {
    expect(escapeComment("foo\n!bar", false)).toBe("foo\n!bar");
    expect(escapeComment("foo\r!bar", false)).toBe("foo\n!bar");
    expect(escapeComment("foo\r\n!bar", false)).toBe("foo\n!bar");
  });
});

describe("escapeKey", () => {
  it("empty", () => {
    expect(escapeKey("", false)).toBe("");
  });

  it("spaces", () => {
    expect(escapeKey(" a b ", false)).toBe("\\ a\\ b\\ ");
  });

  it("other whitespace", () => {
    expect(escapeKey("\t\n\r\f", false)).toBe("\\t\\n\\r\\f");
  });

  it("special chars", () => {
    expect(escapeKey("=:#!", false)).toBe("\\=\\:\\#\\!");
  });

  it("Unicode chars", () => {
    expect(escapeKey("fōō", false)).toBe("fōō");
    expect(escapeKey("fōō", true)).toBe("f\\u014d\\u014d");
    expect(escapeKey("😀", true)).toBe("\\ud83d\\ude00");
  });
});

describe("escapeValue", () => {
  it("empty", () => {
    expect(escapeValue("", false)).toBe("");
  });

  it("leading spaces", () => {
    expect(escapeValue(" a b ", false)).toBe("\\ a b ");
  });

  it("other whitespace", () => {
    expect(escapeValue("\t\n\r\f", false)).toBe("\\t\\n\\r\\f");
  });

  it("special chars", () => {
    expect(escapeValue("=:#!", false)).toBe("\\=\\:\\#\\!");
  });

  it("Unicode chars", () => {
    expect(escapeValue("fōō", false)).toBe("fōō");
    expect(escapeValue("fōō", true)).toBe("f\\u014d\\u014d");
    expect(escapeValue("😀", true)).toBe("\\ud83d\\ude00");
  });
});
