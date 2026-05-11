export interface Entity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface EntityWithName extends Entity {
  name: string
}
