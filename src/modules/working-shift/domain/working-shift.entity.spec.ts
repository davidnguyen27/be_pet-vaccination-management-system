/// <reference types="jest" />

import { MaxAppointmentsInvalidError, SlotDurationExceedsShiftError } from './exceptions/capacity.error';
import { ShiftTimeRangeInvalidError } from './exceptions/time.error';
import { WorkingShiftDeletedError } from './exceptions/working-shift.error';
import { WorkingShiftEntity, WorkingShiftInput } from './working-shift.entity';
import { Weekday } from './working-shift.types';

describe('WorkingShiftEntity', () => {
  const createInput = (overrides: Partial<WorkingShiftInput> = {}): WorkingShiftInput => ({
    vetId: 'c3425e74-4ea6-4894-83f2-e8d1e7000c52',
    dayOfWeek: Weekday.MON,
    startTime: new Date('2026-06-04T08:00:00.000Z'),
    endTime: new Date('2026-06-04T17:00:00.000Z'),
    notes: ' Morning shift ',
    ...overrides,
  });

  it('creates a shift with Prisma model defaults and normalized time-only values', () => {
    const workingShift = WorkingShiftEntity.create('shift-id', createInput());

    expect(workingShift.slotDuration).toBe(30);
    expect(workingShift.maxAppointments).toBe(1);
    expect(workingShift.notes).toBe('Morning shift');
    expect(workingShift.startTime.toISOString()).toBe('1970-01-01T08:00:00.000Z');
    expect(workingShift.endTime.toISOString()).toBe('1970-01-01T17:00:00.000Z');
  });

  it('rejects an end time that is not after the start time', () => {
    expect(() =>
      WorkingShiftEntity.create(
        'shift-id',
        createInput({
          endTime: new Date('2026-06-04T08:00:00.000Z'),
        }),
      ),
    ).toThrow(ShiftTimeRangeInvalidError);
  });

  it('rejects a slot duration longer than the shift', () => {
    expect(() =>
      WorkingShiftEntity.create(
        'shift-id',
        createInput({
          endTime: new Date('2026-06-04T08:30:00.000Z'),
          slotDuration: 60,
        }),
      ),
    ).toThrow(SlotDurationExceedsShiftError);
  });

  it('rejects a non-positive appointment capacity', () => {
    expect(() =>
      WorkingShiftEntity.create(
        'shift-id',
        createInput({
          maxAppointments: 0,
        }),
      ),
    ).toThrow(MaxAppointmentsInvalidError);
  });

  it('prevents updates after soft deletion', () => {
    const workingShift = WorkingShiftEntity.create('shift-id', createInput());

    workingShift.softDelete();

    expect(() => workingShift.update({ notes: 'Updated' })).toThrow(WorkingShiftDeletedError);
  });
});
