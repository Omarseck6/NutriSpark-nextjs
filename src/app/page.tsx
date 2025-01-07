"use client";

import { useRouter } from "next/navigation";
import { IFoodReduced, IFood } from "@/types";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [foods, setFoods] = useState<IFoodReduced[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFoods = async () => {
    try {
      const response = await fetch("/api/foods/all");
      const data = await response.json();
      const foodsReduced: IFoodReduced[] = data.map((food: IFood) => ({
        value: food.name.toLowerCase().replace(/ /g, "-"),
        label: food.name,
      }));
      setFoods(foodsReduced);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchFoods();
      setIsLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (value.length > 0) {
      router.push(`/food/${value}`);
    }
  }, [value]);

  return (
    <>
      {!isLoading ? (
        <div
          className="flex flex-col justify-center p-6 
        items-center min-h-screen text-white"
        >
          <h1 className="text-5xl font-extrabold mb-4">
            Welcom to <span className="title_colored">NutriSpark</span>
          </h1>
          <p className="text-lg mb-8 text-center max-w-2xl">
            NutriSpark is a simple and easy to use nutrition tracking app. Start
            by selecting a food from the list below.
          </p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[300px] justify-between"
              >
                {value
                  ? foods.find((food) => food.value === value)?.label
                  : "Select food..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search food..." />
                <CommandList>
                  <CommandEmpty>No food found.</CommandEmpty>
                  <CommandGroup>
                    {foods.map((food) => (
                      <CommandItem
                        key={food.value}
                        value={food.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === food.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {food.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen text-white">
          <p className="text-2xl">Loading...</p>
        </div>
      )}
    </>
  );
}
