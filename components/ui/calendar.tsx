import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-3",
        caption_label: "text-lg font-serif font-bold text-primary tracking-widest uppercase",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "luxury" }),
          "h-8 w-8 p-0 border-primary/40 hover:border-primary transition-all duration-300"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-2",
        head_row: "flex mb-4",
        head_cell:
          "text-primary/60 rounded-md w-10 h-6 font-semibold text-xs flex items-center justify-center uppercase tracking-tighter",
        row: "flex w-full mt-2",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/30 [&:has([aria-selected])]:bg-accent/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium text-foreground-accent/80 hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-full"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-black hover:bg-primary-light hover:text-black focus:bg-primary focus:text-black shadow-gold rounded-full font-bold",
        day_today: "bg-primary/5 text-primary border border-primary/40 font-bold rounded-full",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-40 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}

      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
