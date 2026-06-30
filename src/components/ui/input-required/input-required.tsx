import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputRequiredProps{
    id:string,
    label:string;
    placeholderText:string;
    type:string;
    value:string;
    onChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputRequired({ id, placeholderText, label, type, value, onChange}: InputRequiredProps) {
  return (
    <Field>
      <FieldLabel htmlFor="input-required">
        {label} <span className="text-destructive">*</span>
      </FieldLabel>
      <Input
        id={id}
        type={type}
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        required
      />
      <FieldDescription>Este campo no puede estar vacío.</FieldDescription>
    </Field>
  )
}
