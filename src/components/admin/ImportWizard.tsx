import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FileDropzone } from '../ui/FileDropzone';
import { PolicySelect } from './PolicySelect';
import { ImportPreviewTable } from './ImportPreviewTable';
import { ImportProgress } from './ImportProgress';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import Toast from '../ui/Toast';
import { UploadIcon, FileIcon, XIcon, CheckIcon, ErrorIcon } from './icons';
import { useImportValidation } from '../../hooks/useImportValidation';
import { useImportCommit } from '../../hooks/useImportCommit';
import { getApiClient } from '../../lib/api/client';
import type { DrawRowInput, ImportPolicy, ImportPreviewResponse, ImportPreviewRow, ImportProgressStage } from '../../lib/schemas';

interface Props {
  onImportSuccess?: () => void;
}

type WizardStep = 'upload' | 'preview' | 'confirm' | 'progress' | 'result';

interface ParsedFileResult {
  rows: DrawRowInput[];
  parseErrors: { row: number; field: string; message: string }[];
  file: File;
}

interface ImportResult {
  success: boolean;
  created?: number;
  updated?: number;
  skipped?: number;
  failed?: number;
  errors?: { row: number; field: string; message: string }[];
  message?: string;
}

export const ImportWizard: React.FC<Props> = ({ onImportSuccess }) => {
  const [step, setStep] = useState<WizardStep>('upload');
  const [parsedFile, setParsedFile] = useState<ParsedFileResult | null>(null);
  const [importId, setImportId] = useState<string | null>(null);
  const [policy, setPolicy] = useState<ImportPolicy>('skip');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const { validRows, invalidRows, rowErrors, validateRows, clearValidation } = useImportValidation();
  const { preview, commit, isLoading, error: commitError, clearError: clearCommitError } = useImportCommit();

  const workerRef = useRef<Worker | null>(null);
  const progressStageRef = useRef<ImportProgressStage>('processing');
  const progressValueRef = useRef(0);

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('../../workers/importParser.ts', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === 'PARSE_COMPLETE') {
        const { rows, parseErrors } = payload;
        setParsedFile({ rows, parseErrors, file: parsedFile!.file });
        validateRows(rows);
        setStep('preview');
      } else if (type === 'PARSE_ERROR') {
        setToast({ type: 'error', title: 'Error al procesar', message: payload.message });
        setStep('upload');
      } else if (type === 'PROGRESS') {
        progressValueRef.current = payload.progress;
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [validateRows]);

  const handleFileSelected = useCallback((file: File | null) => {
    if (!file) {
      setParsedFile(null);
      clearValidation();
      return;
    }

    setStep('upload');
    setToast(null);
    clearCommitError();

    if (workerRef.current) {
      workerRef.current.postMessage({ file, type: file.name.endsWith('.xlsx') ? 'xlsx' : 'csv' });
    }
  }, [clearValidation, clearCommitError]);

  const handlePreview = useCallback(async () => {
    if (!parsedFile || validRows.length === 0) return;

    setStep('progress');
    progressStageRef.current = 'processing';
    progressValueRef.current = 0;

    const result = await preview(validRows);

    if (result) {
      setImportId(result.importId);
      // Convert to preview table format
      const previewRows: ImportPreviewRow[] = parsedFile.rows.map((row, index) => {
        const errors = rowErrors.get(index) || [];
        return {
          rowNumber: index + 1,
          date: row.drawDate,
          modality: row.results[0]?.modality || '',
          tradicional: row.results.find(r => r.modality === 'TRADICIONAL')?.numbers || null,
          laSegunda: row.results.find(r => r.modality === 'LA_SEGUNDA')?.numbers || null,
          revancha: row.results.find(r => r.modality === 'REVANCHA')?.numbers || null,
          siempreSale: row.results.find(r => r.modality === 'SIEMPRE_SALE')?.numbers || null,
          reintegro: null,
          isValid: errors.length === 0,
          errors: errors.map(e => ({ rowNumber: index + 1, field: e.path.join('.'), message: e.message, rawValue: undefined })),
        };
      });

      // Select all valid rows by default
      const initialSelection = new Set(previewRows.filter(r => r.isValid).map((_, i) => i));
      setSelectedRows(initialSelection);

      setStep('preview');
    } else if (commitError) {
      setToast({ type: 'error', title: 'Error en vista previa', message: commitError.message });
      setStep('preview');
    }
  }, [parsedFile, validRows, rowErrors, preview, commitError]);

  const handleConfirm = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleCommit = useCallback(async () => {
    if (!importId) return;

    setShowConfirmModal(false);
    setStep('progress');
    progressStageRef.current = 'committing';
    progressValueRef.current = 0;

    const result = await commit(importId, policy, (progress) => {
      progressValueRef.current = progress.progress;
      progressStageRef.current = progress.stage;
    });

if (result) {
        setToast({
          type: 'success',
          title: 'Importación completada',
          message: `Creados: ${result.created}, Actualizados: ${result.updated}, Omitidos: ${result.skipped}, Fallidos: ${result.failed}`,
        });
        setStep('result');
        // Dispatch custom event for cross-tab refresh
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('draws:refresh'));
        }
        onImportSuccess?.();
      } else if (commitError) {
      setToast({ type: 'error', title: 'Error en importación', message: commitError.message });
      setStep('result');
    }
  }, [importId, policy, commit, commitError, onImportSuccess]);

  const handleRowSelect = useCallback((rowIndex: number, selected: boolean) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (selected) next.add(rowIndex);
      else next.delete(rowIndex);
      return next;
    });
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'preview') setStep('upload');
    else if (step === 'confirm') setStep('preview');
    else if (step === 'progress') setStep('confirm');
  }, [step]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setParsedFile(null);
    setImportId(null);
    setPolicy('skip');
    setSelectedRows(new Set());
    clearValidation();
    clearCommitError();
    setToast(null);
  }, [clearValidation, clearCommitError]);

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <UploadIcon className="size-16 mx-auto text-neutral-400 dark:text-neutral-500" aria-hidden={true} />
        <h2 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Importar sorteos masivamente
        </h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Carga un archivo CSV o XLSX con los sorteos a importar
        </p>
      </div>

      <FileDropzone
        accept=".csv,.xlsx"
        maxSize={10 * 1024 * 1024}
        onFileSelected={handleFileSelected}
        onError={(msg) => setToast({ type: 'error', title: 'Error', message: msg })}
      />

      <div className="text-sm text-neutral-500 dark:text-neutral-400 space-y-1">
        <p>• Formato: CSV (UTF-8) o Excel (.xlsx)</p>
        <p>• Columnas requeridas: officialNumber, drawDate, modality, numbers</p>
        <p>• Máximo 10 MB / 10,000 filas</p>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );

  const renderPreviewStep = () => {
    const previewRows: ImportPreviewRow[] = parsedFile?.rows.map((row, index) => {
      const errors = rowErrors.get(index) || [];
      return {
        rowNumber: index + 1,
        date: row.drawDate,
        modality: row.results[0]?.modality || '',
        tradicional: row.results.find(r => r.modality === 'TRADICIONAL')?.numbers || null,
        laSegunda: row.results.find(r => r.modality === 'LA_SEGUNDA')?.numbers || null,
        revancha: row.results.find(r => r.modality === 'REVANCHA')?.numbers || null,
        siempreSale: row.results.find(r => r.modality === 'SIEMPRE_SALE')?.numbers || null,
        reintegro: null,
        isValid: errors.length === 0,
        errors: errors.map(e => ({ rowNumber: index + 1, field: e.path.join('.'), message: e.message, rawValue: undefined })),
      };
    }) || [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Vista previa ({validRows.length} válidas, {invalidRows.length} inválidas)
          </h2>
          <Button variant="secondary" onClick={() => setStep('upload')}>
            Cambiar archivo
          </Button>
        </div>

        <ImportPreviewTable
          rows={previewRows}
          onRowSelect={handleRowSelect}
          selectedRows={selectedRows}
        />

        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            {selectedRows.size} de {validRows.length} filas válidas seleccionadas
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleBack}>
              Atrás
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={validRows.length === 0 || selectedRows.size === 0}
            >
              Continuar
            </Button>
          </div>
        </div>

        {toast && (
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  };

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Confirmar importación
      </h2>

      <PolicySelect
        value={policy}
        onChange={setPolicy}
        validCount={selectedRows.size}
      />

      <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">Resumen</h3>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500 dark:text-neutral-400">Filas seleccionadas:</dt>
            <dd className="font-medium text-neutral-900 dark:text-neutral-100">{selectedRows.size}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500 dark:text-neutral-400">Política de conflicto:</dt>
            <dd className="font-medium text-neutral-900 dark:text-neutral-100 capitalize">{policy}</dd>
          </div>
        </dl>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={handleBack}>
          Atrás
        </Button>
        <Button variant="primary" onClick={handleCommit} disabled={isLoading}>
          {isLoading ? 'Procesando...' : 'Confirmar e importar'}
        </Button>
      </div>
    </div>
  );

  const renderProgressStep = () => (
    <div className="space-y-6 text-center">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        {progressStageRef.current === 'processing' ? 'Procesando archivo...' : 'Guardando sorteos...'}
      </h2>

      <ImportProgress
        importId={importId || ''}
        stage={progressStageRef.current}
        progress={progressValueRef.current}
        onComplete={(success) => {
          if (success) {
            setToast({
              type: 'success',
              title: 'Completado',
              message: 'La importación se ha completado exitosamente',
            });
            setStep('result');
            onImportSuccess?.();
          }
        }}
        onError={(err) => {
          setToast({ type: 'error', title: 'Error', message: err.message });
          setStep('result');
        }}
      />
    </div>
  );

  const renderResultStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto size-16 rounded-full flex items-center justify-center bg-success-100 dark:bg-success-900/30">
        <CheckIcon className="size-8 text-success-600 dark:text-success-400" aria-hidden={true} />
      </div>
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Importación completada
      </h2>
      {toast?.message && (
        <p className="text-neutral-500 dark:text-neutral-400">{toast.message}</p>
      )}

      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={handleReset}>
          Nueva importación
        </Button>
        <Button variant="primary" onClick={handleReset}>
          Volver a sorteos
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {step === 'upload' && renderUploadStep()}
      {step === 'preview' && renderPreviewStep()}
      {step === 'confirm' && renderConfirmStep()}
      {step === 'progress' && renderProgressStep()}
      {step === 'result' && renderResultStep()}

      {showConfirmModal && (
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirmar importación"
          size="md"
        >
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Se importarán <strong>{selectedRows.size}</strong> sorteos con la política <strong>{policy}</strong>.
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCommit} disabled={isLoading}>
              Confirmar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ImportWizard;