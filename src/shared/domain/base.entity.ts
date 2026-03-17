export abstract class BaseEntity {
  id: string;
  isDeleted: boolean = false;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(props: { id: string; createdAt: Date; updatedAt: Date; deletedAt?: Date | null }) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}
