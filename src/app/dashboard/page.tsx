import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AlertDialog } from "@/components/ui/alert-dialog/alert-dialog";

export default function Dashboard(){
    return (
        <div className=" flex flex-col justify-center items-center bg-background text-foreground min-h-screen m-2 gap-2">
      {/* <ModeToggle /> */}

      <Card className="w-full p-4 items-center">
          <CardDescription>
            Welcome Full Name! To logout click here
          </CardDescription>
      </Card>

      <AlertDialog/>
    </div>
    )
}