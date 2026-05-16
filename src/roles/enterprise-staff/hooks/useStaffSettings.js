/**
 * @fileoverview Hooks for staff self-service settings (profile update + password change).
 * Uses the same enterprise user endpoints that the admin StaffManagement uses,
 * but scoped to the current user editing their own profile.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetch current user's profile details.
 * GET /enterprises/:enterpriseId/users/:userId
 */
export function useMyProfile(enterpriseId, userId) {
  return useQuery({
    queryKey: queryKeys.enterprises.user(enterpriseId, userId),
    queryFn: () => enterpriseApi.getUser(enterpriseId, userId),
    enabled: !!enterpriseId && !!userId,
  });
}

/**
 * Update current user's profile fields.
 * PATCH /enterprises/:enterpriseId/users/:userId
 */
export function useUpdateMyProfile(enterpriseId) {
  return useMutation({
    mutationFn: ({ userId, payload }) =>
      enterpriseApi.updateUser(enterpriseId, userId, payload),
  });
}

/**
 * Change current user's password.
 * POST /enterprises/:enterpriseId/users/:userId/change-password
 */
export function useChangeMyPassword(enterpriseId) {
  return useMutation({
    mutationFn: ({ userId, payload }) =>
      enterpriseApi.changePassword(enterpriseId, userId, payload),
  });
}
