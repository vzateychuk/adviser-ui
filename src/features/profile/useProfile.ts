import { useQuery } from '@tanstack/react-query'
import { getProfileApiV1ProfileGet } from '../../core/api/generated/profile/profile'
import { queryKeys, assertData, type ProfileDTO } from '../../core/queryKeys'

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const response = await getProfileApiV1ProfileGet()
      return assertData<ProfileDTO>(response.data)
    },
  })
}
