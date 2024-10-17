import React from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface FormInputProps<T extends FieldValues> {
  name: Path<T>
  label: string
  form: UseFormReturn<T>
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  form
}: FormInputProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
