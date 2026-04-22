import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { candidateApi } from "@/lib/api/candidates.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetches paginated candidates for the caller enterprise.
 * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
 */
export function useCandidates(params = {}) {
  return useQuery({
    queryKey: queryKeys.candidates.list(params),
    queryFn: () => candidateApi.list(params),
  });
}

/**
 * Fetches a single candidate by ID.
 * @param {string} id
 */
export function useCandidate(id) {
  return useQuery({
    queryKey: queryKeys.candidates.detail(id),
    queryFn: () => candidateApi.getById(id),
    enabled: !!id,
  });
}

/** Create a single candidate. */
export function useCreateCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => candidateApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.candidates.all });
    },
  });
}

/** Update candidate fields. */
export function useUpdateCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => candidateApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.candidates.all });
    },
  });
}

/** Soft-deactivate a candidate. */
export function useDeactivateCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => candidateApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.candidates.all });
    },
  });
}

/** Bulk upload candidates from a CSV file. */
export function useBulkUploadCandidates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file) => candidateApi.bulkUpload(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.candidates.all });
    },
  });
}
