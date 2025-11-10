import { useQuery } from '@tanstack/react-query'
import { getSelfEvaluationsByUserId, getSelfEvaluationById } from '../api/SelfEvaluations'
import useAuthStore from '../../../features/authentication/store/useAuthStore'

export const useSelfEvaluations = (
  offset: number,
  limit: number,
  sortBy?: string,
  difficulty?: string,
  mood?: string
) => {
  const user = useAuthStore((state) => state.user)
  const userId = user?.userId 

  return useQuery({
    queryKey: ['selfEvaluations', 'list', { userId, offset, limit, sortBy, difficulty, mood }],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required')
      }
      
      const response = await getSelfEvaluationsByUserId(userId, offset, limit, sortBy, difficulty, mood)
      return response
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    retry: 1,
  })
}

export const useSelfEvaluation = (evaluationId: string | null) => {
  return useQuery({
    queryKey: ['selfEvaluation', evaluationId],
    queryFn: async () => {
      if (!evaluationId) {
        throw new Error('Evaluation ID is required')
      }
      
      const response = await getSelfEvaluationById(evaluationId)
      return response
    },
    enabled: !!evaluationId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })
}

