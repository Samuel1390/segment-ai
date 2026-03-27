"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
export const GEMINI_ERRORS = [
  {
    code: "401",
    label: "Error de Autenticación",
    description:
      "La clave de API no es válida o ha expirado. Verifica tus variables de entorno (.env).",
  },
  {
    code: "400",
    label: "Solicitud Inválida",
    description:
      "La estructura de la petición es incorrecta o el prompt enviado está vacío.",
  },
  {
    code: "429",
    label: "Límite de Consultas Agotado",
    description:
      "Has superado la cuota de peticiones permitidas para el plan gratuito. Espera un minuto antes de intentar de nuevo.",
  },
  {
    code: "408",
    label: "Tiempo de Espera Agotado",
    description:
      "La conexión con los servidores de Google tardó demasiado. Revisa tu estabilidad de red.",
  },
  {
    code: "451",
    label: "Contenido Bloqueado",
    description:
      "La respuesta fue bloqueada por los filtros de seguridad de la IA debido a contenido sensible o prohibido.",
  },
  {
    code: "500",
    label: "Error de Google AI",
    description:
      "Ocurrió un error interno en los servidores de Gemini. No es un error de tu código.",
  },
  {
    code: "503",
    label: "Servicio no Disponible",
    description:
      "El modelo está temporalmente sobrecargado o bajo mantenimiento. Inténtalo más tarde.",
  },
  {
    code: "500",
    label: "Error Desconocido",
    description: "Ha ocurrido un error inesperado al procesar la solicitud.",
  },
  {
    code: "404",
    label: "Modelo no encontrado",
    description: "El modelo solicitado no existe.",
  },
] as const;
export type GeminiErrorType = (typeof GEMINI_ERRORS)[number]["code"];
interface GeminiErrorProps {
  code: GeminiErrorType;
  open: boolean;
  setOpen: (value: boolean) => void;
}

function GeminiError({ code, open, setOpen }: GeminiErrorProps) {
  const error = GEMINI_ERRORS.filter((error) => error.code == code)[0];
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogTitle>{error.label}</AlertDialogTitle>
        <AlertDialogDescription>{error.description}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setOpen(false)}>
            Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default GeminiError;
