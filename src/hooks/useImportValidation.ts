import React, { useMemo, useState } from 'react';
import { z } from 'zod';
import { CreateDrawSchema, type DrawRowInput } from '../lib/schemas';

interface RowValidationResult {
  row: DrawRowInput;
  isValid: boolean;
  errors: z.ZodIssue[];
}

interface UseImportValidationReturn {
  validRows: DrawRowInput[];
  invalidRows: RowValidationResult[];
  rowErrors: Map<number, z.ZodIssue[]>;
  validateRows: (rows: DrawRowInput[]) => void;
  clearValidation: () => void;
}

export const useImportValidation = (): UseImportValidationReturn => {
  const [validRows, setValidRows] = useState<DrawRowInput[]>([]);
  const [invalidRows, setInvalidRows] = useState<RowValidationResult[]>([]);
  const [rowErrors, setRowErrors] = useState<Map<number, z.ZodIssue[]>>(new Map());

  const validateRows = useMemo(
    () =>
      (rows: DrawRowInput[]) => {
        const valid: DrawRowInput[] = [];
        const invalid: RowValidationResult[] = [];
        const errors = new Map<number, z.ZodIssue[]>();

        rows.forEach((row, index) => {
          const result = CreateDrawSchema.safeParse(row);
          if (result.success) {
            valid.push(row);
          } else {
            invalid.push({ row, isValid: false, errors: result.error.issues });
            errors.set(index, result.error.issues);
          }
        });

        setValidRows(valid);
        setInvalidRows(invalid);
        setRowErrors(errors);
      },
    []
  );

  const clearValidation = useMemo(
    () => () => {
      setValidRows([]);
      setInvalidRows([]);
      setRowErrors(new Map());
    },
    []
  );

  return {
    validRows,
    invalidRows,
    rowErrors,
    validateRows,
    clearValidation,
  };
};

export default useImportValidation;