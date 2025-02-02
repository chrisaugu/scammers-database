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
import { Loader } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "./ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  phoneNumber: z.string().max(8),
  smsContent: z.string().min(1),
  dateReceived: z.string().min(1),
});

export function AddNewDialog() {
  const [date, setDate] = useState<Date | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      smsContent: "",
      dateReceived: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addScam({
      phoneNumber: values["phoneNumber"] as string,
      smsContent: values["smsContent"] as string,
      dateReceived: values["dateReceived"] as string
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
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
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
                      <Input placeholder="8xxxxxxx" maxLength={8} {...field} />
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
                  <FormItem>
                    <FormLabel>Date Received</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />

                      {/* <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover> */}
                    </FormControl>
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
            {form.formState.isLoading && <Loader className="animate-spin"/>} Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
