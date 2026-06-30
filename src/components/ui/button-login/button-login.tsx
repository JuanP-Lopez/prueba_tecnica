import { LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"

type InputRequiredProps = {
  placeholderText: string,
};

export function ButtonLogin({placeholderText} : InputRequiredProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">{placeholderText}<LogIn /></Button>
    </div>
  )
}
