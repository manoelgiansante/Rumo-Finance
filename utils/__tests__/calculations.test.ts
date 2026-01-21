import {
  calculateGrossMargin,
  calculateMarginPercentage,
  calculateMarginPerHectare,
  calculateCostPerHectare,
  calculateROI,
  calculateBreakEven,
  calculateYieldPerHectare,
  calculateVariation,
  calculateMovingAverage,
  calculateTotal,
  calculateAverage,
  calculateCompoundInterest,
  calculatePMT,
  calculateDaysUntilDue,
  calculateDaysOverdue,
  calculateFunrural,
  calculateAverageStock,
  calculateStockTurnover,
  calculateWeightedAverageCost,
  calculateLinearDepreciation,
  roundToTwoDecimals,
} from '../calculations';

describe('Calculations', () => {
  describe('calculateGrossMargin', () => {
    it('deve calcular margem bruta corretamente', () => {
      expect(calculateGrossMargin(100000, 60000)).toBe(40000);
      expect(calculateGrossMargin(50000, 50000)).toBe(0);
    });

    it('deve lidar com margem negativa', () => {
      expect(calculateGrossMargin(50000, 70000)).toBe(-20000);
    });
  });

  describe('calculateMarginPercentage', () => {
    it('deve calcular margem percentual', () => {
      expect(calculateMarginPercentage(100000, 60000)).toBe(40);
      expect(calculateMarginPercentage(100000, 80000)).toBe(20);
    });

    it('deve retornar 0 quando receita é 0', () => {
      expect(calculateMarginPercentage(0, 1000)).toBe(0);
    });
  });

  describe('calculateMarginPerHectare', () => {
    it('deve calcular margem por hectare', () => {
      expect(calculateMarginPerHectare(150000, 100)).toBe(1500);
    });

    it('deve retornar 0 quando área é 0', () => {
      expect(calculateMarginPerHectare(150000, 0)).toBe(0);
    });
  });

  describe('calculateCostPerHectare', () => {
    it('deve calcular custo por hectare', () => {
      expect(calculateCostPerHectare(300000, 150)).toBe(2000);
    });

    it('deve retornar 0 quando área é 0', () => {
      expect(calculateCostPerHectare(300000, 0)).toBe(0);
    });
  });

  describe('calculateROI', () => {
    it('deve calcular ROI corretamente', () => {
      expect(calculateROI(50000, 200000)).toBe(25);
      expect(calculateROI(100000, 100000)).toBe(100);
    });

    it('deve retornar 0 quando investimento é 0', () => {
      expect(calculateROI(50000, 0)).toBe(0);
    });
  });

  describe('calculateBreakEven', () => {
    it('deve calcular ponto de equilíbrio', () => {
      // Custo fixo: 100000, Preço: 50, Custo variável: 30 => 100000/(50-30) = 5000 unidades
      expect(calculateBreakEven(100000, 50, 30)).toBe(5000);
    });

    it('deve retornar Infinity quando contribuição é 0 ou negativa', () => {
      expect(calculateBreakEven(100000, 30, 30)).toBe(Infinity);
      expect(calculateBreakEven(100000, 20, 30)).toBe(Infinity);
    });
  });

  describe('calculateYieldPerHectare', () => {
    it('deve calcular produtividade por hectare', () => {
      expect(calculateYieldPerHectare(9000, 150)).toBe(60); // 60 sacas/ha
    });

    it('deve retornar 0 quando área é 0', () => {
      expect(calculateYieldPerHectare(9000, 0)).toBe(0);
    });
  });

  describe('calculateVariation', () => {
    it('deve calcular variação percentual positiva', () => {
      expect(calculateVariation(120, 100)).toBe(20);
    });

    it('deve calcular variação percentual negativa', () => {
      expect(calculateVariation(80, 100)).toBe(-20);
    });

    it('deve lidar com valor anterior zero', () => {
      expect(calculateVariation(100, 0)).toBe(100);
      expect(calculateVariation(0, 0)).toBe(0);
    });
  });

  describe('calculateMovingAverage', () => {
    it('deve calcular média móvel', () => {
      const values = [10, 20, 30, 40, 50];
      const result = calculateMovingAverage(values, 3);
      expect(result).toEqual([20, 30, 40]); // médias de [10,20,30], [20,30,40], [30,40,50]
    });

    it('deve retornar array vazio se período maior que valores', () => {
      expect(calculateMovingAverage([10, 20], 5)).toEqual([]);
    });
  });

  describe('calculateTotal', () => {
    it('deve calcular total de array de objetos', () => {
      const items = [{ value: 100 }, { value: 200 }, { value: 300 }];
      expect(calculateTotal(items)).toBe(600);
    });

    it('deve retornar 0 para array vazio', () => {
      expect(calculateTotal([])).toBe(0);
    });
  });

  describe('calculateAverage', () => {
    it('deve calcular média de valores', () => {
      expect(calculateAverage([10, 20, 30])).toBe(20);
    });

    it('deve retornar 0 para array vazio', () => {
      expect(calculateAverage([])).toBe(0);
    });
  });

  describe('calculateCompoundInterest', () => {
    it('deve calcular juros compostos', () => {
      // 1000 a 10% ao período por 2 períodos = 1000 * 1.1^2 = 1210
      expect(roundToTwoDecimals(calculateCompoundInterest(1000, 10, 2))).toBe(1210);
    });
  });

  describe('calculatePMT', () => {
    it('deve calcular parcela de financiamento', () => {
      // Principal: 10000, Taxa: 12% a.a., 12 meses
      const pmt = calculatePMT(10000, 12, 12);
      expect(roundToTwoDecimals(pmt)).toBe(888.49);
    });

    it('deve calcular sem juros', () => {
      expect(calculatePMT(12000, 0, 12)).toBe(1000);
    });
  });

  describe('calculateDaysUntilDue', () => {
    it('deve calcular dias até vencimento', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 5);
      expect(calculateDaysUntilDue(tomorrow)).toBe(5);
    });

    it('deve retornar negativo para vencidas', () => {
      const past = new Date();
      past.setDate(past.getDate() - 3);
      expect(calculateDaysUntilDue(past)).toBe(-3);
    });
  });

  describe('calculateDaysOverdue', () => {
    it('deve calcular dias de atraso', () => {
      const past = new Date();
      past.setDate(past.getDate() - 5);
      expect(calculateDaysOverdue(past)).toBe(5);
    });

    it('deve retornar 0 se não vencida', () => {
      const future = new Date();
      future.setDate(future.getDate() + 5);
      expect(calculateDaysOverdue(future)).toBe(0);
    });
  });

  describe('calculateFunrural', () => {
    it('deve calcular FUNRURAL com alíquota padrão (2.3%)', () => {
      expect(calculateFunrural(100000)).toBe(2300);
    });

    it('deve calcular FUNRURAL com alíquota personalizada', () => {
      expect(calculateFunrural(100000, 1.5)).toBe(1500);
    });
  });

  describe('calculateAverageStock', () => {
    it('deve calcular estoque médio', () => {
      expect(calculateAverageStock(1000, 500)).toBe(750);
    });
  });

  describe('calculateStockTurnover', () => {
    it('deve calcular giro de estoque', () => {
      // CMV: 120000, Estoque Médio: 30000 => Giro = 4
      expect(calculateStockTurnover(120000, 30000)).toBe(4);
    });

    it('deve retornar 0 quando estoque médio é 0', () => {
      expect(calculateStockTurnover(120000, 0)).toBe(0);
    });
  });

  describe('calculateWeightedAverageCost', () => {
    it('deve calcular custo médio ponderado', () => {
      const batches = [
        { quantity: 100, unitCost: 10 },
        { quantity: 200, unitCost: 15 },
      ];
      // (100*10 + 200*15) / 300 = 4000/300 = 13.33
      expect(roundToTwoDecimals(calculateWeightedAverageCost(batches))).toBe(13.33);
    });

    it('deve retornar 0 para array vazio', () => {
      expect(calculateWeightedAverageCost([])).toBe(0);
    });
  });

  describe('calculateLinearDepreciation', () => {
    it('deve calcular depreciação linear anual', () => {
      // Aquisição: 100000, Residual: 10000, Vida útil: 10 anos => (100000-10000)/10 = 9000/ano
      expect(calculateLinearDepreciation(100000, 10000, 10)).toBe(9000);
    });

    it('deve retornar 0 quando vida útil é 0', () => {
      expect(calculateLinearDepreciation(100000, 10000, 0)).toBe(0);
    });
  });

  describe('roundToTwoDecimals', () => {
    it('deve arredondar para 2 casas decimais', () => {
      expect(roundToTwoDecimals(1.234)).toBe(1.23);
      expect(roundToTwoDecimals(1.235)).toBe(1.24);
      expect(roundToTwoDecimals(1.2)).toBe(1.2);
    });
  });
});
