export type NotificationRelationMsPayload = {
  id: string
  name: string
}

export class NotificationRelation {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}

  static fromMs(raw: NotificationRelationMsPayload): NotificationRelation {
    return new NotificationRelation(raw.id, raw.name)
  }
}
