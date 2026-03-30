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
export const MODEL_ERRORS = [
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
      "Has superado la cuota de peticiones permitidas. Intentalo con otro modelo o espera un minuto.",
  },
  {
    code: "408",
    label: "Tiempo de Espera Agotado",
    description:
      "La conexión con los servidores del modelo tardó demasiado. Revisa tu estabilidad de red.",
  },
  {
    code: "451",
    label: "Contenido Bloqueado",
    description:
      "La respuesta fue bloqueada por los filtros de seguridad de la IA debido a contenido sensible o prohibido.",
  },
  {
    code: "500",
    label: "Error del Modelo",
    description:
      "Ocurrió un error interno en los servidores del modelo. Intentalo con otro modelo.",
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

export type ModelErrorType = (typeof MODEL_ERRORS)[number]["code"];
export type ModelErrorObj = { error: ModelErrorType };
interface ModelErrorProps {
  code: ModelErrorType;
  open: boolean;
  setOpen: (value: boolean) => void;
}

function ModelError({ code, open, setOpen }: ModelErrorProps) {
  const error = MODEL_ERRORS.filter((error) => error.code == code)[0];
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
export default ModelError;
