import { motion } from "framer-motion";
import clsx from "clsx";

type SealState = "idle" | "pressing" | "verified" | "revoked" | "not-found";

const STATE_COPY: Record<SealState, string> = {
  idle: "AWAITING",
  pressing: "STAMPING",
  verified: "VERIFIED",
  revoked: "REVOKED",
  "not-found": "NO RECORD",
};

const STATE_COLOR: Record<SealState, string> = {
  idle: "fill-ash",
  pressing: "fill-brass",
  verified: "fill-ledger",
  revoked: "fill-seal",
  "not-found": "fill-ash",
};

/**
 * A pressed wax seal that doubles as the verification result. Idle = pale
 * brass outline (unpressed wax); pressing = a single press-down animation;
 * verified/revoked = the seal "sets" in ledger-green or seal-crimson ink.
 * This is the one deliberately theatrical moment on the page — everything
 * else stays quiet so this reads clearly.
 */
export function WaxSeal({ state, size = 128 }: { state: SealState; size?: number }) {
  return (
    <div className="relative flex flex-col items-center gap-3">
      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        initial={false}
        animate={
          state === "pressing"
            ? { scale: [1, 0.86, 1.04, 1] }
            : { scale: 1 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        role="img"
        aria-label={`Certificate status: ${STATE_COPY[state]}`}
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          className={clsx("transition-colors duration-500", STATE_COLOR[state])}
          fillOpacity={state === "idle" ? 0.12 : 0.16}
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.35"
        />
        <circle
          cx="100"
          cy="100"
          r="78"
          fill="none"
          className={clsx("transition-colors duration-500", STATE_COLOR[state])}
          stroke="currentColor"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeDasharray="2 6"
        />
        <text
          x="100"
          y="94"
          textAnchor="middle"
          className={clsx("font-display transition-colors duration-500", STATE_COLOR[state])}
          fill="currentColor"
          fontSize="15"
          letterSpacing="1.5"
        >
          {state === "verified" ? "VeriCert" : state === "revoked" ? "Revoked" : "Sealed"}
        </text>
        <text
          x="100"
          y="118"
          textAnchor="middle"
          className={clsx("font-mono transition-colors duration-500", STATE_COLOR[state])}
          fill="currentColor"
          fontSize="10"
          letterSpacing="3"
        >
          {STATE_COPY[state]}
        </text>
      </motion.svg>
    </div>
  );
}

export type { SealState };
