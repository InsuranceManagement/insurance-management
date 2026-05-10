export const seedData = {
  productType: [
    {
      id: 'VIDA_QUALQUER_CAUSA',
      name: 'Vida Qualquer Causa',
      description: 'Seguro de vida por qualquer causa',
    },
    { id: 'MORTE_ACIDENTAL', name: 'Morte Acidental', description: 'Seguro por morte acidental' },
    {
      id: 'INVALIDEZ_PERMANENTE_ACIDENTE',
      name: 'Invalidez Permanente por Acidente',
      description: 'Seguro de invalidez permanente por acidente',
    },
    {
      id: 'IPA_MAJORADA',
      name: 'IPA Majorada',
      description: 'Invalidez permanente por acidente majorada',
    },
    {
      id: 'DIARIA_INCAPACIDADE_TEMPORARIA',
      name: 'Diária por Incapacidade Temporária',
      description: 'Seguro de diária por incapacidade temporária',
    },
    { id: 'DOENCAS_GRAVES', name: 'Doenças Graves', description: 'Seguro para doenças graves' },
    { id: 'CIRURGIAS', name: 'Cirurgias', description: 'Seguro para cirurgias' },
    { id: 'DIH_UTI', name: 'DIH e UTI', description: 'Diária de internação hospitalar e UTI' },
    {
      id: 'SAF_INDIVIDUAL',
      name: 'SAF Individual',
      description: 'Seguro de acidentes familiares individual',
    },
    { id: 'SAF_FAMILIAR', name: 'SAF Familiar', description: 'Seguro de acidentes familiares' },
    {
      id: 'RESPONSABILIDADE_CIVIL',
      name: 'Responsabilidade Civil',
      description: 'Seguro de responsabilidade civil',
    },
    {
      id: 'SEGURANCA_EXCLUSIVA',
      name: 'Segurança Exclusiva',
      description: 'Seguro de segurança exclusiva',
    },
    { id: 'EMPRESARIAL', name: 'Empresarial', description: 'Seguro empresarial' },
  ],
  insuranceCompany: [
    {
      id: 'b0a3f1cc-8b9a-4f3d-9d88-1c2b6d3a4f01',
      name: 'MAG SEGUROS',
      color: '#7EC8FF',
    },
    {
      id: 'c9d42d83-ef64-4f8d-9d13-3d2a1c0b8f02',
      name: 'ANADEM',
      color: '#0B6623',
    },
    {
      id: '8f6b7a21-0e3c-4c0f-9f12-7d8e9a0b1c03',
      name: 'PORTO SEGURO',
      color: '#003366',
    },
    {
      id: 'd4a4f21d-9c64-4f2a-9f11-4a7b5a2c1d04',
      name: 'AZOS',
      color: '#7ED957',
    },
    {
      id: 'e5b6a3f2-6c3d-4d2f-8a1b-2c3d4e5f6a05',
      name: 'ICATU',
      color: '#E53935',
    },
    {
      id: 'f6c7b4a3-7d4e-5f3a-9b2c-3d4e5f6a7b06',
      name: 'SULAMERICA',
      color: '#F2994A',
    },
    {
      id: 'a7d8c5b4-8e5f-6a4b-0c3d-4e5f6a7b8c07',
      name: 'CAPEMISA',
      color: '#6A1B9A',
    },
  ],
  products: [
    {
      id: 'a1f3c2d4-1111-4f2a-9c1a-000000000001',
      name: 'Alpha Vida Essencial',
      productTypeId: 'VIDA_QUALQUER_CAUSA',
      insuranceCompanyId: 'b0a3f1cc-8b9a-4f3d-9d88-1c2b6d3a4f01',
    },
    {
      id: 'a1f3c2d4-1111-4f2a-9c1a-000000000002',
      name: 'Alpha Acidente Total',
      productTypeId: 'MORTE_ACIDENTAL',
      insuranceCompanyId: 'b0a3f1cc-8b9a-4f3d-9d88-1c2b6d3a4f01',
    },
    {
      id: 'a1f3c2d4-1111-4f2a-9c1a-000000000003',
      name: 'Alpha Invalidez Plus',
      productTypeId: 'INVALIDEZ_PERMANENTE_ACIDENTE',
      insuranceCompanyId: 'b0a3f1cc-8b9a-4f3d-9d88-1c2b6d3a4f01',
    },
    {
      id: 'b2e4d3c5-2222-4b3b-9d2b-000000000001',
      name: 'Brava Protecao Familiar',
      productTypeId: 'SAF_FAMILIAR',
      insuranceCompanyId: 'c9d42d83-ef64-4f8d-9d13-3d2a1c0b8f02',
    },
    {
      id: 'b2e4d3c5-2222-4b3b-9d2b-000000000002',
      name: 'Brava Cirurgias Plus',
      productTypeId: 'CIRURGIAS',
      insuranceCompanyId: 'c9d42d83-ef64-4f8d-9d13-3d2a1c0b8f02',
    },
    {
      id: 'b2e4d3c5-2222-4b3b-9d2b-000000000003',
      name: 'Brava Diaria UTI',
      productTypeId: 'DIH_UTI',
      insuranceCompanyId: 'c9d42d83-ef64-4f8d-9d13-3d2a1c0b8f02',
    },
    {
      id: 'c3f5e4d6-3333-4c4c-9e3c-000000000001',
      name: 'Cobre Responsabilidade',
      productTypeId: 'RESPONSABILIDADE_CIVIL',
      insuranceCompanyId: '8f6b7a21-0e3c-4c0f-9f12-7d8e9a0b1c03',
    },
    {
      id: 'c3f5e4d6-3333-4c4c-9e3c-000000000002',
      name: 'Cobre Doencas Graves',
      productTypeId: 'DOENCAS_GRAVES',
      insuranceCompanyId: '8f6b7a21-0e3c-4c0f-9f12-7d8e9a0b1c03',
    },
    {
      id: 'c3f5e4d6-3333-4c4c-9e3c-000000000003',
      name: 'Cobre Empresarial Base',
      productTypeId: 'EMPRESARIAL',
      insuranceCompanyId: '8f6b7a21-0e3c-4c0f-9f12-7d8e9a0b1c03',
    },
  ],
}
