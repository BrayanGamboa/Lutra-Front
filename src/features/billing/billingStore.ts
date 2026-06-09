import { create } from 'zustand';

import type { Invoice } from '@/features/billing/types/billing.types';

export interface BillingState {
  selectedInvoice: Invoice | null;
  isCreateModalOpen: boolean;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

export const useBillingStore = create<BillingState>()((set) => ({
  selectedInvoice: null,
  isCreateModalOpen: false,
  setSelectedInvoice: (invoice) => {
    set({ selectedInvoice: invoice });
  },
  openCreateModal: () => {
    set({ isCreateModalOpen: true });
  },
  closeCreateModal: () => {
    set({ isCreateModalOpen: false });
  },
}));
