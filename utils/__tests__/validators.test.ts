import {
  validateCPF,
  validateCNPJ,
  validateCPFCNPJ,
  validateEmail,
  validatePhone,
  validateCurrency,
  validateDate,
  isFutureDate,
  isPastDate,
  validateArea,
  validateStockQuantity,
  validateNFeAccessKey,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateRange,
} from '../validators';

describe('Validators', () => {
  describe('validateCPF', () => {
    it('deve validar CPF correto', () => {
      expect(validateCPF('529.982.247-25')).toBe(true);
      expect(validateCPF('52998224725')).toBe(true);
    });

    it('deve rejeitar CPF inválido', () => {
      expect(validateCPF('111.111.111-11')).toBe(false); // todos iguais
      expect(validateCPF('123.456.789-00')).toBe(false); // dígitos errados
      expect(validateCPF('123')).toBe(false); // muito curto
      expect(validateCPF('')).toBe(false);
    });

    it('deve rejeitar CPF com quantidade errada de dígitos', () => {
      expect(validateCPF('1234567890')).toBe(false); // 10 dígitos
      expect(validateCPF('123456789012')).toBe(false); // 12 dígitos
    });
  });

  describe('validateCNPJ', () => {
    it('deve validar CNPJ correto', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
      expect(validateCNPJ('11222333000181')).toBe(true);
    });

    it('deve rejeitar CNPJ inválido', () => {
      expect(validateCNPJ('11.111.111/1111-11')).toBe(false); // todos iguais
      expect(validateCNPJ('12.345.678/0001-00')).toBe(false); // dígitos errados
      expect(validateCNPJ('123')).toBe(false); // muito curto
      expect(validateCNPJ('')).toBe(false);
    });
  });

  describe('validateCPFCNPJ', () => {
    it('deve identificar e validar CPF', () => {
      expect(validateCPFCNPJ('529.982.247-25')).toBe(true);
    });

    it('deve identificar e validar CNPJ', () => {
      expect(validateCPFCNPJ('11.222.333/0001-81')).toBe(true);
    });

    it('deve rejeitar documento inválido', () => {
      expect(validateCPFCNPJ('123456')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('deve validar email correto', () => {
      expect(validateEmail('teste@email.com')).toBe(true);
      expect(validateEmail('usuario.nome@empresa.com.br')).toBe(true);
    });

    it('deve rejeitar email inválido', () => {
      expect(validateEmail('email')).toBe(false);
      expect(validateEmail('email@')).toBe(false);
      expect(validateEmail('@email.com')).toBe(false);
      expect(validateEmail('email@.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('deve validar telefone brasileiro', () => {
      expect(validatePhone('(11) 99999-9999')).toBe(true); // celular
      expect(validatePhone('(11) 3333-3333')).toBe(true); // fixo
      expect(validatePhone('11999999999')).toBe(true);
      expect(validatePhone('1133333333')).toBe(true);
    });

    it('deve rejeitar telefone inválido', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });

  describe('validateCurrency', () => {
    it('deve validar valores monetários', () => {
      expect(validateCurrency(100)).toBe(true);
      expect(validateCurrency(0)).toBe(true);
      expect(validateCurrency(1234.56)).toBe(true);
      expect(validateCurrency('1.234,56')).toBe(true);
    });

    it('deve rejeitar valores inválidos', () => {
      expect(validateCurrency(-100)).toBe(false);
      expect(validateCurrency(Infinity)).toBe(false);
    });
  });

  describe('validateDate', () => {
    it('deve validar datas válidas', () => {
      expect(validateDate(new Date())).toBe(true);
      expect(validateDate('2025-01-15')).toBe(true);
      expect(validateDate(new Date('2025-12-31'))).toBe(true);
    });

    it('deve rejeitar datas inválidas', () => {
      expect(validateDate('invalid')).toBe(false);
      expect(validateDate(new Date('invalid'))).toBe(false);
    });
  });

  describe('isFutureDate', () => {
    it('deve identificar data futura', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      expect(isFutureDate(future)).toBe(true);
    });

    it('deve rejeitar data passada', () => {
      const past = new Date();
      past.setFullYear(past.getFullYear() - 1);
      expect(isFutureDate(past)).toBe(false);
    });
  });

  describe('isPastDate', () => {
    it('deve identificar data passada', () => {
      const past = new Date();
      past.setFullYear(past.getFullYear() - 1);
      expect(isPastDate(past)).toBe(true);
    });

    it('deve rejeitar data futura', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      expect(isPastDate(future)).toBe(false);
    });
  });

  describe('validateArea', () => {
    it('deve validar áreas válidas', () => {
      expect(validateArea(100)).toBe(true);
      expect(validateArea(0.5)).toBe(true);
      expect(validateArea(500000)).toBe(true);
    });

    it('deve rejeitar áreas inválidas', () => {
      expect(validateArea(0)).toBe(false);
      expect(validateArea(-10)).toBe(false);
      expect(validateArea(2000000)).toBe(false); // muito grande
    });
  });

  describe('validateStockQuantity', () => {
    it('deve validar quantidades de estoque', () => {
      expect(validateStockQuantity(100, 50)).toBe(true);
      expect(validateStockQuantity(0)).toBe(true);
    });

    it('deve rejeitar quantidade abaixo do mínimo', () => {
      expect(validateStockQuantity(30, 50)).toBe(false);
    });
  });

  describe('validateNFeAccessKey', () => {
    it('deve validar chave de acesso NF-e (44 dígitos)', () => {
      expect(validateNFeAccessKey('35250112345678000190550010000124501000124501')).toBe(true);
    });

    it('deve rejeitar chave de acesso inválida', () => {
      expect(validateNFeAccessKey('123')).toBe(false);
      expect(validateNFeAccessKey('')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('deve validar valores preenchidos', () => {
      expect(validateRequired('texto')).toBe(true);
      expect(validateRequired(123)).toBe(true);
      expect(validateRequired([1, 2, 3])).toBe(true);
      expect(validateRequired(true)).toBe(true);
    });

    it('deve rejeitar valores vazios', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
      expect(validateRequired([])).toBe(false);
    });
  });

  describe('validateMinLength', () => {
    it('deve validar tamanho mínimo', () => {
      expect(validateMinLength('teste', 3)).toBe(true);
      expect(validateMinLength('abc', 3)).toBe(true);
    });

    it('deve rejeitar string muito curta', () => {
      expect(validateMinLength('ab', 3)).toBe(false);
    });
  });

  describe('validateMaxLength', () => {
    it('deve validar tamanho máximo', () => {
      expect(validateMaxLength('teste', 10)).toBe(true);
      expect(validateMaxLength('abc', 3)).toBe(true);
    });

    it('deve rejeitar string muito longa', () => {
      expect(validateMaxLength('texto muito longo', 5)).toBe(false);
    });
  });

  describe('validateRange', () => {
    it('deve validar valor dentro da faixa', () => {
      expect(validateRange(5, 1, 10)).toBe(true);
      expect(validateRange(1, 1, 10)).toBe(true);
      expect(validateRange(10, 1, 10)).toBe(true);
    });

    it('deve rejeitar valor fora da faixa', () => {
      expect(validateRange(0, 1, 10)).toBe(false);
      expect(validateRange(11, 1, 10)).toBe(false);
    });
  });
});
