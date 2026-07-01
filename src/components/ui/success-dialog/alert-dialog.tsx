import { CheckCircle2Icon, InfoIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

type InputRequiredProps = {
  message: any,
};

export function SuccessDialog({message} : InputRequiredProps) {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert variant="success" >
        <CheckCircle2Icon />
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
    </div>
  )
}
