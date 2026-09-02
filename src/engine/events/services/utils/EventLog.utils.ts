import { clockRuntimeService } from '../../../clock/ClockRuntimeService';
import type { SystemEventLog, SystemEventType } from '../types/EventLog.types';
import type { EventServiceIds } from '../types/EventService.types';

export function getSystemEventLogServiceInitStart(
  eventServiceId: EventServiceIds,
): SystemEventLog {
  return getSystemEventLogDefault({
    eventServiceId,
    type: 'init:start',
    description: 'Initializing service.'
  })
}
export function getSystemEventLogServiceInitEnd(
  eventServiceId: EventServiceIds,
  error?: string
): SystemEventLog {
  return getSystemEventLogDefault({
    eventServiceId,
    type: 'init:end',
    description: 'Service initialized.',
    error
  })
}

export function getSystemEventLogServiceSaveStart(
  eventServiceId: EventServiceIds,
): SystemEventLog {
  return getSystemEventLogDefault({
    eventServiceId,
    type: 'service:save:start',
    description: 'Saving service entities.'
  })
}

export function getSystemEventLogServiceSaveEnd(
  eventServiceId: EventServiceIds,
  entityAmount: number,
  error?: string
): SystemEventLog {
  return getSystemEventLogDefault({
    eventServiceId,
    type: 'service:save:end',
    description: `${entityAmount.toLocaleString()} service entities saved.`,
    error,
  })
}

export function getSystemEventLogServiceLoadStart(
  eventServiceId: EventServiceIds,
): SystemEventLog {
  return getSystemEventLogDefault({
    eventServiceId,
    type: 'service:load:start',
    description: 'Loading service entities.'
  })
}

export function getSystemEventLogServiceLoadEnd(
  eventServiceId: EventServiceIds,
  entityAmount: number,
  error: string,
): SystemEventLog {
  return getSystemEventLogDefault({
    eventServiceId,
    type: 'service:load:start',
    description: `${entityAmount.toLocaleString()} service entitie(s) loaded.`,
    error,
  })
}

interface GetSystemEventLogDefaultProps {
  type: SystemEventType,
  eventServiceId: EventServiceIds,
  description: string
  error?: string
}

export function getSystemEventLogDefault(props: GetSystemEventLogDefaultProps): SystemEventLog {
  const {
    eventServiceId,
    type,
    description,
    error,
  } = props
  return {
    id: crypto.randomUUID(),
    created: clockRuntimeService.getNow(),
    eventServiceId: eventServiceId,
    type,
    description,
    error
  }
}