import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { enterpriseApi } from '@/lib/api/enterprises.api';
import { queryKeys } from '@/lib/api/queryKeys';
import { useAuthStore } from '@/stores/authStore';

export function useEnterpriseAuditLogs(params) {
  const enterpriseId = useAuthStore((state) => state.user?.enterpriseId);

  return useQuery({
    queryKey: queryKeys.enterprises.auditLogs(enterpriseId, params),
    queryFn: () => enterpriseApi.getAuditLogs(enterpriseId, params),
    enabled: !!enterpriseId,
    placeholderData: keepPreviousData,
  });
}
