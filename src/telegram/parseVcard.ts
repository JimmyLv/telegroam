// The following VCard parser is copied from
//
//   https://github.com/Heymdall/vcard
//
// MIT License
//
// Copyright (c) 2018 Aleksandr Kitov
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
export function parseVcard(string) {
  var PREFIX = "BEGIN:VCARD",
    POSTFIX = "END:VCARD";

  /**
   * Return json representation of vCard
   * @param {string} string raw vCard
   * @returns {*}
   */
  function parse(string) {
    var result = {},
      lines = string.split(/\r\n|\r|\n/),
      count = lines.length,
      pieces,
      key,
      value,
      meta,
      namespace;

    for (var i = 0; i < count; i++) {
      if (lines[i] === "") {
        continue;
      }
      if (
        lines[i].toUpperCase() === PREFIX ||
        lines[i].toUpperCase() === POSTFIX
      ) {
        continue;
      }
      var data = lines[i];

      /**
       * Check that next line continues current
       * @param {number} i
       * @returns {boolean}
       */
      var isValueContinued = function (i) {
        return (
          i + 1 < count && (lines[i + 1][0] === " " || lines[i + 1][0] === "\t")
        );
      };
      // handle multiline properties (i.e. photo).
      // next line should start with space or tab character
      if (isValueContinued(i)) {
        while (isValueContinued(i)) {
          data += lines[i + 1].trim();
          i++;
        }
      }

      pieces = data.split(":");
      key = pieces.shift();
      value = pieces.join(":");
      namespace = false;
      meta = {};

      // meta fields in property
      if (key.match(/;/)) {
        key = key.replace(/\\;/g, "ΩΩΩ").replace(/\\,/, ",");
        var metaArr = key.split(";").map(function (item) {
          return item.replace(/ΩΩΩ/g, ";");
        });
        key = metaArr.shift();
        metaArr.forEach(function (item) {
          var arr = item.split("=");
          arr[0] = arr[0].toLowerCase();
          if (arr[0].length === 0) {
            return;
          }
          if (meta[arr[0]]) {
            meta[arr[0]].push(arr[1]);
          } else {
            meta[arr[0]] = [arr[1]];
          }
        });
      }

      // values with \n
      value = value.replace(/\\n/g, "\n");

      value = tryToSplit(value);

      // Grouped properties
      if (key.match(/\./)) {
        var arr = key.split(".");
        key = arr[1];
        namespace = arr[0];
      }

      var newValue: any = {
        value: value,
      };
      if (Object.keys(meta).length) {
        newValue.meta = meta;
      }
      if (namespace) {
        newValue.namespace = namespace;
      }

      if (key.indexOf("X-") !== 0) {
        key = key.toLowerCase();
      }

      if (typeof result[key] === "undefined") {
        result[key] = [newValue];
      } else {
        result[key].push(newValue);
      }
    }

    return result;
  }

  var HAS_SEMICOLON_SEPARATOR = /[^\\];|^;/,
    HAS_COMMA_SEPARATOR = /[^\\],|^,/;
  /**
   * Split value by "," or ";" and remove escape sequences for this separators
   * @param {string} value
   * @returns {string|string[]
   */
  function tryToSplit(value) {
    if (value.match(HAS_SEMICOLON_SEPARATOR)) {
      value = value.replace(/\\,/g, ",");
      return splitValue(value, ";");
    } else if (value.match(HAS_COMMA_SEPARATOR)) {
      value = value.replace(/\\;/g, ";");
      return splitValue(value, ",");
    } else {
      return value.replace(/\\,/g, ",").replace(/\\;/g, ";");
    }
  }
  /**
   * Split vcard field value by separator
   * @param {string|string[]} value
   * @param {string} separator
   * @returns {string|string[]}
   */
  function splitValue(value, separator) {
    var separatorRegexp = new RegExp(separator);
    var escapedSeparatorRegexp = new RegExp("\\\\" + separator, "g");
    // easiest way, replace it with really rare character sequence
    value = value.replace(escapedSeparatorRegexp, "ΩΩΩ");
    if (value.match(separatorRegexp)) {
      value = value.split(separator);

      value = value.map(function (item) {
        return item.replace(/ΩΩΩ/g, separator);
      });
    } else {
      value = value.replace(/ΩΩΩ/g, separator);
    }
    return value;
  }

  return parse(string);
}
