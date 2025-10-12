export enum ModuleStatus {
  Active = 'active',
  Archived = 'archived',
}

export enum ModuleCategory {
  LearnToLearn = 'learn_to_learn',
  ActiveListening = 'active_listening',
}

export interface Module {
  id: number
  title: string
  category: ModuleCategory
  status: ModuleStatus
  description: string
  imageUrl: string 
  objective: string
  tags: string[]
  routePath: string
}

export interface ModulesResponse {
  message: string
  data: Module[]
  total: number
  offset: number
  limit: number
}

