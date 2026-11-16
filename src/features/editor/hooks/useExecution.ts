import { useCallback, useEffect, useRef, useState } from "react";

import { ApiClientError } from "../../../services/api-client";
import {
  cancelExecution as cancelExecutionRequest,
  createExecution,
  getExecution,
} from "../services/execution.api";
import type {
  CreateExecutionInput,
  ExecutionResult,
  ExecutionStatus,
} from "../services/execution.api";

const POLL_INTERVAL_MS = 1000;

const TERMINAL_STATUSES: ReadonlySet<ExecutionStatus> = new Set([
  "cancelled",
  "success",
  "compilation_error",
  "runtime_error",
  "timeout",
  "internal_error",
]);

export interface ExecutionViewState {
  executionId: string | null;
  status: "idle" | "submitting" | ExecutionStatus;
  result: ExecutionResult | null;
  error: string | null;
  isCancelling: boolean;
}

const INITIAL_STATE: ExecutionViewState = {
  executionId: null,
  status: "idle",
  result: null,
  error: null,
  isCancelling: false,
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Execution request failed.";
}

function isTerminalStatus(status: ExecutionViewState["status"]): boolean {
  return TERMINAL_STATUSES.has(status as ExecutionStatus);
}

interface UseExecutionOptions {
  onAuthenticationRequired: () => Promise<void>;
}

type PollExecution = (
  executionId: string,
  generation: number,
) => Promise<void>;

export function useExecution({
  onAuthenticationRequired,
}: UseExecutionOptions) {
  const [execution, setExecution] = useState(INITIAL_STATE);
  const executionRef = useRef(execution);
  const pollGenerationRef = useRef(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollControllerRef = useRef<AbortController | null>(null);
  const pollRequestRef = useRef<Promise<void> | null>(null);
  const pollExecutionRef = useRef<PollExecution>(async () => {});
  const pollingPausedRef = useRef(false);
  const submissionInFlightRef = useRef(false);
  const cancelInFlightRef = useRef(false);
  const executionActiveRef = useRef(false);

  const updateExecution = useCallback(
    (updates: Partial<ExecutionViewState>) => {
      const next = { ...executionRef.current, ...updates };
      executionRef.current = next;
      setExecution(next);
    },
    [],
  );

  const stopPolling = useCallback(() => {
    pollGenerationRef.current += 1;
    pollingPausedRef.current = true;

    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    pollControllerRef.current?.abort();
    pollControllerRef.current = null;
  }, []);

  const pollExecution = useCallback(
    async (executionId: string, generation: number) => {
      if (
        generation !== pollGenerationRef.current ||
        pollingPausedRef.current ||
        pollRequestRef.current
      ) {
        return;
      }

      const controller = new AbortController();
      pollControllerRef.current = controller;

      const request = (async () => {
        try {
          const result = await getExecution(executionId, controller.signal);

          if (generation !== pollGenerationRef.current) return;

          updateExecution({
            status: result.status,
            result,
            error: null,
            isCancelling: false,
          });

          if (isTerminalStatus(result.status)) {
            executionActiveRef.current = false;
          }
        } catch (error) {
          if (controller.signal.aborted || generation !== pollGenerationRef.current) {
            return;
          }

          if (error instanceof ApiClientError && error.statusCode === 401) {
            executionActiveRef.current = false;
            updateExecution({ error: "Your session has expired." });
            stopPolling();
            await onAuthenticationRequired();
            return;
          }

          updateExecution({ error: getErrorMessage(error) });

          if (
            error instanceof ApiClientError &&
            error.statusCode >= 400 &&
            error.statusCode < 500 &&
            error.statusCode !== 429
          ) {
            executionActiveRef.current = false;
            return;
          }
        }
      })();

      pollRequestRef.current = request;
      await request;

      if (pollRequestRef.current === request) {
        pollRequestRef.current = null;
      }

      if (pollControllerRef.current === controller) {
        pollControllerRef.current = null;
      }

      if (
        generation === pollGenerationRef.current &&
        !pollingPausedRef.current &&
        executionActiveRef.current
      ) {
        pollTimerRef.current = setTimeout(() => {
          pollTimerRef.current = null;
          void pollExecutionRef.current(executionId, generation);
        }, POLL_INTERVAL_MS);
      }
    },
    [onAuthenticationRequired, stopPolling, updateExecution],
  );

  const startPolling = useCallback(
    (executionId: string) => {
      pollingPausedRef.current = false;
      void pollExecution(executionId, pollGenerationRef.current);
    },
    [pollExecution],
  );

  const submitExecution = useCallback(
    async (input: CreateExecutionInput) => {
      if (submissionInFlightRef.current || executionActiveRef.current) return;

      submissionInFlightRef.current = true;
      executionActiveRef.current = true;
      stopPolling();
      pollingPausedRef.current = false;
      const generation = pollGenerationRef.current;

      updateExecution({
        executionId: null,
        status: "submitting",
        result: null,
        error: null,
        isCancelling: false,
      });

      try {
        const created = await createExecution(input);

        if (generation !== pollGenerationRef.current) return;

        updateExecution({
          executionId: created.executionId,
          status: created.status,
        });
        startPolling(created.executionId);
      } catch (error) {
        executionActiveRef.current = false;
        updateExecution({
          status: "idle",
          error: getErrorMessage(error),
        });

        if (error instanceof ApiClientError && error.statusCode === 401) {
          await onAuthenticationRequired();
        }
      } finally {
        submissionInFlightRef.current = false;
      }
    },
    [
      onAuthenticationRequired,
      startPolling,
      stopPolling,
      updateExecution,
    ],
  );

  const pausePolling = useCallback(async () => {
    pollingPausedRef.current = true;

    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    if (pollRequestRef.current) {
      await pollRequestRef.current;
    }
  }, []);

  const cancel = useCallback(async () => {
    const current = executionRef.current;

    if (
      !current.executionId ||
      (current.status !== "queued" && current.status !== "running") ||
      cancelInFlightRef.current
    ) {
      return;
    }

    cancelInFlightRef.current = true;
    updateExecution({ isCancelling: true, error: null });

    try {
      await pausePolling();

      const pausedState = executionRef.current;

      if (
        !executionActiveRef.current ||
        !pausedState.executionId ||
        (pausedState.status !== "queued" && pausedState.status !== "running")
      ) {
        updateExecution({ isCancelling: false });
        return;
      }

      const executionId = pausedState.executionId;
      const result = await cancelExecutionRequest(executionId);

      if (result.status === "cancelled") {
        stopPolling();
        executionActiveRef.current = false;
        updateExecution({
          status: "cancelled",
          result:
            executionRef.current.result === null
              ? null
              : { ...executionRef.current.result, status: "cancelled" },
          isCancelling: false,
        });
        return;
      }

      updateExecution({
        status: "cancelling",
        isCancelling: false,
      });
      startPolling(executionId);
    } catch (error) {
      updateExecution({
        error: getErrorMessage(error),
        isCancelling: false,
      });

      if (error instanceof ApiClientError && error.statusCode === 401) {
        stopPolling();
        executionActiveRef.current = false;
        await onAuthenticationRequired();
      } else if (
        error instanceof ApiClientError &&
        error.statusCode === 404
      ) {
        stopPolling();
        executionActiveRef.current = false;
      } else {
        const latestExecutionId = executionRef.current.executionId;
        if (latestExecutionId && executionActiveRef.current) {
          startPolling(latestExecutionId);
        }
      }
    } finally {
      cancelInFlightRef.current = false;
    }
  }, [
    onAuthenticationRequired,
    pausePolling,
    startPolling,
    stopPolling,
    updateExecution,
  ]);

  const reportError = useCallback(
    (message: string) => updateExecution({ error: message }),
    [updateExecution],
  );

  useEffect(() => {
    pollExecutionRef.current = pollExecution;
  }, [pollExecution]);

  const clearExecution = useCallback(() => {
    if (executionActiveRef.current || submissionInFlightRef.current) return;

    stopPolling();
    updateExecution(INITIAL_STATE);
  }, [stopPolling, updateExecution]);

  useEffect(
    () => () => {
      stopPolling();
    },
    [stopPolling],
  );

  return {
    execution,
    submitExecution,
    cancelExecution: cancel,
    reportError,
    clearExecution,
  };
}
