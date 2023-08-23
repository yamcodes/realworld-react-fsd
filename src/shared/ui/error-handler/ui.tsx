type ErrorHandlerProps = {
  error: string;
};

export function ErrorHandler(props: ErrorHandlerProps) {
  const { error } = props;

  if (!error) throw new Error(JSON.stringify(error));

  return (
    <ul className="error-messages">
      <li key={error}>{error}</li>
    </ul>
  );
}
