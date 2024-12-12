export type MessageResponse = {
  success: boolean;
  error?: string;
};

export type FillFormMessage = {
  action: 'fillForm';
};

export function isFillFormMessage(
  message: unknown,
): message is FillFormMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'action' in message &&
    message.action === 'fillForm'
  );
}
