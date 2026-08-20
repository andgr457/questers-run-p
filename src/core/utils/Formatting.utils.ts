import { DateTime } from 'luxon'

const GAME_DATE_TIME_FORMAT = 'M/d/yy t'

export function formatDateFromMillis(ms: number): string {
  return DateTime.fromMillis(ms).toFormat(GAME_DATE_TIME_FORMAT)
}

export function formatPrimitiveValueToString(
  value: string | number | boolean,
  isDate: boolean = false,
  numberOfDecimalPlaces: number = 0
){
  if(isDate){
    return formatDateFromMillis(value as number)
  }
  if(typeof value === 'string'){
    return value
  }
  if(typeof value === 'boolean'){
    return value === true ? 'Yes' : 'No'
  }
  if(typeof value === 'number'){
    const numberValueFixedString = value.toFixed(numberOfDecimalPlaces)
    const numberValueFixedLocale = (+numberValueFixedString).toLocaleString()
    return  numberValueFixedLocale
  }
}

export function formatNumberValueToStringWithPlus(value: number){
  const plus = value > 0 ? '+' : ''
  return `${plus}${formatPrimitiveValueToString(value)}`
}