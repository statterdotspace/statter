import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import type { ProjectFormValues } from '../model/types';

interface ProjectFormFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
  idPrefix: string;
}

const ProjectFormFields = ({ form, idPrefix }: ProjectFormFieldsProps) => {
  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-name`}>Project name</Label>
        <Input id={`${idPrefix}-name`} placeholder="Project name" {...form.register('name')} />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-description`}>Description</Label>
        <Textarea
          id={`${idPrefix}-description`}
          className="min-h-20"
          placeholder="Description"
          {...form.register('description')}
        />
      </div>
    </>
  );
};

export { ProjectFormFields };
