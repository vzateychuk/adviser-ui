import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadDocumentApiV1DocumentsPost } from '../../core/api/generated/documents/documents'
import { assertData, queryKeys, type DocumentDTO } from '../../core/queryKeys'

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadDocumentApiV1DocumentsPost({ file })
      return assertData<DocumentDTO>(response.data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.documents })
    },
  })
}
