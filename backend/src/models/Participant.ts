export interface Participant {
  id: number;
  name: string;
  city: string;
  state: string;
  email: string;
  whatsapp: string;
  contribuicao: boolean;
  alojamento: boolean;
  tipoInscricao: 'comunicacao' | 'organizacao' | 'parlamentar' | 'participante';
  credenciada: boolean;
  credenciada_em?: string;
  credencial?: string;
  wristband_id?: string;
  meals?: any[];
}
