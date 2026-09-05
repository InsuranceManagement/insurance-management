import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateVisitDto } from './dto/create-visit.dto'
import { ListVisitsDto } from './dto/list-visits.dto'
import { UpdateVisitDto } from './dto/update-visit.dto'
import { VisitRepository } from './visit.repository'

@Injectable()
export class VisitService {
  constructor(private readonly repository: VisitRepository) {}

  async create(input: CreateVisitDto) {
    await this.validateClient(input.clientId)
    return this.repository.create(input)
  }

  async getById(id: string) {
    const visit = await this.repository.findById(id)
    if (!visit) throw new NotFoundException('Visita não encontrada')
    return visit
  }

  list(input: ListVisitsDto) {
    if (input.startDate && input.endDate && new Date(input.startDate) > new Date(input.endDate)) {
      throw new BadRequestException('startDate deve ser anterior ou igual a endDate')
    }
    return this.repository.list(input)
  }

  async update(id: string, input: UpdateVisitDto) {
    await this.getById(id)
    if (input.clientId !== undefined) await this.validateClient(input.clientId)
    return this.repository.update(id, input)
  }

  async delete(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) {
      throw new NotFoundException('Visita não encontrada')
    }
  }

  private async validateClient(id: string): Promise<void> {
    if (!(await this.repository.clientExists(id))) {
      throw new NotFoundException('Cliente não encontrado')
    }
  }
}
