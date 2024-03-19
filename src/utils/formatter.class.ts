export class Formatter {
  static CPF(cpf: string) {
    const cleanedCPF = cpf.replace(/\D/g, '');
    const match = cleanedCPF.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
  
    return cpf;
  }

  static phone(phoneNumber: string) {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove caracteres não numéricos
  
    if (cleanedPhoneNumber.length === 11) {
      return `(${cleanedPhoneNumber.substring(0, 2)}) ${cleanedPhoneNumber.substring(2, 7)}-${cleanedPhoneNumber.substring(7)}`;
    } else if (cleanedPhoneNumber.length === 10) {
      return `(${cleanedPhoneNumber.substring(0, 2)}) ${cleanedPhoneNumber.substring(2, 6)}-${cleanedPhoneNumber.substring(6)}`;
    }
  
    return phoneNumber; // Retorna o número não formatado se não houver correspondência
  }
}