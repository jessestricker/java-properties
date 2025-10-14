import { escapeComment, escapeKey, escapeValue } from "./escaping";

/**
 * The options for converting JavaScript values to Java properties.
 */
export interface StringifyOptions {
  /**
   * The comment at the beginning of the properties file.
   *
   * @defaultValue No file comment will be generated.
   */
  readonly fileComment?: string;

  /**
   * Whether to escape Unicode characters outside of ISO 8859-1.
   *
   * Set this to `true` when you want to save the string returned by {@link JavaProperties.stringify} using the ISO 8859-1 encoding.
   * Properties files encoded in ISO 8859-1 can be loaded by Java code using the older [Properties.load(InputStream)](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Properties.html#load(java.io.InputStream)) method.
   *
   * @defaultValue `false`
   */
  readonly escapeUnicode?: boolean;
}

/**
 * Provides methods for converting JavaScript values to the Java properties file format.
 *
 * @see https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Properties.html
 */
export namespace JavaProperties {
  /**
   * Converts the given JavaScript object to the Java properties file format.
   *
   * Only the properties returned by {@link Object.entries | Object.entries()} will be part of the returned string.
   * Keys must be of type `string`. Values may be of any type and they will be converted using
   * [string coercion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion).
   *
   * @param values The object containing the properties.
   * @param options The options used during conversion, optional.
   * @returns A string in the Java properties file format.
   */
  export function stringify(
    values: Record<string, unknown>,
    options: StringifyOptions = {},
  ): string {
    const escapeUnicode = options.escapeUnicode ?? false;
    let text = "";

    if (options.fileComment !== undefined) {
      const escapedFileComment = escapeComment(
        options.fileComment,
        escapeUnicode,
      );
      text += `#${escapedFileComment}\n`;
    }

    for (const [key, value] of Object.entries(values)) {
      const escapedKey = escapeKey(key, escapeUnicode);
      const escapedValue = escapeValue(String(value), escapeUnicode);
      text += `${escapedKey}=${escapedValue}\n`;
    }

    return text;
  }
}
