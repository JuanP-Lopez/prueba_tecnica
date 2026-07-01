import { CheckCircle2Icon, InfoIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

type InputRequiredProps = {
  attemps?: any,
};

export function AttempsDialog({attemps} : InputRequiredProps) {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert variant="destructive" >
        <CheckCircle2Icon />
        <AlertTitle>Demasiados intentos fallidos de inicio de sesión</AlertTitle>
        <AlertDescription>
          {attemps}
        </AlertDescription>
      </Alert>
    </div>
  )
}
