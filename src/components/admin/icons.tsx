import React from 'react';

export const ChevronDownIcon: React.FC<{
  className?: string;
  'aria-hidden'?: boolean;
  'data-testid'?: string;
}> = ({ className = '', 'aria-hidden': ariaHidden = true, 'data-testid': testId }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
    data-testid={testId}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const ChevronUpIcon: React.FC<{
  className?: string;
  'aria-hidden'?: boolean;
  'data-testid'?: string;
}> = ({ className = '', 'aria-hidden': ariaHidden = true, 'data-testid': testId }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
    data-testid={testId}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden={ariaHidden}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export const AlertCircleIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden={ariaHidden}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-7a1 1 0 10-2 0v4a1 1 0 102 0V11zm1-9a1 1 0 100 2 1 1 0 000-2z"
      clipRule="evenodd"
    />
  </svg>
);

export const UploadIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

export const FileIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export const XIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const SpinnerIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    className={`${className} animate-spin`}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const ErrorIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden={ariaHidden}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-7a1 1 0 10-2 0v4a1 1 0 102 0V11zm1-9a1 1 0 100 2 1 1 0 000-2z"
      clipRule="evenodd"
    />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden={ariaHidden}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10 6.293 12.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293a1 1 0 00-1.414-1.414L10 8.586 12.293 6.293a1 1 0 00-1.414-1.414L8.586 8 6.293 5.707a1 1 0 00-1.414 0L5.707 7.707 7.707 9.707a1 1 0 000 1.414L8.586 11 6.293 13.293a1 1 0 001.414 1.414L10 12.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
      clipRule="evenodd"
    />
  </svg>
);

export const CalendarIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export const EyeIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = ({
  className = '',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);
