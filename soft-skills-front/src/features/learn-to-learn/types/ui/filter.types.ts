export type FilterType = 'checkbox' | 'select'

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
  values: FilterValue[]
}
