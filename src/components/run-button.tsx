export interface RunButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function RunButton({ onClick, disabled }: RunButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      class="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      Run
    </button>
  );
}
