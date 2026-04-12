import React from "react";
import { MetaIcon } from "@/components/icons/simple-icons-meta";
import { GooglegeminiIcon } from "@/components/icons/simple-icons-googlegemini";
import { OpenaiIcon } from "@/components/icons/simple-icons-openai";
import CohereIcon from "@/components/icons/cohere-icon";
import GroqIcon from "@/components/icons/groq-icon";

export type ModelHashes =
  | "openai/gpt-oss-20b"
  | "openai/gpt-oss-120b"
  | "llama-3.1-8b-instant"
  | "llama-3.3-70b-versatile"
  | "groq/compound"
  | "gemini-2.5-flash"
  | "command-a-03-2025";

export type Models = Array<{
  label: string;
  description: string;
  modelHash: ModelHashes;
  provider: string;
  supportsReasoning: boolean;
  icon?: React.JSX.Element;
  supportsFiles: boolean;
  supportsTools: boolean;
  supportsBrowserSearch: boolean;
  nativeBrowserSearchFunctionality: boolean;
}>;

export const MODELS: Models = [
  {
    // Para mas detalles sobre los modelos de groq visitar: https://console.groq.com/docs/models
    label: "OpenAI GPT OSS 20B",
    description: "Rápido y eficiente",
    modelHash: "openai/gpt-oss-20b",
    provider: "groq",
    supportsReasoning: true,
    icon: React.createElement(OpenaiIcon, {
      className: "size-4 stroke-none outline-none fill-current",
    }),
    supportsFiles: true,
    supportsTools: true,
    supportsBrowserSearch: true,
    nativeBrowserSearchFunctionality: false,
  },
  {
    label: "OpenAI GPT OSS 120B",
    description:
      "Modelo avanzado con altas capacidades de resolución de problemas complejos",
    modelHash: "openai/gpt-oss-120b",
    provider: "groq",
    supportsReasoning: true,
    icon: React.createElement(OpenaiIcon, {
      className: "size-4 stroke-none outline-none fill-current",
    }),
    supportsFiles: true,
    supportsTools: true,
    supportsBrowserSearch: true,
    nativeBrowserSearchFunctionality: false,
  },
  {
    label: "Llama 3.1 8B",
    description: "Rápido y eficiente",
    modelHash: "llama-3.1-8b-instant",
    provider: "groq",
    supportsReasoning: false,
    icon: React.createElement(MetaIcon, {
      className: "size-4 stroke-none outline-none fill-current",
    }),
    supportsFiles: false,
    supportsTools: false,
    supportsBrowserSearch: false,
    nativeBrowserSearchFunctionality: true,
  },
  {
    label: "Llama 3.3 70B",
    description: "Modelo llama avanzado, excelente para tareas complejas",
    modelHash: "llama-3.3-70b-versatile",
    provider: "groq",
    supportsReasoning: false,
    icon: React.createElement(MetaIcon, {
      className: "size-4 stroke-none outline-none fill-current",
    }),
    supportsFiles: true,
    supportsTools: false,
    supportsBrowserSearch: false,
    nativeBrowserSearchFunctionality: true,
  },
  // {
  //   label: "Compound",
  //   description:
  //     "Excelente para investigaciones en la web, integra gpt y llama",
  //   modelHash: "groq/compound",
  //   provider: "groq",
  //   supportsReasoning: false,
  //   icon: React.createElement(GroqIcon, {}),
  //   supportsFiles: true,
  // },
  {
    label: "Gemini 2.5 Flash",
    description: "Rápido y eficiente",
    modelHash: "gemini-2.5-flash",
    provider: "gemini",
    supportsReasoning: false,
    icon: React.createElement(GooglegeminiIcon, {
      className: "size-4 stroke-none fill-current",
    }),
    supportsFiles: false,
    supportsTools: false,
    supportsBrowserSearch: false,
    nativeBrowserSearchFunctionality: true,
  },
  {
    label: "Command A03 2025",
    description:
      "Especializado en RAG (Retrieval-Augmented Generation) para conversaciones largas",
    modelHash: "command-a-03-2025",
    provider: "cohere",
    supportsReasoning: false,
    icon: React.createElement(CohereIcon, {}),
    supportsFiles: true,
    supportsTools: false,
    supportsBrowserSearch: false,
    nativeBrowserSearchFunctionality: true,
  },
];

export const isNotTextFile =
  /\.(png|jpg|jpeg|gif|bmp|webp|ico|svg|mp4|avi|mov|mkv|flv|wmv|mp3|wav|ogg|flac|aac|zip|rar|7z|tar|gz|bz2|exe|dll|so|dylib|bin|class|pyc|o|obj|lib|a|out|iso|img|dmg|msi|deb|rpm|apk|ipa|pdf|doc|docx|xls|xlsx|ppt|pptx|mdb|accdb|psd|ai|eps|indd|cdr|blend|fbx|obj|3ds|stl|ttf|otf|woff|woff2|eot|wasm)$/i;
