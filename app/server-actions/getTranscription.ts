"use server";

const getTranscription = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("audio", blob);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/transcriptions`,
    {
      method: "POST",
      body: formData,
    },
  );
  const data = await response.json();
  return data.text;
};
export default getTranscription;
