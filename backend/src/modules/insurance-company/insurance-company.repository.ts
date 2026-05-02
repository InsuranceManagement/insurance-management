import { PrismaService } from '@/modules/database/prisma.service'
import { InsuranceCompany } from '@/modules/insurance-company/entities/insurance-company'
import { CreateInsuranceCompanyInput } from '@/modules/insurance-company/inputs/create-insurance-company.input'
import { ListInsuranceCompaniesInput } from '@/modules/insurance-company/inputs/list-insurance-companies.input'
import { UpdateInsuranceCompanyInput } from '@/modules/insurance-company/inputs/update-insurance-company.input'
import { Injectable } from '@nestjs/common'

type InsuranceCompanyRecord = {
  id: string
  name: string
  color: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

@Injectable()
export class InsuranceCompanyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateInsuranceCompanyInput): Promise<InsuranceCompany> {
    const company = await this.prismaService.insuranceCompany.create({
      data: {
        name: input.name,
        color: input.color,
      },
    })

    return this.toEntity(company)
  }

  async findById(companyId: string): Promise<InsuranceCompany | null> {
    const company = await this.prismaService.insuranceCompany.findFirst({
      where: {
        id: companyId,
        deletedAt: null,
      },
    })

    return company ? this.toEntity(company) : null
  }

  async findByName(name: string): Promise<InsuranceCompany | null> {
    const company = await this.prismaService.insuranceCompany.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    })

    return company ? this.toEntity(company) : null
  }

  async update(companyId: string, input: UpdateInsuranceCompanyInput): Promise<void> {
    await this.prismaService.insuranceCompany.update({
      where: {
        id: companyId,
      },
      data: {
        ...input,
      },
    })
  }

  async softDelete(companyId: string): Promise<void> {
    await this.prismaService.insuranceCompany.update({
      where: {
        id: companyId,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async list(
    input: ListInsuranceCompaniesInput,
  ): Promise<{ companies: InsuranceCompany[]; total: number }> {
    const where = {
      deletedAt: null,
      ...(input.searchTerm
        ? {
            name: { contains: input.searchTerm, mode: 'insensitive' as const },
          }
        : {}),
    }

    const [companies, total] = await Promise.all([
      this.prismaService.insuranceCompany.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: input.skip ?? 0,
        take: input.take ?? 10,
      }),
      this.prismaService.insuranceCompany.count({ where }),
    ])

    return {
      companies: companies.map((company) => this.toEntity(company)),
      total,
    }
  }

  private toEntity(company: InsuranceCompanyRecord): InsuranceCompany {
    return new InsuranceCompany(
      company.id,
      company.name,
      company.color,
      company.createdAt,
      company.updatedAt,
      company.deletedAt,

    )
  }
}  
