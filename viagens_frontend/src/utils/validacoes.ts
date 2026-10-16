// Valida se tem pelo menos Nome e Sobrenome, cada um com no mínimo 3 caracteres
export const validarNomeCompleto = (nome: string): boolean => {
  const partes = nome.trim().split(/\s+/);
  if (partes.length < 2) return false;
  return partes.every(parte => parte.length >= 3);
};

// Validação padrão de formato de email (algo@algo.algo)
export const validarEmail = (email: string): boolean => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email.trim());
};

// Máscara dinâmica para telefone brasileiro enquanto digita: (54) 99172-2982
export const mascaraTelefoneBR = (valor: string): string => {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 11);

  if (apenasNumeros.length <= 2) {
    return apenasNumeros ? `(${apenasNumeros}` : '';
  }
  if (apenasNumeros.length <= 6) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
  }
  if (apenasNumeros.length <= 10) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
  }
  return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
};

// Valida se o telefone tem 10 dígitos (fixo) ou 11 dígitos (celular)
export const validarTelefone = (telefone: string): boolean => {
  const apenasNumeros = telefone.replace(/\D/g, '');
  return apenasNumeros.length === 10 || apenasNumeros.length === 11;
};




// Valida se o título tem no mínimo 5 caracteres
export const validarTituloPacote = (titulo: string): boolean => {
  return titulo.trim().length >= 5;
};

// Valida se o preço é um número válido e maior que zero
export const validarPreco = (preco: string | number): boolean => {
  const valor = Number(preco);
  return !isNaN(valor) && valor > 0;
};

// Valida se a data de embarque não está no passado
export const validarDataEmbarque = (data: string): boolean => {
  if (!data) return false;
  
  // Cria a data comparando apenas ano-mês-dia (sem fuso horário)
  const [ano, mes, dia] = data.split('-').map(Number);
  const dataSelecionada = new Date(ano, mes - 1, dia);
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return dataSelecionada >= hoje;
};

// Retorna a data de hoje no formato YYYY-MM-DD para o atributo "min" do input date
export const obterDataMinimaHoje = (): string => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

// Valida se o número de vagas é maior que zero
export const validarVagas = (vagas: number): boolean => {
  return Number.isInteger(vagas) && vagas >= 1;
};