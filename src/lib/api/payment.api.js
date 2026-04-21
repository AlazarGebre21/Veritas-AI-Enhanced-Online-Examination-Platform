import { apiClient } from "./client.js";

/**
 * @typedef {Object} SubscriptionPlan
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {number} price
 * @property {string} currency
 * @property {'monthly'|'yearly'} billing_cycle
 * @property {boolean} is_active
 * @property {Record<string, string>} features
 * @property {string} stripe_price_id
 * @property {string} created_at
 * @property {string} updated_at
 */

export const paymentApi = {
  /**
   * List all subscription plans (public endpoint).
   * @returns {Promise<SubscriptionPlan[]>}
   */
  listPlans: async () => {
    const { data } = await apiClient.get("/subscriptions/plans");
    return data;
  },

  /**
   * Get payment history for an enterprise.
   * @param {string} enterpriseId
   * @returns {Promise<any[]>}
   */
  getPaymentHistory: async (enterpriseId) => {
    const { data } = await apiClient.get("/payments/history", {
      params: { enterpriseId },
    });
    return data;
  },

  /**
   * Get a single invoice by ID.
   * @param {string} invoiceId
   * @returns {Promise<any>}
   */
  getInvoice: async (invoiceId) => {
    const { data } = await apiClient.get(`/invoices/${invoiceId}`);
    return data;
  },
};
