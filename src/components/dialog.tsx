'use client';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { addScam } from "@/lib/appwrite"
import { Textarea } from "./ui/textarea"
import { CalendarIcon, Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "./ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  phoneNumber: z.string().max(8),
  smsContent: z.string().min(1),
  dateReceived: z.date({
    required_error: "A received date is required.",
  }),
});

export function AddNewDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      smsContent: "",
      dateReceived: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addScam({
      phoneNumber: values["phoneNumber"] as string,
      smsContent: values["smsContent"] as string,
      dateReceived: values["dateReceived"] as Date
    })
      .then(() => {
        toast({
          title: "Success",
          description: "Record added successfully"
        });
        form.reset();
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to add the record"
        });
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
          <DialogDescription>
            Add a new record to the database.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form} >
            <form
              id="form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="7xxxxxx or 8xxxxxxx" maxLength={8} {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateReceived"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Received</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smsContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMS Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type the message here." {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>

          </Form>
        </div>
        <DialogFooter>
          <Button form="form" type="submit">
            {form.formState.isLoading && <Loader className="animate-spin" />} Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
