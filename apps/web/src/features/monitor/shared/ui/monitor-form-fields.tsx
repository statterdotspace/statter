import type { Path, PathValue, UseFormReturn } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { monitorRegionOptions, monitorStatusOptions, monitorTypeOptions } from '@/entities/monitor';
import type { MonitorFormValues } from '../model/types';
import type { MonitorRegion, MonitorStatus, MonitorType } from '@/entities';

interface MonitorFormFieldsProps<TFormValues extends MonitorFormValues> {
  form: UseFormReturn<TFormValues>;
  idPrefix: string;
}

const MonitorFormFields = <TFormValues extends MonitorFormValues>({
  form,
  idPrefix,
}: MonitorFormFieldsProps<TFormValues>) => {
  const setFieldValue = <TField extends keyof MonitorFormValues>(
    field: TField,
    value: MonitorFormValues[TField]
  ) => {
    form.setValue(
      field as unknown as Path<TFormValues>,
      value as PathValue<TFormValues, Path<TFormValues>>,
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  const typeValue = form.watch('type' as Path<TFormValues>) as MonitorType;
  const regionValue = form.watch('region' as Path<TFormValues>) as MonitorRegion;
  const statusValue = form.watch('status' as Path<TFormValues>) as MonitorStatus;

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-name`}>Name</Label>
        <Input
          id={`${idPrefix}-name`}
          placeholder="Name"
          {...form.register('name' as Path<TFormValues>)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-url`}>URL</Label>
        <Input
          id={`${idPrefix}-url`}
          placeholder="URL"
          {...form.register('url' as Path<TFormValues>)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-description`}>Description</Label>
        <Input
          id={`${idPrefix}-description`}
          placeholder="Description"
          {...form.register('description' as Path<TFormValues>)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-type`}>Type</Label>
        <Select
          value={typeValue}
          onValueChange={(value) => {
            if (value) {
              setFieldValue('type', value as MonitorType);
            }
          }}
        >
          <SelectTrigger id={`${idPrefix}-type`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {monitorTypeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.toUpperCase()}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-region`}>Region</Label>
        <Select
          value={regionValue}
          onValueChange={(value) => {
            if (value) {
              setFieldValue('region', value as MonitorRegion);
            }
          }}
        >
          <SelectTrigger id={`${idPrefix}-region`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {monitorRegionOptions.map((region) => (
              <SelectItem key={region} value={region}>
                {region.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-status`}>Status</Label>
        <Select
          value={statusValue}
          onValueChange={(value) => {
            if (value) {
              setFieldValue('status', value as MonitorStatus);
            }
          }}
        >
          <SelectTrigger id={`${idPrefix}-status`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {monitorStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-interval`}>Interval seconds</Label>
        <Input
          id={`${idPrefix}-interval`}
          type="number"
          placeholder="Interval seconds"
          {...form.register('intervalSeconds' as Path<TFormValues>, { valueAsNumber: true })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-timeout`}>Timeout ms</Label>
        <Input
          id={`${idPrefix}-timeout`}
          type="number"
          placeholder="Timeout ms"
          {...form.register('timeoutMs' as Path<TFormValues>, { valueAsNumber: true })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-expected-status`}>Expected status</Label>
        <Input
          id={`${idPrefix}-expected-status`}
          type="number"
          placeholder="Expected status"
          {...form.register('expectedStatus' as Path<TFormValues>, { valueAsNumber: true })}
        />
      </div>
    </>
  );
};

export { MonitorFormFields };
