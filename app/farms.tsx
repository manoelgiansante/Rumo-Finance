import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Search, MapPin, Ruler, MoreVertical, Edit, Trash2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import { router } from "expo-router";
import { useState } from "react";
import { useApp } from "@/providers/AppProvider";

interface Farm {
  id: string;
  name: string;
  location: string;
  size: number; // hectares
  active: boolean;
}

export default function FarmsScreen() {
  const { farms = [] } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data para demonstração
  const mockFarms: Farm[] = [
    { id: '1', name: 'Fazenda Santa Maria', location: 'Ribeirão Preto - SP', size: 850, active: true },
    { id: '2', name: 'Fazenda São José', location: 'Uberaba - MG', size: 1200, active: true },
    { id: '3', name: 'Sítio Boa Vista', location: 'Piracicaba - SP', size: 120, active: true },
  ];

  const displayFarms = farms.length > 0 ? farms : mockFarms;

  const filteredFarms = displayFarms.filter(farm => 
    farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalArea = displayFarms.reduce((sum, f) => sum + (f.size || 0), 0);
  const isWeb = Platform.OS === 'web';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={isWeb ? [] : ['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Fazendas</Text>
            <Text style={styles.subtitle}>{displayFarms.length} propriedades • {totalArea.toLocaleString('pt-BR')} ha</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {/* TODO: Adicionar fazenda */}}
            activeOpacity={0.7}
          >
            <Plus size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: Colors.primary, borderLeftWidth: 4 }]}>
            <Text style={styles.statLabel}>Propriedades</Text>
            <Text style={[styles.statValue, { color: Colors.primary }]}>{displayFarms.length}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Colors.success, borderLeftWidth: 4 }]}>
            <Text style={styles.statLabel}>Área Total</Text>
            <Text style={[styles.statValue, { color: Colors.success }]}>{totalArea.toLocaleString('pt-BR')} ha</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar fazendas..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
          {filteredFarms.map((farm) => (
            <TouchableOpacity 
              key={farm.id}
              style={styles.farmCard}
              activeOpacity={0.7}
            >
              <View style={styles.farmIcon}>
                <MapPin size={24} color={Colors.primary} />
              </View>
              <View style={styles.farmInfo}>
                <Text style={styles.farmName}>{farm.name}</Text>
                <Text style={styles.farmLocation}>{farm.location}</Text>
                <View style={styles.farmMeta}>
                  <Ruler size={14} color={Colors.textSecondary} />
                  <Text style={styles.farmSize}>{farm.size.toLocaleString('pt-BR')} hectares</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreVertical size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {filteredFarms.length === 0 && (
            <View style={styles.emptyState}>
              <MapPin size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>Nenhuma fazenda encontrada</Text>
              <Text style={styles.emptySubtitle}>Adicione sua primeira propriedade</Text>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  list: {
    flex: 1,
    paddingHorizontal: 24,
  },
  farmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  farmIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  farmLocation: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  farmMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  farmSize: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  moreButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
