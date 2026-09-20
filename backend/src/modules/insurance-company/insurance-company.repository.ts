import { PrismaService } from '@/modules/database/prisma.service'
import { InsuranceCompany } from '@/modules/insurance-company/entities/insurance-company'
import { CreateInsuranceCompanyInput } from '@/modules/insurance-company/inputs/create-insurance-company.input'
import { UpdateInsuranceCompanyInput } from '@/modules/insurance-company/inputs/update-insurance-company.input'
import { Prisma } from '@generated/prisma'
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

  async softDeleteMany(
    companyIds: string[],
  ): Promise<{ deletedCount: number; hasActiveProducts: boolean }> {
    if (companyIds.length === 0) {
      return { deletedCount: 0, hasActiveProducts: false }
    }

    return this.prismaService.$transaction(
      async (transaction) => {
        const companiesWithActiveProducts = await transaction.insuranceCompany.count({
          where: {
            id: { in: companyIds },
            deletedAt: null,
            products: { some: { deletedAt: null } },
          },
        })

        if (companiesWithActiveProducts > 0) {
          return { deletedCount: 0, hasActiveProducts: true }
        }

        const { count } = await transaction.insuranceCompany.updateMany({
          where: {
            id: { in: companyIds },
            deletedAt: null,
          },
          data: { deletedAt: new Date() },
        })

        return { deletedCount: count, hasActiveProducts: false }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    )
  }

  async list(): Promise<InsuranceCompany[]> {
    const where = {
      deletedAt: null,
    }

    const companies = await this.prismaService.insuranceCompany.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return companies.map((company) => this.toEntity(company))
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
