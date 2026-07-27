import { formatDateFromMillis } from '../../engine/clock/utils/formatTimeRemaining';

export const wait = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));


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