import React from "react"
import { aggregateQiOutputs } from "@pelagus/pelagus-background/redux-slices/accounts"
import {
  selectAggregateQiOutputsInProgress,
  selectAggregationProgress,
  selectQiWalletAggregationError,
  selectQiWalletAggregationRequired,
  selectSpendableQiOutpointCount,
} from "@pelagus/pelagus-background/redux-slices/ui"
import { useBackgroundDispatch, useBackgroundSelector } from "../../hooks"

const DEFAULT_MAX_DENOMINATION_AGGREGATE = 5
const DEFAULT_MAX_DENOMINATION_OUTPUT = 10

export default function QiReaggregationBanner() {
  const dispatch = useBackgroundDispatch()
  const aggregationRequired = useBackgroundSelector(
    selectQiWalletAggregationRequired
  )
  const aggregateQiOutputsInProgress = useBackgroundSelector(
    selectAggregateQiOutputsInProgress
  )
  const aggregationProgress = useBackgroundSelector(selectAggregationProgress)
  const aggregationError = useBackgroundSelector(selectQiWalletAggregationError)
  const spendableOutpointCount = useBackgroundSelector(
    selectSpendableQiOutpointCount
  )

  if (!aggregationRequired && !aggregateQiOutputsInProgress && !aggregationError) {
    return null
  }

  return (
    <>
      <section className="banner">
        <div className="copy">
          <h3>Qi wallet requires reaggregation</h3>
          <p>
            {aggregateQiOutputsInProgress
              ? "Aggregating Qi outputs in the background. Spending stays blocked until this finishes."
              : `This wallet has ${spendableOutpointCount} spendable outpoints. Reaggregate to continue using Qi send, wrap, and convert.`}
          </p>
          {aggregationError && !aggregateQiOutputsInProgress && (
            <p className="error">{aggregationError}</p>
          )}
        </div>

        {aggregateQiOutputsInProgress ? (
          <div className="progressWrap">
            <div className="spinner" />
            <div className="progressText">
              <div>{aggregationProgress.step || "Aggregating outputs"}</div>
              <div>{aggregationProgress.progress}%</div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="action"
            onClick={() =>
              dispatch(
                aggregateQiOutputs({
                  maxDenominationAggregate: DEFAULT_MAX_DENOMINATION_AGGREGATE,
                  maxDenominationOutput: DEFAULT_MAX_DENOMINATION_OUTPUT,
                })
              )
            }
          >
            Reaggregate
          </button>
        )}
      </section>
      <style jsx>{`
        .banner {
          width: calc(100% - 32px);
          margin: 8px 16px 0;
          padding: 16px;
          border-radius: 12px;
          background: #fff4d6;
          border: 1px solid #c48b00;
          display: flex;
          gap: 16px;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .copy {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        h3,
        p {
          margin: 0;
        }

        h3 {
          font-size: 16px;
          line-height: 20px;
          color: #5a3d00;
        }

        p {
          font-size: 13px;
          line-height: 18px;
          color: #6e5315;
        }

        .error {
          color: var(--error-color);
        }

        .action {
          border: none;
          border-radius: 999px;
          background: #5a3d00;
          color: white;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 18px;
          cursor: pointer;
          white-space: nowrap;
        }

        .progressWrap {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 156px;
          justify-content: flex-end;
        }

        .progressText {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #5a3d00;
          text-align: right;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(90, 61, 0, 0.2);
          border-top-color: #5a3d00;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}
