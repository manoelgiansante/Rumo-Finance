import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogOut, Shield, LogIn, Crown, Settings } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { Stack, router } from 'expo-router';

export default function ProfileScreen() {
  const {
    user,
    profile,
    signOut,
    isAuthenticated,
    subscription,
    isPremium,
    isTrial,
    trialDaysRemaining,
  } = useAuth();

  const handleLogout = async () => {
    const doLogout = async () => {
      try {
        await signOut();
        router.replace('/login');
      } catch (error) {
        console.error('Erro ao sair:', error);
      }
    };

    if (Platform.OS === 'web') {
      if (confirm('Deseja sair da sua conta?')) {
        doLogout();
      }
    } else {
      Alert.alert('Sair da conta', 'Deseja sair da sua conta?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSubscription = () => {
    router.push('/subscription');
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'field':
        return 'Campo';
      case 'approver':
        return 'Aprovador';
      case 'financial':
        return 'Financeiro';
      case 'accountant':
        return 'Contador';
      case 'auditor':
        return 'Auditor';
      default:
        return 'Usuário';
    }
  };

  const getPlanLabel = () => {
    if (!subscription) return 'Gratuito';
    switch (subscription.plan) {
      case 'starter':
        return 'Básico';
      case 'professional':
        return 'Profissional';
      case 'enterprise':
        return 'Empresarial';
      default:
        return 'Gratuito';
    }
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const displayEmail = user?.email || profile?.email || 'Não logado';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Meu Perfil',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textPrimary,
          headerShadowVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, !isAuthenticated && styles.avatarInactive]}>
              <User size={40} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>

          {isAuthenticated ? (
            <View style={styles.roleBadge}>
              <Shield size={14} color={Colors.primary} />
              <Text style={styles.roleText}>{getRoleLabel()}</Text>
            </View>
          ) : (
            <View style={[styles.roleBadge, { backgroundColor: Colors.warning + '18' }]}>
              <Text style={[styles.roleText, { color: Colors.warning }]}>Modo Offline</Text>
            </View>
          )}
        </View>

        {/* Assinatura */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assinatura</Text>
          <TouchableOpacity
            style={styles.subscriptionCard}
            onPress={handleSubscription}
            activeOpacity={0.7}
          >
            <View style={styles.subscriptionHeader}>
              <Crown size={24} color={isPremium ? Colors.warning : Colors.textTertiary} />
              <View style={styles.subscriptionInfo}>
                <Text style={styles.subscriptionPlan}>{getPlanLabel()}</Text>
                {isTrial && (
                  <Text style={styles.subscriptionTrial}>
                    {trialDaysRemaining()} dias restantes de teste
                  </Text>
                )}
                {isPremium && <Text style={styles.subscriptionActive}>Ativo</Text>}
              </View>
            </View>
            <Text style={styles.subscriptionAction}>
              {isPremium ? 'Gerenciar' : 'Fazer Upgrade →'}
            </Text>
          </TouchableOpacity>
        </View>

        {isAuthenticated && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nome Completo</Text>
                <Text style={styles.infoValue}>{displayName}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValue}>{displayEmail}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Plano</Text>
                <Text style={styles.infoValue}>{getPlanLabel()}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          {isAuthenticated ? (
            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <LogOut size={20} color={Colors.error} />
              <Text style={styles.logoutText}>Sair da Conta</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginButton} activeOpacity={0.7} onPress={handleLogin}>
              <LogIn size={20} color={Colors.white} />
              <Text style={styles.loginText}>Fazer Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 28,
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInactive: {
    backgroundColor: Colors.textTertiary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: Colors.primary + '18',
    borderRadius: 22,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.error,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  subscriptionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionPlan: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  subscriptionTrial: {
    fontSize: 13,
    color: Colors.warning,
    marginTop: 2,
  },
  subscriptionActive: {
    fontSize: 13,
    color: Colors.success,
    marginTop: 2,
  },
  subscriptionAction: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    textAlign: 'right',
  },
});
