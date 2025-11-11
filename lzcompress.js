/** @param {NS} ns */
export async function main(ns) {
  compr = ns.args[0]
  let plain = "";

  for (let i = 0; i < compr.length;) {
    const literal_length = compr.charCodeAt(i) - 0x30;

    if (literal_length < 0 || literal_length > 9 || i + 1 + literal_length > compr.length) {
      return null;
    }

    plain += compr.substring(i + 1, i + 1 + literal_length);
    i += 1 + literal_length;

    if (i >= compr.length) {
      break;
    }
    const backref_length = compr.charCodeAt(i) - 0x30;

    if (backref_length < 0 || backref_length > 9) {
      return null;
    } else if (backref_length === 0) {
       ++i;
    } else {
      if (i + 1 >= compr.length) {
        return null;
        }

    const backref_offset = compr.charCodeAt(i + 1) - 0x30;
      if ((backref_length > 0 && (backref_offset < 1 || backref_offset > 9)) || backref_offset > plain.length) {
        return null;
        }

        for (let j = 0; j < backref_length; ++j) {
          plain += plain[plain.length - backref_offset];
          }

          i += 2;
          }
  }

        ns.tprint(plain);
        ns.tprint("End of Program")
}
