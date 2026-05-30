import "server-only";
import newrelic from "newrelic";

export function getNewRelicBrowserScript() {
  try {
    const script = newrelic.getBrowserTimingHeader({
      hasToRemoveScriptWrapper: true,
      allowTransactionlessInjection: true,
    });

    return script.replace(/<script[^>]*>/gi, "").replace(/<\/script>/gi, "");
  } catch {
    return "";
  }
}
