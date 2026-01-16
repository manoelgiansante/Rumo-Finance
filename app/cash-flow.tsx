import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CashFlowItem {
  date: Date;
  description: string;
  type: 'in' | 'out';
  value: number;
  status: 'projected' | 'realized';
  category: string;
  operation: string;
}

const mockCashFlow: CashFlowItem[] = [
  { date: new Date('2025-01-16'), description: 'Venda de Gado - Lote 15', type: 'in', value: 180000, status: 'realized', category: 'Vendas', operation: 'Confinamento' },
  { date: new Date('2025-01-17'), description: 'Pagamento Ração', type: 'out', value: 15000, status: 'realized', category: 'Insumos', operation: 'Confinamento' },
  { date: new Date('2025-01-18'), description: 'Venda Cana - Usina', type: 'in', value: 95000, status: 'projected', category: 'Vendas', operation: 'Cana' },
  { date: new Date('2025-01-20'), description: 'Fertilizante NPK', type: 'out', value: 28000, status: 'projected', category: 'Insumos', operation: 'Cana' },
  { date: new Date('2025-01-22'), description: 'Conta de Energia', type: 'out', value: 3200, status: 'projected', category: 'Utilidades', operation: 'Sede' },
  { date: new Date('2025-01-25'), description: 'Venda Composto Orgânico', type: 'in', value: 12000, status: 'projected', category: 'Vendas', operation: 'Compostagem' },
];

export default function CashFlowScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('month');
  const currentBalance = 287500;
  const projectedInflows = mockCashFlow.filter(i => i.type === 'in' && i.status === 'projected').reduce((sum, i) => sum + i.value, 0);
  const projectedOutflows = mockCashFlow.filter(i => i.type === 'out' && i.status === 'projected').reduce((sum, i) => sum + i.value, 0);
  const projectedBalance = currentBalance + projectedInflows - projectedOutflows;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: "Fluxo de Caixa",
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textPrimary,
          headerShadowVisible: false,
        }} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Atual</Text>
          <Text style={styles.balanceValue}>R$ {currentBalance.toLocaleString('pt-BR')}</Text>
          <View style={styles.balanceDivider} />
          <View style={styles.projectionRow}>
            <View style={styles.projectionItem}>
              <View style={styles.projectionHeader}>
                <TrendingUp size={16} color={Colors.success} />
                <Text style={styles.projectionLabel}>Entradas Previstas</Text>
              </View>
              <Text style={[styles.projectionValue, { color: Colors.success }]}>
                + R$ {projectedInflows.toLocaleString('pt-BR')}
              </Text>
            </View>
            <View style={styles.projectionDivider} />
            <View style={styles.projectionItem}>
              <View style={styles.projectionHeader}>
                <TrendingDown size={16} color={Colors.error} />
                <Text style={styles.projectionLabel}>Saídas Previstas</Text>
              </View>
              <Text style={[styles.projectionValue, { color: Colors.error }]}>
                - R$ {projectedOutflows.toLocaleString('pt-BR')}
              </Text>
            </View>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.projectedBalanceRow}>
            <Text style={styles.projectedBalanceLabel}>Saldo Projetado</Text>
            <Text style={[
              styles.projectedBalanceValue,
              { color: projectedBalance > currentBalance ? Colors.success : Colors.error }
            ]}>
              R$ {projectedBalance.toLocaleString('pt-BR')}
            </Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[styles.filterChip, selectedPeriod === 'week' && styles.filterChipActive]}
            onPress={() => setSelectedPeriod('week')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, selectedPeriod === 'week' && styles.filterChipTextActive]}>
              Próximos 7 dias
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, selectedPeriod === 'month' && styles.filterChipActive]}
            onPress={() => setSelectedPeriod('month')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, selectedPeriod === 'month' && styles.filterChipTextActive]}>
              Este mês
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Movimentações</Text>
          {mockCashFlow.map((item, index) => {
            const isInflow = item.type === 'in';
            const isRealized = item.status === 'realized';

            return (
              <TouchableOpacity key={index} style={styles.flowCard} activeOpacity={0.7}>
                <View style={styles.flowHeader}>
                  <View style={styles.flowDateBadge}>
                    <Calendar size={14} color={Colors.textSecondary} />
                    <Text style={styles.flowDate}>
                      {format(item.date, 'dd MMM', { locale: ptBR })}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: isRealized ? Colors.success + '18' : Colors.warning + '18' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: isRealized ? Colors.success : Colors.warning }
                    ]}>
                      {isRealized ? 'Realizado' : 'Projetado'}
                    </Text>
                  </View>
                </View>

                <View style={styles.flowContent}>
                  <View style={styles.flowInfo}>
                    <Text style={styles.flowDescription}>{item.description}</Text>
                    <View style={styles.flowMeta}>
                      <Text style={styles.flowCategory}>{item.category}</Text>
                      <Text style={styles.flowOperation}> • {item.operation}</Text>
                    </View>
                  </View>
                  <View style={styles.flowValueContainer}>
                    <View style={[
                      styles.flowIcon,
                      { backgroundColor: isInflow ? Colors.success + '18' : Colors.error + '18' }
                    ]}>
                      {isInflow ? (
                        <TrendingUp size={18} color={Colors.success} />
                      ) : (
                        <TrendingDown size={18} color={Colors.error} />
                      )}
                    </View>
                    <Text style={[
                      styles.flowValue,
                      { color: isInflow ? Colors.success : Colors.error }
                    ]}>
                      {isInflow ? '+' : '-'} R$ {item.value.toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 24,
    borderRadius: 24,
    elevation: 4,
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 8,
    fontWeight: '600' as const,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 20,
    letterSpacing: -1,
  },
  balanceDivider: {
    height: 1,
    backgroundColor: Colors.white,
    opacity: 0.25,
    marginVertical: 16,
  },
  projectionRow: {
    flexDirection: 'row',
  },
  projectionItem: {
    flex: 1,
  },
  projectionDivider: {
    width: 1,
    backgroundColor: Colors.white,
    opacity: 0.25,
    marginHorizontal: 16,
  },
  projectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  projectionLabel: {
    fontSize: 11,
    color: Colors.white,
    opacity: 0.85,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  projectionValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  projectedBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectedBalanceLabel: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '600' as const,
  },
  projectedBalanceValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  flowCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  flowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  flowDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
  },
  flowDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  flowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flowInfo: {
    flex: 1,
    marginRight: 12,
  },
  flowDescription: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  flowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flowCategory: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  flowOperation: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  flowValueContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  flowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
});
