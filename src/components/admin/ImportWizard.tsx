import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FileDropzone } from '../ui/FileDropzone';
import { PolicySelect } from './PolicySelect';
import { ImportPreviewTable } from './ImportPreviewTable';
import { ImportProgress } from './ImportProgress';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import Toast from '../ui/Toast';
import { UploadIcon, CheckIcon, ErrorIcon } from './icons';
import { useImportValidation } from '../../hooks/useImportValidation';
import { useImportCommit } from '../../hooks/useImportCommit';
import type { ImportParserInput, ImportParserOutput } from '../../lib/types/import-worker';
import type {
  DrawRowInput,
  ImportPolicy,
  ImportPreviewRow,
  ImportProgressStage,
} from '../../lib/schemas';

interface Props {
  onImportSuccess?: () => void;
}

type WizardStep = 'upload' | 'preview' | 'confirm' | 'progress' | 'result';

interface ParsedFileResult {
  rows: DrawRowInput[];
  parseErrors: { row: number; field?: string; message: string }[];
  file: File;
}

const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const ImportWizard: React.FC<Props> = ({ onImportSuccess }) => {
  const [step, setStep] = useState<WizardStep>('upload');
  const [parsedFile, setParsedFile] = useState<ParsedFileResult | null>(null);
  const [importId, setImportId] = useState<string | null>(null);
  const [policy, setPolicy] = useState<ImportPolicy>('skip');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const { validRows, invalidRows, rowErrors, validateRows, clearValidation } =
    useImportValidation();
  const { preview, commit, isLoading, clearError: clearCommitError } = useImportCommit();

  const workerRef = useRef<Worker | null>(null);
  const progressStageRef = useRef<ImportProgressStage>('processing');
  const progressValueRef = useRef(0);
  const currentFileRef = useRef<File | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    console.log('[ImportWizard] step changed:', step);
    setRenderKey((k) => k + 1);
  }, [step]);

  // Initialize worker (client-side only)
  useEffect(() => {
    console.log('[ImportWizard] Initializing worker');
    if (typeof Worker !== 'undefined') {
      console.log('[ImportWizard] Worker API available, creating worker');
      workerRef.current = new Worker(new URL('../../workers/importParser.ts', import.meta.url), {
        type: 'module',
      });

      workerRef.current.onmessage = (e: MessageEvent<ImportParserOutput>) => {
        const message = e.data;
        console.log('[ImportWizard] worker message received:', message);
        if (message.type === 'RESULT') {
          const { rows, parseErrors } = message;
          if (!currentFileRef.current) return;
          setParsedFile({ rows, parseErrors, file: currentFileRef.current });
          // Pre-select rows so the continue action is available immediately;
          // the preview effect narrows this down to schema-valid rows.
          setSelectedRows(new Set(rows.map((_, index) => index)));
          validateRows(rows);
          setStep('preview');
        } else if (message.type === 'ERROR') {
          console.log('[ImportWizard] worker ERROR message:', message.message);
          setToast({ type: 'error', title: 'Error al procesar', message: message.message });
          setStep('upload');
        } else if (message.type === 'PROGRESS') {
          progressValueRef.current = message.total > 0 ? message.parsed / message.total : 0;
        }
      };
    } else {
      console.log('[ImportWizard] Worker API NOT available');
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, [validateRows]);

  // Select every valid row by default when entering the preview step
  useEffect(() => {
    if (step !== 'preview' || !parsedFile) return;

    const validIndices = parsedFile.rows
      .map((_, index) => index)
      .filter((index) => (rowErrors.get(index)?.length ?? 0) === 0);

    setSelectedRows(new Set(validIndices));
  }, [step, parsedFile, rowErrors]);

  const handleFileSelected = useCallback(
    (file: File | null) => {
      if (!file) {
        setParsedFile(null);
        currentFileRef.current = null;
        clearValidation();
        return;
      }

      currentFileRef.current = file;
      setStep('upload');
      setToast(null);
      clearCommitError();

      const worker = workerRef.current;
      if (!worker) {
        console.log('[ImportWizard] No worker available');
        return;
      }

      const mimeType = file.type || (file.name.endsWith('.xlsx') ? XLSX_MIME_TYPE : 'text/csv');
      console.log('[ImportWizard] Sending file to worker:', { fileName: file.name, mimeType });

      void file.arrayBuffer().then((buffer) => {
        const input: ImportParserInput = { file: buffer, fileName: file.name, mimeType };
        console.log('[ImportWizard] Posting message to worker:', input);
        worker.postMessage(input);
      });
    },
    [clearValidation, clearCommitError]
  );

  const handlePreview = useCallback(async () => {
    console.log('[ImportWizard] handlePreview called', { parsedFile, validRows, step });
    if (!parsedFile || validRows.length === 0) {
      console.log('[ImportWizard] handlePreview returning early - no parsedFile or no validRows');
      return;
    }

    setStep('progress');
    progressStageRef.current = 'processing';
    progressValueRef.current = 0;

    const result = await preview(validRows);

    if (result) {
      console.log('[ImportWizard] preview success', result);
      setImportId(result.importId);
      console.log('[ImportWizard] calling setStep confirm');
      setStep('confirm');
      console.log('[ImportWizard] after setStep confirm');
    } else {
      console.log('[ImportWizard] preview failed - no result');
      setToast({
        type: 'error',
        title: 'Error en vista previa',
        message: 'No se pudo generar la vista previa',
      });
      setStep('upload');
    }
  }, [parsedFile, validRows, preview]);

  const handleConfirm = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleCommit = useCallback(async () => {
    if (!importId) return;

    console.log('[ImportWizard] handleCommit called', { importId, policy });
    setShowConfirmModal(false);
    setStep('progress');
    progressStageRef.current = 'committing';
    progressValueRef.current = 0;

    const result = await commit(importId, policy, (progress) => {
      progressValueRef.current = progress.progress;
      progressStageRef.current = progress.stage;
    });

    console.log('[ImportWizard] commit result:', result);

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
    } else {
      console.log('[ImportWizard] commit returned null/undefined');
      setToast({
        type: 'error',
        title: 'Error en importación',
        message: 'No se pudo completar la importación',
      });
      setStep('result');
    }
  }, [importId, policy, commit, onImportSuccess]);

  const handleRowSelect = useCallback((rowIndex: number, selected: boolean) => {
    setSelectedRows((prev) => {
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
        <UploadIcon
          className="mx-auto size-16 text-neutral-400 dark:text-neutral-500"
          aria-hidden={true}
        />
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
        data-testid="file-dropzone"
      />

      <div className="space-y-1 text-sm text-neutral-500 dark:text-neutral-400">
        <p>" Formato: CSV (UTF-8) o Excel (.xlsx)</p>
        <p>" Columnas requeridas: officialNumber, drawDate, modality, numbers</p>
        <p>" Máximo 10 MB / 10,000 filas</p>
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
    const previewRows: ImportPreviewRow[] =
      parsedFile?.rows.map((row, index) => {
        const errors = rowErrors.get(index) ?? [];
        return {
          rowNumber: index + 1,
          date: row.drawDate,
          modality: row.results[0]?.modality ?? '',
          tradicional: row.results.find((r) => r.modality === 'TRADICIONAL')?.numbers ?? null,
          laSegunda: row.results.find((r) => r.modality === 'LA_SEGUNDA')?.numbers ?? null,
          revancha: row.results.find((r) => r.modality === 'REVANCHA')?.numbers ?? null,
          siempreSale: row.results.find((r) => r.modality === 'SIEMPRE_SALE')?.numbers ?? null,
          reintegro: null,
          isValid: errors.length === 0,
          errors: errors.map((e) => ({
            rowNumber: index + 1,
            field: e.path.join('.'),
            message: e.message,
            rawValue: undefined,
          })),
        };
      }) ?? [];

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

        <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            {selectedRows.size} de {validRows.length} filas válidas seleccionadas
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleBack}>
              Atrás
            </Button>
            <Button
              variant="primary"
              onClick={handlePreview}
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

      <PolicySelect value={policy} onChange={setPolicy} validCount={selectedRows.size} />

      <div className="dark:bg-neutral-800/50 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700">
        <h3 className="mb-2 font-medium text-neutral-900 dark:text-neutral-100">Resumen</h3>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500 dark:text-neutral-400">Filas seleccionadas:</dt>
            <dd className="font-medium text-neutral-900 dark:text-neutral-100">
              {selectedRows.size}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500 dark:text-neutral-400">Política de conflicto:</dt>
            <dd className="font-medium capitalize text-neutral-900 dark:text-neutral-100">
              {policy}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={handleBack}>
          Atrás
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? 'Procesando...' : 'Confirmar e importar'}
        </Button>
      </div>
    </div>
  );

  const renderProgressStep = () => (
    <div className="space-y-6 text-center">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        {progressStageRef.current === 'processing'
          ? 'Procesando archivo...'
          : 'Guardando sorteos...'}
      </h2>

      <ImportProgress
        importId={importId ?? ''}
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

  const renderResultStep = () => {
    const isError = toast?.type === 'error';

    return (
      <div className="space-y-6 text-center">
        <div
          className={`mx-auto flex size-16 items-center justify-center rounded-full ${
            isError ? 'dark:bg-error-900/30 bg-error-100' : 'dark:bg-success-700/30 bg-success-100'
          }`}
        >
          {isError ? (
            <ErrorIcon className="size-8 text-error-600 dark:text-error-400" aria-hidden={true} />
          ) : (
            <CheckIcon
              className="size-8 text-success-600 dark:text-success-400"
              aria-hidden={true}
            />
          )}
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {toast?.title ?? 'Importación completada'}
        </h2>
        {toast?.message && (
          <p className="text-neutral-500 dark:text-neutral-400">{toast.message}</p>
        )}

        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={handleReset}>
            Nueva importación
          </Button>
          <Button variant="primary" onClick={handleReset}>
            Volver a sorteos
          </Button>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return <div key="upload-step">{renderUploadStep()}</div>;
      case 'preview':
        return <div key="preview-step">{renderPreviewStep()}</div>;
      case 'confirm':
        return <div key="confirm-step">{renderConfirmStep()}</div>;
      case 'progress':
        return <div key="progress-step">{renderProgressStep()}</div>;
      case 'result':
        return <div key="result-step">{renderResultStep()}</div>;
      default:
        return <div key="upload-step">{renderUploadStep()}</div>;
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6" data-step={step}>
      <div key={renderKey}>{renderStep()}</div>

      {showConfirmModal && (
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirmar importación"
          size="md"
        >
          <p className="mb-4 text-neutral-600 dark:text-neutral-400">
            Se importarán <strong>{selectedRows.size}</strong> sorteos con la política{' '}
            <strong>{policy}</strong>. Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
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
