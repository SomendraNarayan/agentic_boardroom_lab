/**
 * CLASSROOM ACCESS GATE
 * ---------------------
 * This is a lightweight, CLIENT-SIDE access gate for classroom use. It deters casual
 * access (e.g. keeps a shared link from being trivially opened by anyone who finds it)
 * and lets an instructor hand out a class passcode.
 *
 * IT IS NOT AUTHENTICATION OR SECURITY. Because this is a fully client-side app, every
 * passcode and check shipped here is visible to anyone who opens the browser dev tools
 * or reads the source. Do NOT place anything sensitive behind this gate, and do not rely
 * on it to protect graded or confidential material. See SECURITY.md for the full model.
 *
 * The "admin" distinction below unlocks the instructor view. It is a convenience toggle,
 * NOT a privilege boundary. An instructor passcode can optionally be injected at build
 * time via VITE_INSTRUCTOR_PASSCODE; if none is set, a documented default is used purely
 * so the instructor view is reachable in a classroom. This is deterrence, not protection.
 */

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.toUpperCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Instructor (admin-view) passcode. Prefer a build-time injected value; fall back to a
// documented default so the instructor view is reachable in a fresh classroom checkout.
// NOTE: this is NOT secret — it ships in the client bundle. It is a convenience toggle only.
const INSTRUCTOR_PASSCODE: string =
  (import.meta as { env?: Record<string, string> }).env?.VITE_INSTRUCTOR_PASSCODE ||
  'INSTRUCTOR-VIEW';

export const MASTER_ADMIN_PASSCODES = [INSTRUCTOR_PASSCODE.toUpperCase().trim()];

// Helper to get active dynamic year passkeys (e.g. ABS2026, ABS2027, etc.)
export function getDynamicYearPasskeys(state?: SecurityState): string[] {
  const prefix = state?.defaultKeyPrefix || "ABS";
  const startYear = state?.defaultYearStart || 2026;
  const keys: string[] = [];
  // Support active current year and next 10 years automatically for self-sustaining classroom longevity
  for (let y = startYear; y <= startYear + 10; y++) {
    keys.push(`${prefix}${y}`);
    keys.push(`ADTL${y}`);
  }
  return keys;
}

export interface CustomPasscode {
  id: string;
  code: string; // Plaintext or reference
  isHashed: boolean;
  label: string;
  createdOn: string;
}

export interface SecurityState {
  isEnabled: boolean;
  allowDefaultKeys: boolean;
  customKeys: CustomPasscode[];
  defaultKeyPrefix?: string;
  defaultYearStart?: number;
}

const STORAGE_KEY = 'adtl_security_profile_v1';

// Load state from local storage or return defaults
export function getSecurityState(): SecurityState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Backwards compatibility patching
      if (parsed.defaultKeyPrefix === undefined) parsed.defaultKeyPrefix = "ABS";
      if (parsed.defaultYearStart === undefined) parsed.defaultYearStart = 2026;
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load security state", e);
  }

  return {
    isEnabled: true,
    allowDefaultKeys: true,
    defaultKeyPrefix: "ABS",
    defaultYearStart: 2026,
    customKeys: [
      {
        id: 'default-1',
        code: 'SEMINAR-AI',
        isHashed: false,
        label: 'Default Seminar Invite Key',
        createdOn: new Date().toLocaleDateString()
      }
    ]
  };
}

// Save state to local storage
export function saveSecurityState(state: SecurityState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save security state", e);
  }
}

/**
 * Validates whether a typed passcode is authorized.
 * Returns { isValid: boolean, isAdmin: boolean }
 */
export async function validateAccessDetails(typedCode: string): Promise<{ isValid: boolean; isAdmin: boolean }> {
  const normalized = typedCode.toUpperCase().trim();
  if (!normalized) return { isValid: false, isAdmin: false };

  // 1. Check if it matches an admin master passcode
  if (MASTER_ADMIN_PASSCODES.includes(normalized)) {
    return { isValid: true, isAdmin: true };
  }

  const state = getSecurityState();

  // If gating is globally disabled, everything unlocks
  if (!state.isEnabled) {
    return { isValid: true, isAdmin: false };
  }

  // 2. Check dynamic default class keys (e.g. "ABS2026", "ADTL2027" etc.) if allowed
  if (state.allowDefaultKeys) {
    const dynamicKeys = getDynamicYearPasskeys(state);
    if (dynamicKeys.includes(normalized)) {
      return { isValid: true, isAdmin: false };
    }
  }

  // 3. Check custom passcodes defined in the instructor panel.
  // Hashed entries are compared against the computed hash only (never plaintext),
  // so a stored hash does not silently also accept its own hash string as plaintext.
  const computedHash = await sha256(normalized);
  for (const item of state.customKeys) {
    const compareTarget = item.code.trim();
    if (item.isHashed) {
      if (computedHash === compareTarget.toLowerCase()) {
        return { isValid: true, isAdmin: false };
      }
    } else {
      if (normalized === compareTarget.toUpperCase()) {
        return { isValid: true, isAdmin: false };
      }
    }
  }

  return { isValid: false, isAdmin: false };
}

