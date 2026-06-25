import { CreateInsuranceCompanyDto } from '@/modules/insurance-company/dto/create-insurance-company.dto'
import { InsuranceCompanyResponseDto } from '@/modules/insurance-company/dto/insurance-company-response.dto'
import { UpdateInsuranceCompanyDto } from '@/modules/insurance-company/dto/update-insurance-company.dto'
import { InsuranceCompany } from '@/modules/insurance-company/entities/insurance-company'
import { InsuranceCompanyRepository } from '@/modules/insurance-company/insurance-company.repository'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class InsuranceCompanyService {
  constructor(private readonly insuranceCompanyRepository: InsuranceCompanyRepository) {}

  async create(input: CreateInsuranceCompanyDto): Promise<InsuranceCompanyResponseDto> {
    const existingCompany = await this.insuranceCompanyRepository.findByName(input.name)

    if (existingCompany) {
      throw new BadRequestException('Nome da seguradora já está em uso')
    }

    const company = await this.insuranceCompanyRepository.create(input)

    return this.toResponse(company)
  }

  async getById(companyId: string): Promise<InsuranceCompanyResponseDto> {
    const company = await this.insuranceCompanyRepository.findById(companyId)

    if (!company?.isActive()) {
      throw new NotFoundException('Seguradora não encontrada')
    }

    return this.toResponse(company)
  }

  async list(): Promise<InsuranceCompanyResponseDto[]> {
    const companies = await this.insuranceCompanyRepository.list()

    return companies
  }

  async update(companyId: string, input: UpdateInsuranceCompanyDto): Promise<void> {
    const existingCompany = await this.insuranceCompanyRepository.findById(companyId)

    if (!existingCompany?.isActive()) {
      throw new NotFoundException('Seguradora não encontrada')
    }

    if (input.name && input.name !== existingCompany.name) {
      const nameInUse = await this.insuranceCompanyRepository.findByName(input.name)
      if (nameInUse && nameInUse.id !== companyId) {
        throw new BadRequestException('Nome da seguradora já está em uso')
      }
    }

    await this.insuranceCompanyRepository.update(companyId, input)
  }

  async delete(companyIds: string[]): Promise<void> {
    const deletedCount = await this.insuranceCompanyRepository.softDeleteMany(companyIds)

    if (deletedCount === 0) {
      throw new NotFoundException('Seguradora não encontrada')
    }
  }

  private toResponse(company: InsuranceCompany): InsuranceCompanyResponseDto {
    return {
      id: company.id,
      name: company.name,
      color: company.color,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }
  }
}
