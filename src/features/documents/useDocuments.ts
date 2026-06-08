import { useQuery } from '@tanstack/react-query'
import { listDocumentsApiV1DocumentsGet } from '../../core/api/generated/documents/documents'

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await listDocumentsApiV1DocumentsGet()
      return response.data
    },
  })
}
