import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

/**
 * @typedef {Object} AuthUser
 * @property {string} id
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {'SystemAdmin'|'EnterpriseAdmin'|'EnterpriseStaff'|'EnterpriseAuto'} role
 * @property {string} enterpriseId
 */

/**
 * Auth store — persisted to localStorage as "veritas-auth".
 * Holds JWT tokens and decoded user identity.
 * Used by the Axios request interceptor and route guards.
 */
export const useAuthStore = create()(
  persist(
    (set, get) => ({
      /** @type {string|null} */
      accessToken: null,

      /** @type {string|null} */
      refreshToken: null,

      /** @type {AuthUser|null} */
      user: null,

      /**
       * Called after a successful login or token refresh.
       * Decodes the JWT to extract user identity.
       * @param {string} access
       * @param {string} refresh
       */
      setTokens: (access, refresh) => {
        const decoded = jwtDecode(access);
        set({ accessToken: access, refreshToken: refresh, user: decoded });
      },

      /** Clear all auth state — called on logout or failed refresh */
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),

      /**
       * Returns true if the access token is expired or missing.
       * @returns {boolean}
       */
      isTokenExpired: () => {
        const { user } = get();
        if (!user?.exp) return true;
        return Date.now() / 1000 > user.exp;
      },
    }),
    { name: "veritas-auth" }
  )
);
