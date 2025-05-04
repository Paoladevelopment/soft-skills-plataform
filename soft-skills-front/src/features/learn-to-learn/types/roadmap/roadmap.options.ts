export type RoadmapCreationOption = 'chatbot' | 'manual'
export type EditorTab = 'properties' | 'content'
export type FontSizeOption = 'S' | 'M' | 'L' | 'XL' | 'XXL'

export const fontSizeMap: Record<FontSizeOption, string> = {
  S: '0.75rem',
  M: '0.875rem',
  L: '1rem',
  XL: '1.25rem',
  XXL: '1.5rem',
}

export const captionFontSizeMap: Record<FontSizeOption, string> = {
  S: '0.5rem',   // 8px
  M: '0.625rem', // 10px
  L: '0.75rem',  // 12px
  XL: '1rem',    // 16px
  XXL: '1.25rem' // 20px
}

export const fontSizeOptions: FontSizeOption[] = ['S', 'M', 'L', 'XL', 'XXL']
export const colorOptions = ['#FFFFFF', '#F9F871', '#FFCDCD', '#C7E9B0', '#A0D2EB', '#D5AAFF']
