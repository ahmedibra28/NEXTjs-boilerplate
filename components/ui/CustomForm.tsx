import React from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { Button, ButtonProps } from '@/components/ui/button'
import { FaCheck, FaSort, FaSpinner } from 'react-icons/fa6'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import useApi from '@/hooks/useApi'
import { useDebounce } from 'use-debounce'

export interface FormProps {
  form: UseFormReturn<any, any, undefined>
  name: any
  label: string
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  cols?: number
  rows?: number
  step?: string
  fieldType?: 'command' | 'switch'
  data?: {
    label: string
    value: string
  }[]
  key?: string
  url?: string
}
export interface FormButtonProp {
  label: string
  className?: string
  icon?: React.ReactNode
  loading?: boolean
}

export default function CustomFormField({
  form,
  name,
  label,
  ...props
}: FormProps) {
  const [search, setSearch] = React.useState('')
  const [data, setData] = React.useState(props?.data)

  const getData = useApi({
    key: [props?.key!, props?.url!],
    method: 'GET',
    url: props?.url + `&q=${search}`,
  })?.get

  const [value] = useDebounce(search, 1000)

  React.useEffect(() => {
    if (props?.data?.length === 0) {
      getData?.refetch()?.then((res) => {
        setData(
          res?.data?.data?.map((item: { name?: string; id?: string }) => ({
            label: item?.name,
            value: item?.id,
          }))
        )
      })
    }
    // eslint-disable-next-line
  }, [value])

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col mb-3'>
          <FormLabel>{label}</FormLabel>

          {props?.fieldType === 'command' ? (
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'w-full justify-between',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value
                      ? data?.find((item) => item.value === field.value)?.label
                      : 'Select item'}
                    <FaSort className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align='start' className='w-full p-0'>
                <Command shouldFilter={true}>
                  <CommandInput
                    onValueChange={setSearch}
                    value={search}
                    placeholder='Search item...'
                    className='h-9'
                  />
                  <CommandEmpty>No item found.</CommandEmpty>
                  <CommandGroup>
                    {data?.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          form.setValue(name, item.value)
                        }}
                      >
                        {item.label}

                        <FaCheck
                          className={cn(
                            'ml-auto h-4 w-4',
                            item.value === field.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          ) : props?.fieldType === 'switch' ? (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          ) : (
            <FormControl>
              {props.cols && props.rows ? (
                <Textarea {...field} {...props} />
              ) : (
                <Input {...field} {...props} />
              )}
            </FormControl>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export const FormButton = ({
  label,
  className,
  type = 'submit',
  onClick,
  icon,
  loading,
  ...props
}: FormButtonProp & ButtonProps) => {
  return (
    <Button
      disabled={loading}
      type={type}
      onClick={onClick}
      className={className}
      {...props}
    >
      {loading ? (
        <FaSpinner className='mr-1 animate-spin' />
      ) : (
        icon && <span className='mr-1'>{icon}</span>
      )}

      {label}
    </Button>
  )
}
