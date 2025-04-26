
"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { ptBR } from 'date-fns/locale'; // Import Brazilian Portuguese locale
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"; // Import Input
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
    placeholder?: string; // Add placeholder prop
}


export function DatePicker({ date, setDate, className, required, disabled, placeholder = "dd/MM/yyyy", ...props }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState<string>(date ? format(date, "dd/MM/yyyy") : "");
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  React.useEffect(() => {
    // Update input value when the date prop changes from outside
    setInputValue(date ? format(date, "dd/MM/yyyy") : "");
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    // Try to parse the input value when the input loses focus
    const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date());
    if (!isNaN(parsedDate.getTime())) {
        // Check if the parsed date is valid and not disabled
        if (!disabled || !disabled(parsedDate)) {
            setDate(parsedDate);
        } else {
             // Revert to the original date if the new date is disabled
             setInputValue(date ? format(date, "dd/MM/yyyy") : "");
        }
    } else {
      // If parsing fails, revert to the last valid date or empty
      setInputValue(date ? format(date, "dd/MM/yyyy") : "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handleInputBlur(); // Parse on Enter key press
      }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
        if (!disabled || !disabled(selectedDate)) {
            setDate(selectedDate);
            setInputValue(format(selectedDate, "dd/MM/yyyy"));
            setIsPopoverOpen(false); // Close popover on selection
        }
    } else {
        setDate(undefined);
        setInputValue("");
        setIsPopoverOpen(false);
    }
  };


  return (
    <div className={cn("relative flex items-center", className)} {...props}>
       <Input
           type="text"
           value={inputValue}
           onChange={handleInputChange}
           onBlur={handleInputBlur}
           onKeyDown={handleKeyDown} // Add keydown handler
           placeholder={placeholder}
           className={cn(
               "pr-10", // Add padding to make space for the calendar icon button
                // Add error styling if needed based on validation
                // Example: !isNaN(parse(inputValue, 'dd/MM/yyyy', new Date()).getTime()) ? "" : "border-destructive"
           )}
           required={required}
           disabled={!!disabled} // Disable input if calendar is disabled
       />
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"} // Changed to ghost for icon only
              size="icon"
              className={cn(
                "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7", // Position icon button inside the input
                !date && "text-muted-foreground"
              )}
              disabled={!!disabled}
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="sr-only">Abrir calendário</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
            //   onSelect={setDate} // Use handleDateSelect instead
              onSelect={handleDateSelect}
              initialFocus
              locale={ptBR} // Set locale to Brazilian Portuguese
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
    </div>
  )
}
