/**
 * Converte um número para a sua representação por extenso em Português.
 * Útil para recibos e faturas.
 */

const unidades = [
  "",
  "um",
  "dois",
  "três",
  "quatro",
  "cinco",
  "seis",
  "sete",
  "oito",
  "nove",
];

const dezenas10 = [
  "dez",
  "onze",
  "doze",
  "treze",
  "catorze",
  "quinze",
  "dezasseis",
  "dezassete",
  "dezoito",
  "dezanove",
];

const dezenas = [
  "",
  "dez",
  "vinte",
  "trinta",
  "quarenta",
  "cinquenta",
  "sessenta",
  "setenta",
  "oitenta",
  "noventa",
];

const centenas = [
  "",
  "cento",
  "duzentos",
  "trezentos",
  "quatrocentos",
  "quinhentos",
  "seiscentos",
  "setecentos",
  "oitocentos",
  "novecentos",
];

function convertGroup(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cem";

  const h = Math.floor(n / 100);
  const remainder = n % 100;
  const d = Math.floor(remainder / 10);
  const u = remainder % 10;

  let res = "";

  if (h > 0) {
    res += centenas[h];
    if (remainder > 0) res += " e ";
  }

  if (d === 1) {
    res += dezenas10[u];
  } else {
    if (d > 1) {
      res += dezenas[d];
      if (u > 0) res += " e ";
    }
    if (u > 0 && d !== 1) {
      res += unidades[u];
    }
  }

  return res;
}

export function numberToWordsPt(num: number): string {
  if (num === 0) return "zero";
  if (num < 0) return "menos " + numberToWordsPt(Math.abs(num));

  // Limitando aos milhões por agora, suficiente para recibos habituais
  if (num >= 1000000000) return num.toString();

  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const ones = num % 1000;

  const parts: string[] = [];

  if (millions > 0) {
    const group = convertGroup(millions);
    parts.push(group + (millions === 1 ? " milhão" : " milhões"));
  }

  if (thousands > 0) {
    const group = convertGroup(thousands);
    if (thousands === 1) {
      parts.push("mil");
    } else {
      parts.push(group + " mil");
    }
  }

  if (ones > 0) {
    const group = convertGroup(ones);
    if (parts.length > 0) {
      if (ones < 100 || ones % 100 === 0) {
        parts.push("e " + group);
      } else {
        parts.push(group);
      }
    } else {
      parts.push(group);
    }
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}
