import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, AlertTriangle, Trash2, Mail, CheckCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

export default function ExcluirContaScreen() {
  const insets = useSafeAreaInsets();
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRequestDeletion = () => {
    if (!confirmEmail.includes('@')) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    if (confirmText.toLowerCase() !== 'excluir minha conta') {
      Alert.alert('Erro', 'Por favor, digite "EXCLUIR MINHA CONTA" para confirmar.');
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      'Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos em até 30 dias. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, Excluir',
          style: 'destructive',
          onPress: submitDeletionRequest,
        },
      ]
    );
  };

  const submitDeletionRequest = async () => {
    setIsSubmitting(true);

    // Simula envio da solicitação
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:dpo@agrofinance.app?subject=Solicitação de Exclusão de Conta');
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Exclusão de Conta',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.successContainer}>
          <CheckCircle size={80} color={Colors.primary} />
          <Text style={styles.successTitle}>Solicitação Enviada</Text>
          <Text style={styles.successText}>
            Sua solicitação de exclusão de conta foi recebida com sucesso.{'\n\n'}
            Você receberá um e-mail de confirmação em breve. O processo de exclusão será concluído
            em até 30 dias, conforme previsto na LGPD.{'\n\n'}
            Caso mude de ideia, entre em contato conosco antes do prazo.
          </Text>
          <TouchableOpacity style={styles.supportButton} onPress={handleEmailSupport}>
            <Mail size={20} color={Colors.primary} />
            <Text style={styles.supportButtonText}>Contatar Suporte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backHomeButton} onPress={() => router.replace('/')}>
            <Text style={styles.backHomeText}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Exclusão de Conta',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      >
        <View style={styles.warningCard}>
          <AlertTriangle size={32} color={Colors.error} />
          <Text style={styles.warningTitle}>Atenção: Ação Irreversível</Text>
          <Text style={styles.warningText}>
            A exclusão da sua conta é permanente e não pode ser desfeita. Todos os seus dados serão
            removidos dos nossos sistemas.
          </Text>
        </View>

        <Section title="O que será excluído">
          <Text style={styles.text}>
            Ao solicitar a exclusão da sua conta, os seguintes dados serão permanentemente
            removidos:{'\n\n'}• Dados de perfil (nome, e-mail, telefone){'\n'}• Informações das suas
            fazendas e operações{'\n'}• Registros financeiros (despesas, receitas, contratos){'\n'}•
            Dados de estoque e inventário{'\n'}• Documentos fiscais emitidos{'\n'}• Relatórios e
            análises geradas{'\n'}• Configurações e preferências{'\n'}• Histórico de atividades
          </Text>
        </Section>

        <Section title="Dados retidos por obrigação legal">
          <Text style={styles.text}>
            Alguns dados podem ser mantidos pelo prazo legal exigido pela legislação brasileira:
            {'\n\n'}• Documentos fiscais: 5 anos (Lei 9.430/96){'\n'}• Registros contábeis: 5 anos
            (Código Civil){'\n'}• Dados para defesa em processos judiciais{'\n\n'}
            Após o prazo legal, esses dados também serão excluídos.
          </Text>
        </Section>

        <Section title="Prazo de exclusão">
          <Text style={styles.text}>
            Conforme a Lei Geral de Proteção de Dados (LGPD), sua solicitação será processada em até
            30 dias corridos.{'\n\n'}
            Durante esse período, você pode cancelar a solicitação entrando em contato com nosso
            suporte.
          </Text>
        </Section>

        <Section title="Alternativas à exclusão">
          <Text style={styles.text}>
            Antes de excluir sua conta, considere estas alternativas:{'\n\n'}•{' '}
            <Text style={styles.bold}>Exportar dados:</Text> Baixe uma cópia de todos os seus dados
            antes da exclusão{'\n\n'}• <Text style={styles.bold}>Desativar conta:</Text> Suspenda
            temporariamente o acesso sem perder dados{'\n\n'}•{' '}
            <Text style={styles.bold}>Contatar suporte:</Text> Podemos ajudar a resolver qualquer
            problema
          </Text>
        </Section>

        <View style={styles.divider} />

        <Section title="Solicitar Exclusão">
          <Text style={styles.fieldLabel}>E-mail da conta *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o e-mail cadastrado"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.fieldLabel}>Motivo da exclusão (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Conte-nos por que está saindo..."
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.fieldLabel}>
            Digite &quot;EXCLUIR MINHA CONTA&quot; para confirmar *
          </Text>
          <TextInput
            style={styles.input}
            placeholder="EXCLUIR MINHA CONTA"
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="characters"
          />

          <TouchableOpacity
            style={[styles.deleteButton, isSubmitting && styles.deleteButtonDisabled]}
            onPress={handleRequestDeletion}
            disabled={isSubmitting}
          >
            <Trash2 size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>
              {isSubmitting ? 'Processando...' : 'Solicitar Exclusão da Conta'}
            </Text>
          </TouchableOpacity>
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Precisa de ajuda? Entre em contato com nosso DPO:</Text>
          <TouchableOpacity onPress={handleEmailSupport}>
            <Text style={styles.link}>dpo@agrofinance.app</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.error,
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#7F1D1D',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
  bold: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.error,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    textAlign: 'center',
    marginBottom: 32,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    marginBottom: 16,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  backHomeButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  backHomeText: {
    fontSize: 16,
    color: '#666',
  },
});
