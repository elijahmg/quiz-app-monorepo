import React from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export interface RadioButtonOption {
  value: string
  label: string
}

interface FormRadioButtonProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  form: UseFormReturn<T>
  vertical?: boolean
  options: RadioButtonOption[]
}

export function FormRadioButtons<T extends FieldValues>({
  name,
  label,
  form,
  options,
  vertical
}: FormRadioButtonProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          {Boolean(label) && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              className={`flex ${vertical ? 'flex-col space-y-1' : 'flex-row space-x-1'} `}
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              {options.map(({ value, label }) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={label}
                >
                  <FormControl>
                    <RadioGroupItem value={value} />
                  </FormControl>
                  <FormLabel className="font-normal">{label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
