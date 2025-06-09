export interface Turma {
  id: number;
  nome: string;
  idade_minima: number;
  idade_maxima: number;
  ativo: boolean;
}

export interface Membro {
  id: number;
  nome: string;
  data_nascimento: string;
  sexo: string;
  familia: Familia;
  idade: number;
  foto_3x4?: string;
  declaracao_matricula?: string;
}

export interface Familia {
  id: number;
  nome: string;
  responsaveis: Responsavel[];
  programas_sociais?: string;
  ultima_entrega?: string;
}

export interface Responsavel {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

export interface Presenca {
  id: number;
  membro: Membro;
  data: string;
  presente: boolean;
  turma?: Turma;
}

export interface EntregaDeCesta {
  id: number;
  familia: Familia;
  data_entrega: string;
  observacoes?: string;
}

export interface FrequenciaReport {
  frequencia: Array<{
    membro__nome: string;
    membro__familia__nome: string;
    total_presencas: number;
    total_encontros: number;
    percentual_presenca: number;
  }>;
  statistics: {
    media_presenca: number;
  };
}

export interface CestasReport {
  cestas: Array<{
    mes: number;
    ano: number;
    total_entregas: number;
    total_familias: number;
    media_por_familia: number;
  }>;
  statistics: {
    total_entregas: number;
    media_entregas_por_mes: number;
  };
}

export interface TamanhosReport {
  distribuicao: {
    calcoes: Array<{
      tamanho: string;
      quantidade: number;
    }>;
    calcas: Array<{
      tamanho: string;
      quantidade: number;
    }>;
    blusas: Array<{
      tamanho: string;
      quantidade: number;
    }>;
  };
  statistics: {
    total_membros: number;
    total_calcoes: number;
    total_calcas: number;
    total_blusas: number;
  };
}

export interface ProgramasReport {
  programas: Array<{
    programas_sociais: string;
    total_familias: number;
    percentual: number;
  }>;
  statistics: {
    total_familias: number;
    total_com_programas: number;
    percentual_com_programas: number;
  };
}

export interface PresencaFormData {
  turma_id: number | null;
  data: Date | null;
}

export interface EntregaCestaFormData {
  familia_id: number | null;
  data_entrega: Date | null;
  observacoes: string;
}
