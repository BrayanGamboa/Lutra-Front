import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { OtterMascot } from '@/components/OtterMascot';
import { SearchableSelect } from '@/components/SearchableSelect';
import { useAuthStore, type AuthState } from '@/features/auth/authStore';
import { useCities } from '@/features/catalog/hooks/useCities';
import { useDocumentTypes } from '@/features/catalog/hooks/useDocumentTypes';
import { useTaxRegimes } from '@/features/catalog/hooks/useTaxRegimes';
import {
  useCustomerDetails,
  useUpdateCustomerDetails,
} from '@/features/customer/hooks/useCustomerDetails';

const profileSchema = z.object({
  documentNumber: z.string().optional(),
  businessName: z.string().optional(),
  billingAddress: z.string().optional(),
  phone: z.string().optional(),
  customerName: z.string().optional(),
  customerDocument: z.string().optional(),
  documentTypeId: z.number().int().positive().optional(),
  cityId: z.number().int().positive().optional(),
  taxRegimeId: z.number().int().positive().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const CustomerProfilePage = (): JSX.Element => {
  const user = useAuthStore((state: AuthState) => state.user);
  const userId = user?.userId ?? null;

  const {
    data: details,
    isLoading,
    error: fetchError,
  } = useCustomerDetails(userId);

  const {
    mutate: updateDetails,
    isPending,
    error: updateError,
    isSuccess,
  } = useUpdateCustomerDetails();

  const { data: documentTypes = [], isLoading: loadingDocumentTypes } = useDocumentTypes();
  const { data: cities = [], isLoading: loadingCities } = useCities();
  const { data: taxRegimes = [], isLoading: loadingTaxRegimes } = useTaxRegimes();

  const documentTypeOptions = useMemo(
    () => documentTypes.map((d) => ({ value: d.documentTypeId, label: d.name })),
    [documentTypes],
  );
  const cityOptions = useMemo(
    () => cities.map((c) => ({ value: c.cityId, label: c.name })),
    [cities],
  );
  const taxRegimeOptions = useMemo(
    () => taxRegimes.map((t) => ({ value: t.taxRegimeId, label: t.name, description: t.description })),
    [taxRegimes],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (details) {
      reset({
        documentNumber: details.documentNumber ?? '',
        businessName: details.businessName ?? '',
        billingAddress: details.billingAddress ?? '',
        phone: details.phone ?? '',
        customerName: details.customerName ?? '',
        customerDocument: details.customerDocument ?? '',
        documentTypeId: details.documentTypeId,
        cityId: details.cityId,
        taxRegimeId: details.taxRegimeId,
      });
    }
  }, [details, reset]);

  const onSubmit = (values: ProfileFormValues): void => {
    if (!userId) return;
    updateDetails({
      userId,
      documentNumber: values.documentNumber || undefined,
      businessName: values.businessName || undefined,
      billingAddress: values.billingAddress || undefined,
      phone: values.phone || undefined,
      customerName: values.customerName || undefined,
      customerDocument: values.customerDocument || undefined,
      documentTypeId: values.documentTypeId,
      cityId: values.cityId,
      taxRegimeId: values.taxRegimeId,
    });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Perfil</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Mi perfil</h1>
        <p className="mt-1 text-sm text-slate-500">
          Actualiza tu información de facturación y datos de contacto.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-12">
          <OtterMascot variant="loading" message="Cargando datos..." size="md" />
        </div>
      ) : fetchError && fetchError.response?.status !== 400 ? (
        <div className="flex items-center gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4">
          <OtterMascot variant="error" size="sm" />
          <p className="text-sm text-rose-700">{fetchError.message}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                error={errors.customerName?.message}
                label="Nombre del cliente"
                placeholder="Juan Pérez"
                {...register('customerName')}
              />
              <Input
                error={errors.customerDocument?.message}
                label="Documento del cliente"
                placeholder="900123456"
                {...register('customerDocument')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                error={errors.documentNumber?.message}
                label="Número de documento"
                placeholder="123456789"
                {...register('documentNumber')}
              />
              <Controller
                control={control}
                name="documentTypeId"
                render={({ field }) => (
                  <SearchableSelect
                    label="Tipo de documento"
                    options={documentTypeOptions}
                    value={field.value ?? null}
                    onChange={(v) => field.onChange(v === null ? undefined : Number(v))}
                    error={errors.documentTypeId?.message}
                    isLoading={loadingDocumentTypes}
                    clearable
                  />
                )}
              />
            </div>
            <Input
              error={errors.businessName?.message}
              label="Razón social"
              placeholder="Mi Empresa S.A.S"
              {...register('businessName')}
            />
            <Input
              error={errors.billingAddress?.message}
              label="Dirección de facturación"
              placeholder="Cra. 1 #2-3, Bogotá"
              {...register('billingAddress')}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                error={errors.phone?.message}
                label="Teléfono"
                placeholder="+57 300 000 0000"
                {...register('phone')}
              />
              <Controller
                control={control}
                name="cityId"
                render={({ field }) => (
                  <SearchableSelect
                    label="Ciudad"
                    options={cityOptions}
                    value={field.value ?? null}
                    onChange={(v) => field.onChange(v === null ? undefined : Number(v))}
                    error={errors.cityId?.message}
                    isLoading={loadingCities}
                    clearable
                  />
                )}
              />
            </div>
            <Controller
              control={control}
              name="taxRegimeId"
              render={({ field }) => (
                <SearchableSelect
                  label="Régimen tributario"
                  options={taxRegimeOptions}
                  value={field.value ?? null}
                  onChange={(v) => field.onChange(v === null ? undefined : Number(v))}
                  error={errors.taxRegimeId?.message}
                  isLoading={loadingTaxRegimes}
                  clearable
                />
              )}
            />

            {updateError ? (
              <p className="text-sm text-rose-600">{updateError}</p>
            ) : isSuccess ? (
              <p className="text-sm text-emerald-600">Perfil actualizado correctamente.</p>
            ) : null}

            <div className="flex justify-end pt-2">
              <Button isLoading={isPending} type="submit">
                Guardar cambios
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
