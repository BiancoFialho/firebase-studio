
"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from 'date-fns/locale'; // Import Brazilian Portuguese locale
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    required?: boolean;
    disabled?: (date: Date) => boolean;
}


export function DatePicker({ date, setDate, className, required, disabled, ...props }: DatePickerProps) {

  return (
    <div className={cn("grid gap-2", className)} {...props}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={ptBR} // Set locale to Brazilian Portuguese
              disabled={disabled}
              required={required} // Pass required prop if needed by Calendar internal logic
            />
          </PopoverContent>
        </Popover>
    </div>
  )
}
