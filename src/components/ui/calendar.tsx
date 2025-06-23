import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as ReactCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof ReactCalendar>;

function Calendar({
  className,
  tileDisabled,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("calendar-wrapper", className)}>
      <ReactCalendar
        locale="pt-BR"
        formatShortWeekday={(locale, date) => {
          return format(date, 'EEE', { locale: ptBR }).charAt(0).toUpperCase();
        }}
        tileDisabled={tileDisabled}
        className="w-full border-0 bg-transparent [&_.react-calendar__navigation]:mb-4 [&_.react-calendar__navigation__label]:text-sm [&_.react-calendar__navigation__label]:font-medium [&_.react-calendar__navigation__arrow]:h-7 [&_.react-calendar__navigation__arrow]:w-7 [&_.react-calendar__navigation__arrow]:bg-transparent [&_.react-calendar__navigation__arrow]:border [&_.react-calendar__navigation__arrow]:border-input [&_.react-calendar__navigation__arrow]:rounded-md [&_.react-calendar__navigation__arrow]:opacity-50 [&_.react-calendar__navigation__arrow]:hover:opacity-100 [&_.react-calendar__month-view__weekdays]:mb-2 [&_.react-calendar__month-view__weekdays__weekday]:text-center [&_.react-calendar__month-view__weekdays__weekday]:text-xs [&_.react-calendar__month-view__weekdays__weekday]:font-normal [&_.react-calendar__month-view__weekdays__weekday]:text-muted-foreground [&_.react-calendar__month-view__weekdays__weekday]:p-1 [&_.react-calendar__month-view__days]:grid [&_.react-calendar__month-view__days]:grid-cols-7 [&_.react-calendar__month-view__days]:gap-1 [&_.react-calendar__month-view__days__day]:h-9 [&_.react-calendar__month-view__days__day]:w-9 [&_.react-calendar__month-view__days__day]:text-center [&_.react-calendar__month-view__days__day]:text-sm [&_.react-calendar__month-view__days__day]:p-0 [&_.react-calendar__month-view__days__day]:font-normal [&_.react-calendar__month-view__days__day]:border-0 [&_.react-calendar__month-view__days__day]:bg-transparent [&_.react-calendar__month-view__days__day]:hover:bg-accent [&_.react-calendar__month-view__days__day]:hover:text-accent-foreground [&_.react-calendar__month-view__days__day]:rounded-md [&_.react-calendar__month-view__days__day]:focus:bg-accent [&_.react-calendar__month-view__days__day]:focus:text-accent-foreground [&_.react-calendar__month-view__days__day]:focus:outline-none [&_.react-calendar__month-view__days__day--selected]:bg-primary [&_.react-calendar__month-view__days__day--selected]:text-primary-foreground [&_.react-calendar__month-view__days__day--selected]:hover:bg-primary [&_.react-calendar__month-view__days__day--selected]:hover:text-primary-foreground [&_.react-calendar__month-view__days__day--today]:bg-accent [&_.react-calendar__month-view__days__day--today]:text-accent-foreground [&_.react-calendar__month-view__days__day--disabled]:text-muted-foreground [&_.react-calendar__month-view__days__day--disabled]:opacity-50 [&_.react-calendar__month-view__days__day--disabled]:hover:bg-transparent [&_.react-calendar__month-view__days__day--disabled]:hover:text-muted-foreground [&_.react-calendar__month-view__days__day--neighboringMonth]:text-muted-foreground [&_.react-calendar__month-view__days__day--neighboringMonth]:opacity-50"
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
