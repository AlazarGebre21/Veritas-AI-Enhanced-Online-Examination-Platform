import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Mutation hooks for enterprise user management.
 * Each returns a standard useMutation result.
 */

/** Create a new user in an enterprise. */
export function useCreateUser(enterpriseId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => enterpriseApi.createUser(enterpriseId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.enterprises.usersAll(enterpriseId) });
    },
  });
}

/** Update a user's profile/role. */
export function useUpdateUser(enterpriseId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }) => enterpriseApi.updateUser(enterpriseId, userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.enterprises.usersAll(enterpriseId) });
    },
  });
}

/** Deactivate a user without permanent deletion. */
export function useDeactivateUser(enterpriseId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => enterpriseApi.deactivateUser(enterpriseId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.enterprises.usersAll(enterpriseId) });
    },
  });
}

/** Reset a user's password → returns { temporary_password }. */
export function useResetUserPassword(enterpriseId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => enterpriseApi.resetUserPassword(enterpriseId, userId),
    // Don't invalidate — password reset doesn't change list data
  });
}
