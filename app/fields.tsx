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
import { MapPin, TrendingUp, Sprout, Plus, ChevronRight, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { router, Stack } from 'expo-router';

type FieldItem = {
  id: string;
  name: string;
  area: number;
  crop: string;
  grossMargin: number;
  marginPerHa: number;
  status: 'active' | 'planning' | 'inactive';
  roi: number;
};

export default function FieldsScreen() {
  const isWeb = Platform.OS === 'web';

  const [fields, setFields] = useState<FieldItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    crop: '',
    status: 'active' as 'active' | 'planning' | 'inactive',
  });

  const totalArea = fields.reduce((acc, f) => acc + f.area, 0);
  const totalMargin = fields.reduce((acc, f) => acc + f.grossMargin, 0);
  const avgMarginPerHa = totalArea > 0 ? totalMargin / totalArea : 0;

  const resetForm = () => {
    setFormData({ name: '', area: '', crop: '', status: 'active' });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do talhão.');
      return;
    }
    if (!formData.area.trim() || isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
      Alert.alert('Campo obrigatório', 'Informe uma área válida.');
      return;
    }
    const newField: FieldItem = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      area: Number(formData.area),
      crop: formData.crop.trim() || 'Não definida',
      grossMargin: 0,
      marginPerHa: 0,
      status: formData.status,
      roi: 0,
    };
    setFields((prev) => [...prev, newField]);
    resetForm();
    setModalVisible(false);
  };

  const handleDelete = (field: FieldItem) => {
    Alert.alert('Excluir Talhão', `Deseja realmente excluir "${field.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => setFields((prev) => prev.filter((f) => f.id !== field.id)),
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') return Colors.success;
    if (status === 'planning') return Colors.warning;
    return Colors.textSecondary;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'active') return 'Em produção';
    if (status === 'planning') return 'Planejamento';
    return 'Inativo';
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Talhões & Rentabilidade', headerShown: true }} />
      <SafeAreaView style={styles.safeArea} edges={isWeb ? [] : ['bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo de Rentabilidade</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Área Total</Text>
                <Text style={styles.summaryValue}>{totalArea} ha</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Margem Bruta Total</Text>
                <Text style={[styles.summaryValue, { color: Colors.success }]}>
                  R$ {totalMargin.toLocaleString('pt-BR')}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Margem/ha Média</Text>
                <Text style={[styles.summaryValue, { color: Colors.primary }]}>
                  R$ {avgMarginPerHa.toFixed(0)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Todos os Talhões</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Plus size={18} color={Colors.white} />
              <Text style={styles.addButtonText}>Novo Talhão</Text>
            </TouchableOpacity>
          </View>

          {fields.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <MapPin size={64} color={Colors.textTertiary} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: Colors.textSecondary,
                  marginTop: 16,
                }}
              >
                Nenhum talhão cadastrado
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.textTertiary,
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                Adicione seus talhões para acompanhar rentabilidade
              </Text>
            </View>
          )}

          {fields.map((field) => (
            <TouchableOpacity
              key={field.id}
              style={styles.fieldCard}
              activeOpacity={0.7}
              onPress={() => router.push(`/field-details?id=${field.id}` as any)}
              onLongPress={() => handleDelete(field)}
            >
              <View style={styles.fieldHeader}>
                <View style={styles.fieldTitle}>
                  <MapPin size={20} color={Colors.primary} />
                  <Text style={styles.fieldName}>{field.name}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(field.status) + '20' },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(field.status) }]}>
                      {getStatusLabel(field.status)}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </View>

              <View style={styles.fieldInfo}>
                <View style={styles.infoItem}>
                  <Sprout size={16} color={Colors.textSecondary} />
                  <Text style={styles.infoLabel}>{field.crop}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoValue}>{field.area} ha</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Margem Bruta</Text>
                  <Text style={[styles.metricValue, { color: Colors.success }]}>
                    R$ {field.grossMargin.toLocaleString('pt-BR')}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Margem/ha</Text>
                  <Text style={[styles.metricValue, { color: Colors.primary }]}>
                    R$ {field.marginPerHa.toLocaleString('pt-BR')}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>ROI</Text>
                  <View style={styles.roiContainer}>
                    <TrendingUp size={14} color={Colors.success} />
                    <Text style={[styles.metricValue, { color: Colors.success, fontSize: 16 }]}>
                      {field.roi}%
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Modal para adicionar talhão */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            resetForm();
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, Platform.OS === 'web' && styles.modalContentWeb]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Novo Talhão</Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                  style={styles.closeButton}
                >
                  <X size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Nome */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Nome *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Ex: Talhão Norte"
                    placeholderTextColor={Colors.textTertiary}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                  />
                </View>

                {/* Área */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Área (ha) *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Ex: 120"
                    placeholderTextColor={Colors.textTertiary}
                    value={formData.area}
                    onChangeText={(text) => setFormData({ ...formData, area: text })}
                    keyboardType="numeric"
                  />
                </View>

                {/* Cultura */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Cultura</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Ex: Soja, Milho"
                    placeholderTextColor={Colors.textTertiary}
                    value={formData.crop}
                    onChangeText={(text) => setFormData({ ...formData, crop: text })}
                  />
                </View>

                {/* Status */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Status</Text>
                  <View style={styles.typeSelector}>
                    <TouchableOpacity
                      style={[
                        styles.typeOption,
                        formData.status === 'active' && styles.typeOptionActive,
                      ]}
                      onPress={() => setFormData({ ...formData, status: 'active' })}
                    >
                      <Text
                        style={[
                          styles.typeOptionText,
                          formData.status === 'active' && styles.typeOptionTextActive,
                        ]}
                      >
                        Ativo
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeOption,
                        formData.status === 'planning' && styles.typeOptionActive,
                      ]}
                      onPress={() => setFormData({ ...formData, status: 'planning' })}
                    >
                      <Text
                        style={[
                          styles.typeOptionText,
                          formData.status === 'planning' && styles.typeOptionTextActive,
                        ]}
                      >
                        Planejamento
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeOption,
                        formData.status === 'inactive' && styles.typeOptionActive,
                      ]}
                      onPress={() => setFormData({ ...formData, status: 'inactive' })}
                    >
                      <Text
                        style={[
                          styles.typeOptionText,
                          formData.status === 'inactive' && styles.typeOptionTextActive,
                        ]}
                      >
                        Inativo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ height: 20 }} />
              </ScrollView>

              <View style={styles.modalFooter}>
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
            </View>
          </View>
        </Modal>
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
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 20,
  },
  summaryGrid: {
    gap: 16,
  },
  summaryItem: {
    gap: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.white,
    opacity: 0.85,
    fontWeight: '500' as const,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.white,
    letterSpacing: -0.5,
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
  fieldCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  fieldName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
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
  fieldInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500' as const,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  roiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalContentWeb: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 24,
    marginBottom: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  typeOptionTextActive: {
    color: Colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
});
