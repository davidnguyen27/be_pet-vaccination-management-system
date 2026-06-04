export interface MicrochipBatchModel {
  id: string;
  batchNo: string;
  vendorName: string;
  manufacturer: string;
  model: string;
  importDate: Date;
  totalQuantity: number;
  notes: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
