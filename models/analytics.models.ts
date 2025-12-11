export interface analyticsEvent {
  id: string;
  tipo_evento: 'view' | 'submission' | 'approval' | 'rejection' | 'consent_given' | 'consent_revoked';
  testimonio_id?: string;
  testimonio?: string;
  ip?: string;
  user_agent?: string;
  referrer?: string;
  fecha_hora: string;
  created_at: string;
}