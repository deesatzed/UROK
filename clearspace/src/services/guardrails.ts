export type SafetyRoute = {
  title: string;
  body: string;
  action: string;
};

const medicalEmergencyPatterns = [
  /\bchest pain\b/i,
  /\bfaint(?:ed|ing)?\b/i,
  /\bsevere breathing trouble\b/i,
  /\bcan(?:not|'t) breathe\b/i,
  /\bstroke\b/i,
  /\bface droop(?:ing)?\b/i,
  /\bone-sided weakness\b/i,
];

const selfHarmPatterns = [
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bhurt myself\b/i,
  /\bsuicidal\b/i,
  /\bunsafe with myself\b/i,
];

export function detectSafetyRoute(text: string): SafetyRoute | null {
  if (selfHarmPatterns.some((pattern) => pattern.test(text))) {
    return {
      title: "Get urgent support now",
      body: "Because you mentioned possible harm to yourself, do not handle this alone. Contact emergency services now if there is immediate danger, or use a local crisis line. In the U.S., call or text 988.",
      action: "Reach a trusted person or crisis support now.",
    };
  }

  if (medicalEmergencyPatterns.some((pattern) => pattern.test(text))) {
    return {
      title: "Get urgent support now",
      body: "Because you mentioned symptoms that can be medical emergencies, do not use this app to decide what is happening. Contact emergency services now if symptoms are new, severe, unusual, or life-threatening. In the U.S., call 911.",
      action: "Reach urgent local help or a trusted person now.",
    };
  }

  return null;
}
