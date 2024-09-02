
export function formatarCpfCnpj(cpfcnpj) {
  if (cpfcnpj.length === 11) {
    // Formatar CPF: XXX.XXX.XXX-XX
    return `${cpfcnpj.substr(0, 3)}.${cpfcnpj.substr(3, 3)}.${cpfcnpj.substr(6, 3)}-${cpfcnpj.substr(9, 2)}`;
  } else if (cpfcnpj.length === 14) {
    // Formatar CNPJ: XX.XXX.XXX/XXXX-XX
    return `${cpfcnpj.substr(0, 2)}.${cpfcnpj.substr(2, 3)}.${cpfcnpj.substr(5, 3)}/${cpfcnpj.substr(8, 4)}-${cpfcnpj.substr(12, 2)}`;
  } else {
    return cpfcnpj;
  }
}