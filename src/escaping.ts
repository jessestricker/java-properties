export function escapeComment(
  unescaped: string,
  escapeUnicode: boolean,
): string {
  let escaped = "";
  for (let i = 0; i < unescaped.length; i++) {
    // check for Unicode escapes
    if (escapeUnicode) {
      const codeUnit = unescaped.charCodeAt(i);
      if (codeUnit > 0xff) {
        escaped += toUnicodeEscape(codeUnit);
        continue;
      }
    }

    // check for line breaks
    const char = unescaped[i];
    if (char === "\n" || char === "\r") {
      escaped += "\n";
      let nextChar = unescaped[i + 1];
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      nextChar = unescaped[i + 1];
      if (nextChar !== "#" && nextChar !== "!") {
        escaped += "#";
      }
      continue;
    }

    // char does not need escaping
    escaped += char;
  }
  return escaped;
}

export function escapeKey(unescaped: string, escapeUnicode: boolean): string {
  return escapePropertyPart(unescaped, false, escapeUnicode);
}

export function escapeValue(unescaped: string, escapeUnicode: boolean): string {
  return escapePropertyPart(unescaped, true, escapeUnicode);
}

function escapePropertyPart(
  unescaped: string,
  escapeLeadingSpacesOnly: boolean,
  escapeUnicode: boolean,
): string {
  let escaped = "";
  let inLeadingSpaces = true;
  for (let i = 0; i < unescaped.length; i++) {
    const char = unescaped[i];

    // check for spaces
    if (char === " ") {
      if (inLeadingSpaces || !escapeLeadingSpacesOnly) {
        escaped += "\\ ";
      } else {
        escaped += " ";
      }
      continue;
    }
    inLeadingSpaces = false;

    switch (char) {
      // other whitespace
      case "\t":
        escaped += "\\t";
        break;
      case "\n":
        escaped += "\\n";
        break;
      case "\r":
        escaped += "\\r";
        break;
      case "\f":
        escaped += "\\f";
        break;

      // special chars
      case "=":
      case ":":
      case "#":
      case "!":
        escaped += `\\${char}`;
        break;

      // normal chars
      default:
        // check for Unicode escapes
        if (escapeUnicode) {
          const codeUnit = unescaped.charCodeAt(i);
          if (codeUnit < 0x20 || codeUnit > 0x7e) {
            escaped += toUnicodeEscape(codeUnit);
            continue;
          }
        }

        // char does not need escaping
        escaped += char;
        break;
    }
  }
  return escaped;
}

function toUnicodeEscape(codeUnit: number) {
  return "\\u" + codeUnit.toString(16).padStart(4, "0");
}
