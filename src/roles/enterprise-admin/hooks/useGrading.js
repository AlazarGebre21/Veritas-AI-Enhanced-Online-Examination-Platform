import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gradingApi } from '@/lib/api/grading.api';
import { queryKeys } from '@/lib/api/queryKeys';

export function useGradingResults(params) {
  return useQuery({
    queryKey: queryKeys.grading.list(params),
    queryFn: () => gradingApi.listResults(params),
    placeholderData: keepPreviousData,
  });
}

export function useGradingDetail(sessionId) {
  return useQuery({
    queryKey: queryKeys.grading.detail(sessionId),
    queryFn: () => gradingApi.getGradeDetail(sessionId),
    enabled: !!sessionId,
  });
}

export function useOverrideGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradingApi.overrideGrade,
    onSuccess: (data) => {
      // Invalidate both the detail for this session, and the main list
      queryClient.invalidateQueries({ queryKey: queryKeys.grading.all });
      toast.success(data.message || 'Grade manually overridden successfully.');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to override grade.';
      toast.error(message);
    },
  });
}

export function useGradingLogs(sessionId) {
  return useQuery({
    queryKey: queryKeys.grading.logs(sessionId),
    queryFn: () => gradingApi.getAuditLogs(sessionId),
    enabled: !!sessionId,
  });
}

export function useGradingStatus(sessionId) {
  return useQuery({
    queryKey: queryKeys.grading.status(sessionId),
    queryFn: () => gradingApi.getGradingStatus(sessionId),
    enabled: !!sessionId,
    refetchInterval: (query) => (query?.state?.data?.status === 'pending' ? 5000 : false),
  });
}
