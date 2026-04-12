import { getLanguage, getIcon, LanguageWithIconsData } from "omni-file";
import { fileTypeFromFile, FileTypeResult } from "file-type";
import mime from "mime-types";

export type FileInfo = {
  icon: string;
  language?: LanguageWithIconsData;
  type?: FileTypeResult;
  mimeCategory?: string; // categoría del MIME (text, image, etc.)
  isCode: boolean; // true si es código según omni-file
  isMarkdown: boolean; // true si es un archivo Markdown
};

async function getFileInfo(fileName: string): Promise<FileInfo> {
  const icon = getIcon(fileName);
  const language = getLanguage(fileName);
  const mimeType = mime.lookup(fileName);
  const mimeCategory = mimeType ? mimeType.split("/")[0] : undefined;

  // Determina si es código (programming o markup)
  const isCode =
    language?.type === "programming" || language?.type === "markup";
  
  const isMarkdown = language?.name?.toLowerCase() === "markdown";

  let type: FileTypeResult | undefined;
  try {
    type = await fileTypeFromFile(fileName);
  } catch {
    // Si no se puede leer el archivo, ignoramos
  }

  return {
    icon,
    language,
    type,
    mimeCategory,
    isCode,
    isMarkdown,
  };
}

export default getFileInfo;
