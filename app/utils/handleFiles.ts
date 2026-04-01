import mime from "mime-types";

async function handleFiles(files: File[], prompt: string) {
  if (!files.length) {
    return prompt;
  }

  const fileInfos = await Promise.all(
    files.map(async (file, index) => {
      const buffer = await file.arrayBuffer();
      const contend = Buffer.from(buffer).toString();
      const mimeType = mime.lookup(file.name) || "application/octet-stream";
      return `
      File ${index + 1}: ${file.name}.
      type: ${mimeType}.
      size: ${file.size}.
      content: ${contend}
      `;
    }),
  );
  const templateString = `
The user prompt is: ${prompt}

Additionally, you have access to the following files:

${fileInfos.join("\n\n")}
`;

  return templateString;
}

export default handleFiles;
