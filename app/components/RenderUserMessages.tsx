const RenderUserMessage = ({ userMessage }: { userMessage: string }) => {
  return (
    <div
      className={`p-3 rounded-lg w-fit bg-neutral-200 my-2
          text-neutral-950 dark:bg-neutral-200 dark:text-neutral-800 text-right
          ml-auto max-w-[80%]`}
    >
      <p className="text-sm font-bold mb-1">Tú</p>
      <p className="text-md">{userMessage}</p>
    </div>
  );
};
export default RenderUserMessage;
