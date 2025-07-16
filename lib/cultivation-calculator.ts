export interface SetupParams {
  area_m2: number
  custo_equip_iluminacao: number
  custo_tenda_estrutura: number
  custo_ventilacao_exaustao: number
  custo_outros_equipamentos: number
}

export interface CycleParams {
  potencia_watts: number
  num_plantas: number
  producao_por_planta_g: number
  dias_vegetativo: number
  horas_luz_veg: number
  dias_floracao: number
  horas_luz_flor: number
  dias_secagem_cura: number
}

export interface MarketParams {
  preco_kwh: number
  custo_sementes_clones: number
  custo_substrato: number
  custo_nutrientes: number
  custos_operacionais_misc: number
  preco_venda_por_grama: number
}

export interface CalculationResults {
  custo_total_investimento: number
  custo_operacional_total_ciclo: number
  receita_bruta_ciclo: number
  lucro_liquido_ciclo: number
  custo_por_grama: number
  gramas_por_watt: number
  gramas_por_m2: number
  periodo_payback_ciclos: number
  roi_investimento_1_ano: number
  duracao_total_ciclo: number
  detalhe_custos_operacionais: Record<string, number>
}

export function calculateResults(setup: SetupParams, cycle: CycleParams, market: MarketParams): CalculationResults {
  // Custos de Investimento
  const custo_total_investimento =
    setup.custo_equip_iluminacao +
    setup.custo_tenda_estrutura +
    setup.custo_ventilacao_exaustao +
    setup.custo_outros_equipamentos

  // Custos Operacionais por Ciclo
  const consumo_kwh_veg = (cycle.potencia_watts / 1000) * cycle.horas_luz_veg * cycle.dias_vegetativo
  const consumo_kwh_flor = (cycle.potencia_watts / 1000) * cycle.horas_luz_flor * cycle.dias_floracao
  const custo_energia = (consumo_kwh_veg + consumo_kwh_flor) * market.preco_kwh

  const detalhe_custos_operacionais = {
    "Energia Elétrica": custo_energia,
    "Sementes/Clones": market.custo_sementes_clones,
    Substrato: market.custo_substrato,
    Nutrientes: market.custo_nutrientes,
    "Outros Custos": market.custos_operacionais_misc,
  }

  const custo_operacional_total_ciclo = Object.values(detalhe_custos_operacionais).reduce((a, b) => a + b, 0)

  // Produção e Receita por Ciclo
  const producao_total_g = cycle.num_plantas * cycle.producao_por_planta_g
  const receita_bruta_ciclo = producao_total_g * market.preco_venda_por_grama
  const lucro_liquido_ciclo = receita_bruta_ciclo - custo_operacional_total_ciclo

  // Métricas de Eficiência e Negócio
  const custo_por_grama = producao_total_g > 0 ? custo_operacional_total_ciclo / producao_total_g : 0
  const gramas_por_watt = cycle.potencia_watts > 0 ? producao_total_g / cycle.potencia_watts : 0
  const gramas_por_m2 = setup.area_m2 > 0 ? producao_total_g / setup.area_m2 : 0

  // Análise de Payback e ROI
  const duracao_total_ciclo = cycle.dias_vegetativo + cycle.dias_floracao + cycle.dias_secagem_cura
  const periodo_payback_ciclos =
    lucro_liquido_ciclo > 0 ? custo_total_investimento / lucro_liquido_ciclo : Number.POSITIVE_INFINITY
  const ciclos_por_ano = 365 / duracao_total_ciclo
  const lucro_anual = lucro_liquido_ciclo * ciclos_por_ano
  const roi_investimento_1_ano =
    custo_total_investimento > 0 ? ((lucro_anual - custo_total_investimento) / custo_total_investimento) * 100 : 0

  return {
    custo_total_investimento,
    custo_operacional_total_ciclo,
    receita_bruta_ciclo,
    lucro_liquido_ciclo,
    custo_por_grama,
    gramas_por_watt,
    gramas_por_m2,
    periodo_payback_ciclos,
    roi_investimento_1_ano,
    duracao_total_ciclo,
    detalhe_custos_operacionais,
  }
}
