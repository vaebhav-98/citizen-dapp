
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBlockchain } from "@/hooks/use-blockchain";
import { useState } from "react";
import { Loader2 } from "lucide-react";


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().int().positive().min(1, { message: "Age must be a positive number." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  someNote: z.string().optional(),
});

export function CitizenForm() {
  const { submitCitizen, networkInfo } = useBlockchain();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConnected, isCorrectNetwork } = networkInfo;


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      city: "",
      someNote: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await submitCitizen({
        name: data.name,
        age: data.age,
        city: data.city,
        someNote: data.someNote || "",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = !isConnected || !isCorrectNetwork || isSubmitting;

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Add New Citizen</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" disabled={isFormDisabled} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="25" 
                      disabled={isFormDisabled}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? undefined : parseInt(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" disabled={isFormDisabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="someNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional information about this citizen..."
                    className="resize-none" 
                    disabled={isFormDisabled} 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isFormDisabled}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Add Citizen to Registry"
            )}
          </Button>
          
          {!isConnected && (
            <p className="text-center text-sm text-muted-foreground">
              Please connect your wallet to add a citizen.
            </p>
          )}
          {isConnected && !isCorrectNetwork && (
            <p className="text-center text-sm text-muted-foreground">
              Please switch to Sepolia Test Network to add a citizen.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
