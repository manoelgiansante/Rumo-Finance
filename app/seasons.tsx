import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Plus,
  Target,
  DollarSign,
  X,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { router, Stack } from 'expo-router';

export default function SeasonsScreen() {
  const isWeb = Platform.OS === 'web';

  const [seasons, setSeasons] = useState<
    {
      id: string;
      name: string;
      crop: string;
      status: 'active' | 'planning' | 'completed';
      area: number;
      budgetedCost: number;
      actualCost: number;
      budgetedRevenue: number;
      actualRevenue: number;
      variance: number;
      expectedYield: number;
      actualYield: number;
    }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    crop: '',
    area: '',
    budgetedCost: '',
    budgetedRevenue: '',
    expectedYield: '',
    status: 'planning' as 'active' | 'planning' | 'completed',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      crop: '',
      area: '',
      budgetedCost: '',
      budgetedRevenue: '',
      expectedYield: '',
      status: 'planning' as 'active' | 'planning' | 'completed',
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Informe o nome da safra.');
      return;
    }
    if (!formData.crop.trim()) {
      Alert.alert('Erro', 'Informe a cultura.');
      return;
    }
    const newSeason = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      crop: formData.crop.trim(),
      status: formData.status,
      area: parseFloat(formData.area) || 0,
      budgetedCost: parseFloat(formData.budgetedCost) || 0,
      actualCost: 0,
      budgetedRevenue: parseFloat(formData.budgetedRevenue) || 0,
      actualRevenue: 0,
      variance: 0,
      expectedYield: parseFloat(formData.expectedYield) || 0,
      actualYield: 0,
    };
    setSeasons((prev) => [...prev, newSeason]);
    setModalVisible(false);
    resetForm();
    Alert.alert('Sucesso', 'Safra adicionada com sucesso!');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Excluir Safra', 'Tem certeza que deseja excluir esta safra?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => setSeasons((prev) => prev.filter((s) => s.id !== id)),
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') return Colors.success;
    if (status === 'planning') return Colors.warning;
    if (status === 'completed') return Colors.info;
    return Colors.textSecondary;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'active') return 'Em andamento';
    if (status === 'planning') return 'Planejamento';
    if (status === 'completed') return 'Concluída';
    return 'Cancelada';
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Safras & Orçamento', headerShown: true }} />
      <SafeAreaView style={styles.safeArea} edges={isWeb ? [] : ['bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Todas as Safras</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Plus size={18} color={Colors.white} />
              <Text style={styles.addButtonText}>Nova Safra</Text>
            </TouchableOpacity>
          </View>

          {seasons.length === 0 && (
            <View style={styles.emptyState}>
              <Calendar size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>Nenhuma safra cadastrada</Text>
              <Text style={styles.emptySubtitle}>
                Toque em &quot;Nova Safra&quot; para adicionar sua primeira safra.
              </Text>
            </View>
          )}

          {seasons.map((season) => {
            const budgetVariance =
              season.actualCost > 0
                ? ((season.actualCost - season.budgetedCost) / season.budgetedCost) * 100
                : 0;
            const isOverBudget = budgetVariance > 5;

            return (
              <TouchableOpacity
                key={season.id}
                style={styles.seasonCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/season-details?id=${season.id}` as any)}
                onLongPress={() => handleDelete(season.id)}
              >
                <View style={styles.seasonHeader}>
                  <View style={styles.seasonTitle}>
                    <Calendar size={20} color={Colors.primary} />
                    <Text style={styles.seasonName}>{season.name}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(season.status) + '20' },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(season.status) }]}>
                      {getStatusLabel(season.status)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.areaText}>
                  {season.area} ha • {season.crop}
                </Text>

                <View style={styles.divider} />

                <View style={styles.budgetSection}>
                  <Text style={styles.sectionTitle}>Orçamento vs Realizado</Text>

                  <View style={styles.budgetRow}>
                    <View style={styles.budgetItem}>
                      <Text style={styles.budgetLabel}>Custos</Text>
                      <View style={styles.budgetValues}>
                        <Text style={styles.budgetActual}>
                          R${' '}
                          {season.actualCost > 0 ? season.actualCost.toLocaleString('pt-BR') : '-'}
                        </Text>
                        <Text style={styles.budgetPlanned}>
                          / R$ {season.budgetedCost.toLocaleString('pt-BR')}
                        </Text>
                      </View>
                      {season.actualCost > 0 && (
                        <View style={styles.varianceContainer}>
                          {isOverBudget ? (
                            <TrendingUp size={12} color={Colors.error} />
                          ) : (
                            <TrendingDown size={12} color={Colors.success} />
                          )}
                          <Text
                            style={[
                              styles.varianceText,
                              {
                                color: isOverBudget ? Colors.error : Colors.success,
                              },
                            ]}
                          >
                            {budgetVariance > 0 ? '+' : ''}
                            {budgetVariance.toFixed(1)}%
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.budgetItem}>
                      <Text style={styles.budgetLabel}>Receitas</Text>
                      <View style={styles.budgetValues}>
                        <Text style={[styles.budgetActual, { color: Colors.success }]}>
                          R${' '}
                          {season.actualRevenue > 0
                            ? season.actualRevenue.toLocaleString('pt-BR')
                            : '-'}
                        </Text>
                        <Text style={styles.budgetPlanned}>
                          / R$ {season.budgetedRevenue.toLocaleString('pt-BR')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <Target size={16} color={Colors.textSecondary} />
                    <Text style={styles.metricLabel}>Produtividade Esperada</Text>
                    <Text style={styles.metricValue}>{season.expectedYield} sc/ha</Text>
                  </View>
                  {season.actualYield > 0 && (
                    <View style={styles.metricItem}>
                      <DollarSign size={16} color={Colors.success} />
                      <Text style={styles.metricLabel}>Produtividade Real</Text>
                      <Text style={[styles.metricValue, { color: Colors.success }]}>
                        {season.actualYield} sc/ha
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Nova Safra</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                  >
                    <X size={24} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.inputLabel}>Nome da Safra *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Safra 2025/26"
                    placeholderTextColor={Colors.textSecondary}
                    value={formData.name}
                    onChangeText={(t) => setFormData({ ...formData, name: t })}
                  />

                  <Text style={styles.inputLabel}>Cultura *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Soja"
                    placeholderTextColor={Colors.textSecondary}
                    value={formData.crop}
                    onChangeText={(t) => setFormData({ ...formData, crop: t })}
                  />

                  <Text style={styles.inputLabel}>Área (ha)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    value={formData.area}
                    onChangeText={(t) => setFormData({ ...formData, area: t })}
                  />

                  <Text style={styles.inputLabel}>Custo Orçado (R$)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    value={formData.budgetedCost}
                    onChangeText={(t) => setFormData({ ...formData, budgetedCost: t })}
                  />

                  <Text style={styles.inputLabel}>Receita Orçada (R$)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    value={formData.budgetedRevenue}
                    onChangeText={(t) => setFormData({ ...formData, budgetedRevenue: t })}
                  />

                  <Text style={styles.inputLabel}>Produtividade Esperada (sc/ha)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    value={formData.expectedYield}
                    onChangeText={(t) => setFormData({ ...formData, expectedYield: t })}
                  />

                  <Text style={styles.inputLabel}>Status</Text>
                  <View style={styles.statusRow}>
                    {(['planning', 'active', 'completed'] as const).map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.statusOption,
                          formData.status === s && styles.statusOptionActive,
                        ]}
                        onPress={() => setFormData({ ...formData, status: s })}
                      >
                        <Text
                          style={[
                            styles.statusOptionText,
                            formData.status === s && styles.statusOptionTextActive,
                          ]}
                        >
                          {s === 'planning'
                            ? 'Planejamento'
                            : s === 'active'
                              ? 'Em andamento'
                              : 'Concluída'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setModalVisible(false);
                        resetForm();
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  seasonCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seasonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  seasonName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  areaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  budgetSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  budgetRow: {
    gap: 16,
  },
  budgetItem: {
    gap: 6,
  },
  budgetLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  budgetValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  budgetActual: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  budgetPlanned: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  varianceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  varianceText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    gap: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  emptyState: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    maxWidth: 260,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center' as const,
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    maxHeight: '85%' as any,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusRow: {
    flexDirection: 'row' as const,
    gap: 8,
    marginTop: 4,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center' as const,
  },
  statusOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  statusOptionTextActive: {
    color: Colors.white,
  },
  modalButtons: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center' as const,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center' as const,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.white,
  },
});
