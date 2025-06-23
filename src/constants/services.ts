export type ServiceId = 
  | 'CORTE_DE_CABELO'
  | 'BARBA'
  | 'SOBRANCELHA'
  | 'HIDRATACAO'
  | 'LUZES';

export interface Service {
  id: ServiceId;
  label: string;
}

export const AVAILABLE_SERVICES: Service[] = [
  { id: 'CORTE_DE_CABELO', label: 'Corte de Cabelo' },
  { id: 'BARBA', label: 'Barba' },
  { id: 'SOBRANCELHA', label: 'Sobrancelha' },
  { id: 'HIDRATACAO', label: 'Hidratação' },
  { id: 'LUZES', label: 'Luzes' }
];

export const getServiceLabel = (service: ServiceId): string => {
  const labels: Record<ServiceId, string> = {
    'CORTE_DE_CABELO': 'Corte de Cabelo',
    'BARBA': 'Barba',
    'SOBRANCELHA': 'Sobrancelha',
    'HIDRATACAO': 'Hidratação',
    'LUZES': 'Luzes'
  };
  return labels[service];
}; 