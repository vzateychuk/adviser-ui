import { useQuery } from '@tanstack/react-query'
import { getProfileApiV1ProfileGet } from '../../core/api/generated/profile/profile'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await getProfileApiV1ProfileGet()
      return response.data
    },
  })
}
