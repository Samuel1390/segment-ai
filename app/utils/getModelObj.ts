import { MODELS, Models } from "../constants";
import type { ModelHashes } from "../constants";

function getModelObj(modelHash: ModelHashes): Models[number] {
  // Recupera el provaider para asegurarnos de que el modelo esta correcto en el frontend
  const modelObj = MODELS.find((mdl) => mdl.modelHash === modelHash);
  if (!modelObj) {
    // Si ves este error revisa el frontend, no deberia pasar (eso espero),
    // si no revisa el archivo constants.ts y si aun no ves el error corre alas server
    // fuctions y ve chatFormAction.ts
    throw new Error("Modelo no soportado");
  }
  return modelObj;
}

export default getModelObj;
