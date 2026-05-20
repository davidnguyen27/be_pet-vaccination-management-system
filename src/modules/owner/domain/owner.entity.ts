interface OwnerProps {
  userId: string;
  address: string | null;
  locationLat: number | null;
  locationLng: number | null;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OwnerInput {
  id: string;
  userId: string;
  address?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  totalPoints?: number;
}

interface UpdateOwner {
  address?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
}

export class OwnerEntity {
  private readonly _id: string;
  private _props: OwnerProps;

  private constructor(id: string, props: OwnerProps) {
    this._id = id;
    this._props = props;
  }

  static reconstitute(id: string, props: OwnerProps): OwnerEntity {
    const normalizedId = OwnerEntity.requireNonEmpty('id', id);
    const normalizedUserId = OwnerEntity.requireNonEmpty('userId', props.userId);
    const normalizedAddress = OwnerEntity.normalizeAddress(props.address);
    const normalizedLat = OwnerEntity.normalizeCoordinate(props.locationLat);
    const normalizedLng = OwnerEntity.normalizeCoordinate(props.locationLng);

    OwnerEntity.validateLatitude(normalizedLat);
    OwnerEntity.validateLongitude(normalizedLng);
    OwnerEntity.validateTotalPoints(props.totalPoints);
    OwnerEntity.validateDate('createdAt', props.createdAt);
    OwnerEntity.validateDate('updatedAt', props.updatedAt);

    return new OwnerEntity(normalizedId, {
      userId: normalizedUserId,
      address: normalizedAddress,
      locationLat: normalizedLat,
      locationLng: normalizedLng,
      totalPoints: props.totalPoints,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  static create(input: OwnerInput): OwnerEntity {
    const now = new Date();
    const normalizedId = OwnerEntity.requireNonEmpty('id', input.id);
    const normalizedUserId = OwnerEntity.requireNonEmpty('userId', input.userId);
    const normalizedAddress = OwnerEntity.normalizeAddress(input.address);
    const normalizedLat = OwnerEntity.normalizeCoordinate(input.locationLat);
    const normalizedLng = OwnerEntity.normalizeCoordinate(input.locationLng);
    const totalPoints = input.totalPoints ?? 0;

    OwnerEntity.validateLatitude(normalizedLat);
    OwnerEntity.validateLongitude(normalizedLng);
    OwnerEntity.validateTotalPoints(totalPoints);

    return new OwnerEntity(normalizedId, {
      userId: normalizedUserId,
      address: normalizedAddress,
      locationLat: normalizedLat,
      locationLng: normalizedLng,
      totalPoints,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._props.userId;
  }
  get address(): string | null {
    return this._props.address;
  }
  get locationLat(): number | null {
    return this._props.locationLat;
  }
  get locationLng(): number | null {
    return this._props.locationLng;
  }
  get totalPoints(): number {
    return this._props.totalPoints;
  }
  get createdAt(): Date {
    return new Date(this._props.createdAt);
  }
  get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  updateProfile(input: UpdateOwner): void {
    if (input.address !== undefined) {
      this._props.address = OwnerEntity.normalizeAddress(input.address);
    }

    if (input.locationLat !== undefined) {
      const locationLat = OwnerEntity.normalizeCoordinate(input.locationLat);
      OwnerEntity.validateLatitude(locationLat);
      this._props.locationLat = locationLat;
    }

    if (input.locationLng !== undefined) {
      const locationLng = OwnerEntity.normalizeCoordinate(input.locationLng);
      OwnerEntity.validateLongitude(locationLng);
      this._props.locationLng = locationLng;
    }

    this._props.updatedAt = new Date();
  }

  setTotalPoints(totalPoints: number): void {
    OwnerEntity.validateTotalPoints(totalPoints);

    this._props.totalPoints = totalPoints;
    this._props.updatedAt = new Date();
  }

  increasePoints(points: number): void {
    if (!Number.isInteger(points) || points <= 0) {
      throw new Error('Points to increase must be a positive integer');
    }

    this._props.totalPoints += points;
    this._props.updatedAt = new Date();
  }

  decreasePoints(points: number): void {
    if (!Number.isInteger(points) || points <= 0) {
      throw new Error('Points to decrease must be a positive integer');
    }

    if (this._props.totalPoints - points < 0) {
      throw new Error('Total points cannot be negative');
    }

    this._props.totalPoints -= points;
    this._props.updatedAt = new Date();
  }

  private static normalizeAddress(address?: string | null): string | null {
    if (address === undefined || address === null) {
      return null;
    }

    const normalized = address.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private static normalizeCoordinate(value?: number | null): number | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (!Number.isFinite(value)) {
      throw new Error('Coordinate must be a finite number');
    }

    return value;
  }

  private static requireNonEmpty(field: string, value: string): string {
    const normalized = value?.trim();
    if (!normalized) {
      throw new Error(`${field} is required`);
    }

    return normalized;
  }

  private static validateTotalPoints(totalPoints: number): void {
    if (!Number.isInteger(totalPoints) || totalPoints < 0) {
      throw new Error('Total points must be a non-negative integer');
    }
  }

  private static validateDate(field: string, value: Date): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new Error(`${field} must be a valid date`);
    }
  }

  private static validateLatitude(value: number | null): void {
    if (value !== null && (value < -90 || value > 90)) {
      throw new Error('Latitude must be between -90 and 90');
    }
  }

  private static validateLongitude(value: number | null): void {
    if (value !== null && (value < -180 || value > 180)) {
      throw new Error('Longitude must be between -180 and 180');
    }
  }
}
