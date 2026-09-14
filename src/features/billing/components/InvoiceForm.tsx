import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useCreateInvoice } from '@/features/billing/hooks/useCreateInvoice';
import type {
  CreateInvoicePayload,
  InvoiceStatus,
} from '@/features/billing/types/billing.types';

interface InvoiceFormProps {
  onSuccess?: () => void;
}

const invoiceStatuses: InvoiceStatus[] = ['draft', 'sent', 'paid', 'cancelled'];

export const InvoiceForm = ({ onSuccess }: InvoiceFormProps): JSX.Element => {
  const { createInvoice, error, isPending } = useCreateInvoice();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateInvoicePayload>({
    defaultValues: {
      number: '',
      clientName: '',
      total: 0,
      status: 'draft',
    },
  });

  const onSubmit = (values: CreateInvoicePayload): void => {
    createInvoice(values, () => {
      reset();
      onSuccess?.();
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        error={errors.number?.message}
        label="Consecutivo"
        placeholder="FE-0001"
        {...register('number', {
          required: 'Consecutivo requerido.',
        })}
      />

      <Input
        error={errors.clientName?.message}
        label="Cliente"
        placeholder="Cliente SAS"
        {...register('clientName', {
          required: 'Cliente requerido.',
        })}
      />

      <Input
        error={errors.total?.message}
        label="Total"
        min={0}
        placeholder="0.00"
        step="0.01"
        type="number"
        {...register('total', {
          required: 'Total requerido.',
          min: {
            value: 0,
            message: 'Total debe ser mayor o igual a 0.',
          },
          valueAsNumber: true,
        })}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700" htmlFor="invoice-status">
          Estado
        </label>
        <select
          className="block h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          id="invoice-status"
          {...register('status')}
        >
          {invoiceStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button isLoading={isPending} type="submit" tooltip='Agregar factura'></Button>
      </div>
    </form>
  );
};
