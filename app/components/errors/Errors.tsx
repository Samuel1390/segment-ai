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
import React from "react";
import {
  InfoIcon,
  TimerIcon,
  MessageCircleX,
  UserRoundX,
  CircleX,
  ServerCrashIcon,
} from "lucide-react";

type ModelError = {
  code: number | string;
  label: string;
  description: string;
  tip: string;
  icon?: React.JSX.Element;
};

export const MODEL_ERRORS = [
  {
    code: 400,
    label: "Solicitud Incorrecta",
    description:
      "El mensaje llegó con un formato que el sistema no logra procesar.",
    tip: "Revisa que el texto no tenga caracteres extraños y vuelve a intentarlo.",
    icon: React.createElement(MessageCircleX, { className: "w-4 h-4" }),
  },
  {
    code: 401,
    label: "No Autorizado",
    description:
      "El sistema no reconoce tu llave de acceso o esta ha caducado.",
    tip: "Verifica que tu cuenta esté activa o que la configuración sea correcta.",
    icon: React.createElement(UserRoundX, { className: "w-4 h-4" }),
  },
  {
    code: 403,
    label: "Acceso Prohibido",
    description:
      "No tienes permiso para usar este recurso específico en este momento.",
    tip: "Contacta al administrador para revisar tus permisos de acceso.",
    icon: React.createElement(UserRoundX, { className: "w-4 h-4" }),
  },
  {
    code: 404,
    label: "No Encontrado",
    description:
      "Lo que estás buscando ya no existe o la dirección es errónea.",
    tip: "Verifica que el nombre del modelo seleccionado sea el correcto.",
    icon: React.createElement(CircleX, { className: "w-4 h-4" }),
  },
  {
    code: 413,
    label: "Mensaje Demasiado Largo",
    description:
      "El texto o el archivo enviado es demasiado grande para el sistema.",
    tip: "Intenta resumir tu petición o dividir el archivo en partes más pequeñas.",
    icon: React.createElement(MessageCircleX, { className: "w-4 h-4" }),
  },
  {
    code: 422,
    label: "Contenido no Procesable",
    description:
      "El sistema entendió el mensaje, pero los datos tienen errores lógicos.",
    tip: "Revisa la información que enviaste o intenta redactar tu pregunta de otra forma.",
    icon: React.createElement(MessageCircleX, { className: "w-4 h-4" }),
  },
  {
    code: 424,
    label: "Fallo de Conexión Externa",
    description:
      "Un servicio externo necesario para completar la tarea no respondió a tiempo.",
    tip: "Espera unos segundos y vuelve a intentar la operación.",
    icon: React.createElement(TimerIcon, { className: "w-4 h-4" }),
  },
  {
    code: 429,
    label: "Demasiadas Solicitudes",
    description:
      "Has enviado muchos mensajes en poco tiempo, espera un momento.",
    tip: "Ten un poco de paciencia y espera un minuto antes de enviar otro mensaje.",
    icon: React.createElement(TimerIcon, { className: "w-4 h-4" }),
  },
  {
    code: 498,
    label: "Capacidad Máxima Alcanzada",
    description:
      "El servidor está muy ocupado atendiendo a otros usuarios en este momento.",
    tip: "Inténtalo de nuevo en unos minutos cuando haya menos tráfico.",
    icon: React.createElement(ServerCrashIcon, { className: "w-4 h-4" }),
  },
  {
    code: 499,
    label: "Solicitud Cancelada",
    description:
      "La operación se detuvo porque se cerró la conexión o fue cancelada.",
    tip: "Si no fue tu intención cancelarla, intenta enviar el mensaje de nuevo.",
    icon: React.createElement(ServerCrashIcon, { className: "w-4 h-4" }),
  },
  {
    code: 500,
    label: "Error Interno del Servidor",
    description:
      "El servidor encontró un error inesperado al procesar tu solicitud.",
    tip: "Inténtalo de nuevo en unos momentos.",
    icon: React.createElement(ServerCrashIcon, { className: "w-4 h-4" }),
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
  let error = MODEL_ERRORS.find((error) => error.code == code);
  if (!error) {
    error = MODEL_ERRORS[MODEL_ERRORS.length - 1]; // Desconocido
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogTitle>
          <div className="flex items-center gap-2">
            {error.icon}
            {error.label}
          </div>
        </AlertDialogTitle>
        <AlertDialogDescription>{error.description}</AlertDialogDescription>
        <AlertDialogDescription className="text-[0.76rem] bg-amber-400/30 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 rounded-md p-2 border border-amber-400/30 dark:border-amber-400">
          <InfoIcon size={13} className="inline-block" /> Tip: {error.tip}
        </AlertDialogDescription>
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
