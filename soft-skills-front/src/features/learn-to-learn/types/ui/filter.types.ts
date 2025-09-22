export type FilterType = 'checkbox' | 'select' | 'text' | 'range'

export type TabValue = 'all' | 'incomplete' | 'ongoing' | 'finished'

export interface FilterValue {
  value: string
  label: string
}

export interface FilterEnumValues {
  [key: string]: string
}

export interface FilterOption {
  key: string
  label: string
  placeholder?: string
  type: FilterType
  values?: FilterValue[] 
  minPlaceholder?: string 
  maxPlaceholder?: string
}
