import { useQuery } from '@tanstack/react-query'
import { listDocumentsApiV1DocumentsGet } from '../../core/api/generated/documents/documents'
import { queryKeys, assertData, type DocumentDTO } from '../../core/queryKeys'

export function useDocuments() {
  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: async () => {
      const response = await listDocumentsApiV1DocumentsGet()
      return assertData<DocumentDTO[]>(response.data)
    },
    refetchInterval: false,
  })
}
